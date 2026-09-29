import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDB, saveDB } from '@/lib/db';

/**
 * POST /api/razorpay/verify-payment
 * Verifies Razorpay payment signature using HMAC-SHA256.
 * Called after successful Razorpay checkout to confirm the payment is authentic.
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }
 */
export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Razorpay payment details (order_id, payment_id, signature).',
        },
        { status: 400 }
      );
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeySecret) {
      // In dev/test mode without keys: trust and mark order as payment received
      console.warn('[verify-payment] No RAZORPAY_KEY_SECRET set — skipping HMAC verification (dev mode).');

      if (orderId) {
        await markOrderPaymentReceived(orderId, razorpay_payment_id, true);
      }

      return NextResponse.json({
        success: true,
        verified: true,
        simulated: true,
        message: 'Payment verified (dev mode — no signature check).',
      });
    }

    // HMAC-SHA256 signature verification
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    );

    if (!isValid) {
      console.error('[verify-payment] Signature mismatch — possible tampered request.', {
        razorpay_order_id,
        razorpay_payment_id,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed. Invalid signature.',
        },
        { status: 400 }
      );
    }

    // Mark the order as payment received
    if (orderId) {
      await markOrderPaymentReceived(orderId, razorpay_payment_id, false);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully.',
      paymentId: razorpay_payment_id,
    });
  } catch (err: unknown) {
    console.error('[POST /api/razorpay/verify-payment] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/** Updates an order status to 'Confirmed' and logs the Razorpay payment ID */
async function markOrderPaymentReceived(
  orderId: string,
  paymentId: string,
  simulated: boolean
) {
  try {
    const db = getDB();
    const idx = db.orders.findIndex(
      (o) => o.id.toUpperCase() === String(orderId).toUpperCase()
    );

    if (idx !== -1 && db.orders[idx].status === 'New') {
      const history = [...(db.orders[idx].statusHistory || [])];
      history.push({
        status: 'Confirmed',
        timestamp: new Date().toISOString(),
        note: simulated
          ? 'Payment received (simulated / dev mode)'
          : `Razorpay payment confirmed — ID: ${paymentId}`,
      });

      db.orders[idx] = {
        ...db.orders[idx],
        status: 'Confirmed',
        internalNotes: `${db.orders[idx].internalNotes || ''}\nRazorpay payment ID: ${paymentId}`.trim(),
        statusHistory: history,
        updatedAt: new Date().toISOString(),
      };

      saveDB(db);
    }
  } catch (err) {
    console.error('[verify-payment] Failed to update order status:', err);
  }
}
