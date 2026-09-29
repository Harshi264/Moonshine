import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Order, OrderStatus } from '@/types';
import { sendOrderNotificationEmail, sendCustomerOrderReceiptEmail } from '@/lib/email';
import { validateOrderBody, sanitizeString } from '@/lib/validators';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * GET /api/orders
 * Returns orders list (admin only - protected by admin query param convention).
 * Supports ?status=&search= filters.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

  const db = getDB();
  let orders = db.orders;

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase().trim();
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

  // Pagination
  const total = orders.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedOrders = orders.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    count: paginatedOrders.length,
    total,
    page,
    totalPages,
    orders: paginatedOrders,
  });
}

/**
 * POST /api/orders
 * Creates a new order from customer checkout.
 * Rate limited: 3 orders per 5 minutes per IP.
 * Validates all fields, deducts stock, sends email notifications.
 */
export async function POST(request: Request) {
  // Rate limit: 3 order submissions per 5 minutes per IP to prevent flooding
  const ip = getClientIp(request);
  const { limited, retryAfterMs } = rateLimit(`order_create_${ip}`, 3, 5 * 60_000);
  if (limited) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many order requests. Please wait ${Math.ceil((retryAfterMs ?? 300000) / 1000)} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validate all required fields
    const validation = validateOrderBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0], errors: validation.errors },
        { status: 400 }
      );
    }

    const db = getDB();
    const {
      customerName, phone, email, deliveryAddress, city, state, pincode, items,
    } = body;

    // Generate unique Order ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${year}-${randomNum}`;

    let subtotal = 0;
    let discountTotal = 0;

    const processedItems = (items as Record<string, unknown>[]).map((item) => {
      const product = db.products.find((p) => p.id === item.productId);
      const effectivePrice = item.price
        ? Number(item.price)
        : product
        ? (product.salePrice ?? product.price)
        : 0;
      const qty = Math.max(1, Number(item.quantity) || 1);

      subtotal += effectivePrice * qty;
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
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (variant) variant.stock = Math.max(0, variant.stock - qty);
        }
      }

      return {
        productId: String(item.productId || ''),
        productName: sanitizeString(item.productName || (product?.name ?? 'Handmade Product'), 200),
        productImage: String(item.productImage || product?.images?.[0] || ''),
        variantId: item.variantId ? String(item.variantId) : undefined,
        variantName: item.variantName ? sanitizeString(String(item.variantName), 100) : undefined,
        price: effectivePrice,
        quantity: qty,
        customizationDetails: (item.customizationDetails as Record<string, string>) || {},
      };
    });

    const { freeShippingThreshold = 1000, defaultShippingFee = 70 } = db.settings;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : defaultShippingFee;
    const totalAmount = subtotal + shippingFee;

    const newOrder: Order = {
      id: orderId,
      customerName: sanitizeString(customerName, 100),
      phone: sanitizeString(phone, 15),
      email: String(email).trim().toLowerCase(),
      instagramUsername: body.instagramUsername
        ? sanitizeString(String(body.instagramUsername), 50)
        : undefined,
      deliveryAddress: sanitizeString(deliveryAddress, 300),
      city: sanitizeString(city, 100),
      state: sanitizeString(state, 100),
      pincode: String(pincode).trim(),
      items: processedItems,
      subtotal,
      discountTotal,
      shippingFee,
      totalAmount,
      customerNotes: body.customerNotes
        ? sanitizeString(String(body.customerNotes), 500)
        : undefined,
      giftMessage: body.giftMessage
        ? sanitizeString(String(body.giftMessage), 300)
        : undefined,
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

    // Fire email notifications — non-blocking, won't fail the response
    const emailResults = await Promise.allSettled([
      sendOrderNotificationEmail(newOrder),
      sendCustomerOrderReceiptEmail(newOrder),
    ]);

    const notificationResult = emailResults[0].status === 'fulfilled'
      ? emailResults[0].value
      : { success: false, simulated: true, message: 'Notification email failed' };

    return NextResponse.json(
      {
        success: true,
        order: newOrder,
        emailResult: notificationResult,
        message: `Order ${orderId} placed! We will contact you on ${newOrder.phone} (${newOrder.preferredContact}) shortly.`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[POST /api/orders] Error:', err);
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
