import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR', orderId } = await request.json();

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpayKeyId && razorpayKeySecret) {
      // Basic auth for Razorpay API
      const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100), // amount in paise
          currency,
          receipt: orderId || `receipt_${Date.now()}`,
        }),
      });

      const data = await res.json();
      return NextResponse.json({ success: true, razorpayOrder: data, key: razorpayKeyId });
    }

    // Fallback: simulated Razorpay order for instant local testing
    return NextResponse.json({
      success: true,
      simulated: true,
      razorpayOrder: {
        id: `rzp_sim_${Date.now()}`,
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
      },
      key: razorpayKeyId || 'rzp_test_placeholder',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
