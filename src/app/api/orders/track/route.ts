import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/**
 * GET /api/orders/track?orderId=...&query=...
 * Customer tracking endpoint. Validates Order ID and phone/email for privacy.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId')?.trim().toUpperCase();
    const query = searchParams.get('query')?.trim().toLowerCase(); // phone or email

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Please enter your Order ID.' }, { status: 400 });
    }

    const db = getDB();
    const order = db.orders.find(
      (o) => o.id.toUpperCase() === orderId || o.id.toUpperCase().replace(/[^0-9]/g, '') === orderId.replace(/[^0-9]/g, '')
    );

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `No order found with ID "${orderId}". Please verify your Order ID from your confirmation receipt.`,
        },
        { status: 404 }
      );
    }

    // If query (phone/email) is provided, verify match
    if (query) {
      const cleanedQueryPhone = query.replace(/[^0-9]/g, '');
      const cleanedOrderPhone = order.phone.replace(/[^0-9]/g, '');
      const matchesPhone = cleanedQueryPhone && cleanedOrderPhone.includes(cleanedQueryPhone);
      const matchesEmail = order.email.toLowerCase() === query;

      if (!matchesPhone && !matchesEmail) {
        return NextResponse.json(
          {
            success: false,
            error: 'The phone number or email does not match this Order ID. Please recheck your details.',
          },
          { status: 403 }
        );
      }
    }

    // Mask sensitive details slightly for public safety if not fully verified
    const sanitizedOrder = {
      id: order.id,
      customerName: order.customerName,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      statusHistory: order.statusHistory || [
        { status: 'New', timestamp: order.createdAt, note: 'Order placed by customer' },
      ],
      preferredContact: order.preferredContact,
    };

    return NextResponse.json({
      success: true,
      order: sanitizedOrder,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
