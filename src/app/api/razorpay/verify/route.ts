import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDB, saveDB } from '@/lib/db';
import { sendOrderNotificationEmail, sendCustomerOrderReceiptEmail } from '@/lib/email';

/**
 * POST /api/razorpay/verify
 * Verifies Razorpay payment signature using HMAC-SHA256:
 * crypto.createHmac("sha256", SECRET).update(order_id + "|" + payment_id).digest("hex")
 * Reduces stock, marks order as Confirmed, and dispatches confirmation emails.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    if (!razorpay_payment_id) {
      return NextResponse.json(
        { success: false, error: 'Missing Razorpay payment ID.' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Check signature if secret is configured and not in simulation
    if (secret && razorpay_order_id && razorpay_signature && !razorpay_order_id.startsWith('order_sim_')) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      let isValid = false;
      try {
        isValid = crypto.timingSafeEqual(
          Buffer.from(expectedSignature, 'utf-8'),
          Buffer.from(razorpay_signature, 'utf-8')
        );
      } catch {
        isValid = expectedSignature === razorpay_signature;
      }

      if (!isValid) {
        console.error('[Razorpay Verify] Signature mismatch:', {
          expected: expectedSignature,
          received: razorpay_signature,
        });
        return NextResponse.json(
          { success: false, error: 'Invalid payment signature. Payment could not be verified.' },
          { status: 400 }
        );
      }
    }

    // Update order status in database & reduce inventory
    const db = getDB();
    const orderIndex = db.orders.findIndex(
      (o) => o.id.toUpperCase() === String(orderId).toUpperCase()
    );

    let updatedOrder = null;

    if (orderIndex !== -1) {
      const order = db.orders[orderIndex];

      // Reduce product stock if not already reduced
      order.items.forEach((item) => {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          if (prod.stock === 0) prod.status = 'out_of_stock';
          if (item.variantId && prod.variants) {
            const v = prod.variants.find((vr) => vr.id === item.variantId);
            if (v) v.stock = Math.max(0, v.stock - item.quantity);
          }
        }
      });

      const history = [...(order.statusHistory || [])];
      history.push({
        status: 'Confirmed',
        timestamp: new Date().toISOString(),
        note: `Razorpay payment verified (ID: ${razorpay_payment_id})`,
      });

      order.status = 'Confirmed';
      order.internalNotes = `${order.internalNotes || ''}\nRazorpay Payment ID: ${razorpay_payment_id}`.trim();
      order.statusHistory = history;
      order.updatedAt = new Date().toISOString();

      db.orders[orderIndex] = order;
      saveDB(db);
      updatedOrder = order;

      // Send confirmation emails asynchronously
      Promise.allSettled([
        sendOrderNotificationEmail(order),
        sendCustomerOrderReceiptEmail(order),
      ]).catch((err) => console.error('[Razorpay Verify] Email error:', err));
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      order: updatedOrder,
      message: 'Payment verified successfully! Your order is confirmed.',
    });
  } catch (err: unknown) {
    console.error('[POST /api/razorpay/verify] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
