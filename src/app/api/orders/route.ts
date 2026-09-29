import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Order, OrderStatus } from '@/types';
import { sendOrderNotificationEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const db = getDB();
  let orders = db.orders;

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.phone.includes(s) ||
        o.email.toLowerCase().includes(s) ||
        (o.instagramUsername && o.instagramUsername.toLowerCase().includes(s))
    );
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ success: true, count: orders.length, orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    // Required fields validation
    const { customerName, phone, email, deliveryAddress, city, state, pincode, items } = body;

    if (!customerName || !phone || !email || !deliveryAddress || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required delivery & contact details.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty.' }, { status: 400 });
    }

    // Generate unique Order ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${year}-${randomNum}`;

    // Calculate totals
    let subtotal = 0;
    let discountTotal = 0;

    const processedItems = items.map((item: any) => {
      const product = db.products.find((p) => p.id === item.productId);
      const price = item.price || (product ? product.salePrice || product.price : 0);
      const originalPrice = product ? product.price : price;
      const qty = Math.max(1, Number(item.quantity) || 1);

      subtotal += price * qty;
      if (product && product.salePrice && product.price > product.salePrice) {
        discountTotal += (product.price - product.salePrice) * qty;
      }

      // Deduct product stock
      if (product) {
        product.stock = Math.max(0, product.stock - qty);
        if (product.stock === 0) {
          product.status = 'out_of_stock';
        }
        if (item.variantId && product.variants) {
          const v = product.variants.find((v) => v.id === item.variantId);
          if (v) v.stock = Math.max(0, v.stock - qty);
        }
      }

      return {
        productId: item.productId,
        productName: item.productName || (product ? product.name : 'Handmade Product'),
        productImage: item.productImage || (product ? product.images[0] : ''),
        variantId: item.variantId,
        variantName: item.variantName,
        price,
        quantity: qty,
        customizationDetails: item.customizationDetails || {},
      };
    });

    const settings = db.settings;
    const shippingFee = subtotal >= (settings.freeShippingThreshold || 1500) ? 0 : (settings.defaultShippingFee || 70);
    const totalAmount = subtotal + shippingFee;

    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      instagramUsername: body.instagramUsername ? body.instagramUsername.trim() : undefined,
      deliveryAddress: deliveryAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      items: processedItems,
      subtotal,
      discountTotal,
      shippingFee,
      totalAmount,
      customerNotes: body.customerNotes,
      giftMessage: body.giftMessage,
      preferredContact: body.preferredContact || 'WhatsApp',
      status: 'New',
      statusHistory: [
        {
          status: 'New',
          timestamp: new Date().toISOString(),
          note: 'Order submitted by customer',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    saveDB(db);

    // Send email notification (non-blocking failure protection)
    let emailResult = { success: true, simulated: true, message: 'Notification queued' };
    try {
      emailResult = await sendOrderNotificationEmail(newOrder);
    } catch (e) {
      console.error('Email trigger warning:', e);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      emailResult,
      message: 'Order request submitted successfully! We will contact you shortly.',
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
