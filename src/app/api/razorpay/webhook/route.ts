import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDB, saveDB } from '@/lib/db';
import { sendOrderNotificationEmail, sendCustomerOrderReceiptEmail } from '@/lib/email';

/**
 * POST /api/razorpay/webhook
 * Handles Razorpay webhook events: payment.captured, payment.failed, refund.processed.
 * Verifies X-Razorpay-Signature header against RAZORPAY_WEBHOOK_SECRET.
 * Idempotent processing ensures duplicate events don't duplicate orders.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      let isValid = false;
      try {
        isValid = crypto.timingSafeEqual(
          Buffer.from(expectedSignature, 'utf-8'),
          Buffer.from(signature, 'utf-8')
        );
      } catch {
        isValid = expectedSignature === signature;
      }

      if (!isValid) {
        console.error('[Razorpay Webhook] Invalid signature mismatch');
        return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const payload = event.payload?.payment?.entity || event.payload?.refund?.entity;

    const receiptOrderId = payload?.notes?.orderId || payload?.receipt;
    const paymentId = payload?.id;

    const db = getDB();

    if (eventType === 'payment.captured' && receiptOrderId) {
      const idx = db.orders.findIndex(
        (o) => o.id.toUpperCase() === String(receiptOrderId).toUpperCase()
      );

      if (idx !== -1) {
        const order = db.orders[idx];

        // Idempotency check: if already confirmed with this payment ID, return 200 OK
        if (order.status === 'Confirmed' && order.internalNotes?.includes(paymentId)) {
          return NextResponse.json({ success: true, message: 'Event already processed' });
        }

        // Mark as confirmed
        const history = [...(order.statusHistory || [])];
        history.push({
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          note: `Webhook payment.captured (ID: ${paymentId})`,
        });

        order.status = 'Confirmed';
        order.internalNotes = `${order.internalNotes || ''}\nWebhook Captured ID: ${paymentId}`.trim();
        order.statusHistory = history;
        order.updatedAt = new Date().toISOString();

        db.orders[idx] = order;
        saveDB(db);

        // Fire confirmation email if not already sent
        Promise.allSettled([
          sendOrderNotificationEmail(order),
          sendCustomerOrderReceiptEmail(order),
        ]).catch((err) => console.error('[Webhook] Email error:', err));
      }
    } else if (eventType === 'payment.failed' && receiptOrderId) {
      const idx = db.orders.findIndex(
        (o) => o.id.toUpperCase() === String(receiptOrderId).toUpperCase()
      );
      if (idx !== -1 && db.orders[idx].status === 'New') {
        const order = db.orders[idx];
        const history = [...(order.statusHistory || [])];
        history.push({
          status: 'New',
          timestamp: new Date().toISOString(),
          note: `Payment attempt failed via webhook: ${payload?.error_description || 'Unknown reason'}`,
        });
        order.statusHistory = history;
        saveDB(db);
      }
    } else if (eventType === 'refund.processed' && receiptOrderId) {
      const idx = db.orders.findIndex(
        (o) => o.id.toUpperCase() === String(receiptOrderId).toUpperCase()
      );
      if (idx !== -1) {
        const order = db.orders[idx];
        order.internalNotes = `${order.internalNotes || ''}\nRefund processed: ₹${(payload?.amount || 0) / 100} (Refund ID: ${payload?.id})`.trim();
        saveDB(db);
      }
    }

    return NextResponse.json({ success: true, event: eventType });
  } catch (err: unknown) {
    console.error('[Razorpay Webhook Error]:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
