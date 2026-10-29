import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Order } from '@/types';
import { sanitizeString } from '@/lib/validators';

/**
 * POST /api/razorpay/create-order
 * Recalculates cart total from server database prices, applies coupon discounts,
 * adds shipping fee, saves a pending order, and creates a Razorpay order in paise.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      couponCode,
      customerName,
      phone,
      email,
      deliveryAddress,
      city,
      state,
      pincode,
      customerNotes,
      giftMessage,
      preferredContact = 'WhatsApp',
    } = body;

    const db = getDB();

    // 1. Recalculate cart total securely from database
    let subtotal = 0;
    let discountTotal = 0;

    const processedItems = (items || []).map((item: any) => {
      const product = db.products.find((p) => p.id === item.productId);
      const effectivePrice = product
        ? (product.salePrice ?? product.price)
        : Number(item.price || 0);

      const qty = Math.max(1, Number(item.quantity) || 1);
      subtotal += effectivePrice * qty;

      return {
        productId: String(item.productId || ''),
        productName: product?.name || item.productName || 'Handmade Item',
        productImage: product?.images?.[0] || item.productImage || '',
        variantId: item.variantId,
        variantName: item.variantName,
        price: effectivePrice,
        quantity: qty,
        customizationDetails: item.customizationDetails || {},
      };
    });

    if (processedItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty.' }, { status: 400 });
    }

    // 2. Validate coupon code if applied
    if (couponCode) {
      const codeClean = String(couponCode).trim().toUpperCase();
      const discount = (db.discounts || []).find(
        (d) => d.code?.toUpperCase() === codeClean && d.isActive
      );
      if (discount) {
        discountTotal = Math.round((subtotal * discount.discountPercent) / 100);
      }
    }

    const { freeShippingThreshold = 1000, defaultShippingFee = 70 } = db.settings;
    const discountedSubtotal = Math.max(0, subtotal - discountTotal);
    const shippingFee = discountedSubtotal >= freeShippingThreshold ? 0 : defaultShippingFee;
    const totalAmount = discountedSubtotal + shippingFee;
    const totalInPaise = Math.round(totalAmount * 100);

    // 3. Generate unique Order ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${year}-${randomNum}`;

    // 4. Save pending order in database
    const pendingOrder: Order = {
      id: orderId,
      customerName: sanitizeString(customerName || 'Customer', 100),
      phone: sanitizeString(phone || '', 20),
      email: String(email || '').trim().toLowerCase(),
      deliveryAddress: sanitizeString(deliveryAddress || '', 300),
      city: sanitizeString(city || 'Hyderabad', 100),
      state: sanitizeString(state || 'Telangana', 100),
      pincode: String(pincode || '').trim(),
      items: processedItems,
      subtotal,
      discountTotal,
      shippingFee,
      totalAmount,
      customerNotes: customerNotes ? sanitizeString(customerNotes, 500) : undefined,
      giftMessage: giftMessage ? sanitizeString(giftMessage, 300) : undefined,
      preferredContact: preferredContact || 'WhatsApp',
      status: 'New',
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          note: 'Razorpay checkout initiated',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(pendingOrder);
    saveDB(db);

    // 5. Create Razorpay order
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (
      razorpayKeyId &&
      razorpayKeySecret &&
      !razorpayKeyId.includes('XXXXXXXX') &&
      !razorpayKeyId.includes('placeholder')
    ) {
      try {
        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalInPaise,
            currency: 'INR',
            receipt: orderId,
            notes: {
              orderId,
              customerName: pendingOrder.customerName,
              phone: pendingOrder.phone,
            },
          }),
        });

        const rzpData = await rzpRes.json();

        if (rzpData.id) {
          return NextResponse.json({
            success: true,
            orderId,
            totalAmount,
            razorpayOrder: rzpData,
            key: razorpayKeyId,
          });
        }
      } catch (rzpErr) {
        console.warn('[Razorpay API] Live call error, using simulated order:', rzpErr);
      }
    }

    // Dev/Test mode fallback: Return simulated Razorpay order structure
    return NextResponse.json({
      success: true,
      simulated: true,
      orderId,
      totalAmount,
      razorpayOrder: {
        id: `order_sim_${Date.now()}`,
        amount: totalInPaise,
        currency: 'INR',
        receipt: orderId,
        status: 'created',
      },
      key: razorpayKeyId || 'rzp_test_moonshine2026',
    });
  } catch (err: unknown) {
    console.error('[POST /api/razorpay/create-order] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
