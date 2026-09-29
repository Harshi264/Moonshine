import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { isValidPhone, isValidEmail } from '@/lib/validators';

/**
 * GET /api/customer/orders?identifier=<phone_or_email>
 * Returns all orders for a specific customer identified by phone or email.
 * Customers use this to track their order history without logging in.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const identifier = searchParams.get('identifier')?.trim().toLowerCase();

  if (!identifier) {
    return NextResponse.json(
      { success: false, error: 'Phone number or email address is required.' },
      { status: 400 }
    );
  }

  const isEmailLookup = isValidEmail(identifier);
  const isPhoneLookup = isValidPhone(identifier.replace(/[\s\-+()]/g, ''));

  if (!isEmailLookup && !isPhoneLookup) {
    return NextResponse.json(
      {
        success: false,
        error: 'Please provide a valid phone number or email address.',
      },
      { status: 400 }
    );
  }

  const db = getDB();

  const orders = db.orders
    .filter((o) => {
      if (isEmailLookup) return o.email.toLowerCase() === identifier;
      return o.phone.replace(/[^0-9]/g, '') === identifier.replace(/[^0-9]/g, '');
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Return orders with sensitive admin fields stripped
  const safeOrders = orders.map(({ internalNotes: _, ...rest }) => rest);

  return NextResponse.json({
    success: true,
    count: safeOrders.length,
    orders: safeOrders,
  });
}
