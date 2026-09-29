import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { CustomerUser } from '@/types';
import { isValidPhone, isValidEmail, sanitizeString } from '@/lib/validators';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * POST /api/customer/auth
 * Logs in or registers a customer by phone or email (no OTP required).
 * Rate limited: 10 attempts per minute per IP.
 *
 * Body: { identifier: string, name?: string, isEmail?: boolean }
 */
export async function POST(request: Request) {
  // Rate limit
  const ip = getClientIp(request);
  const { limited, retryAfterMs } = rateLimit(`customer_auth_${ip}`, 10, 60_000);
  if (limited) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many login attempts. Please wait ${Math.ceil((retryAfterMs ?? 60000) / 1000)} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const { identifier, name, isEmail } = await request.json();

    if (!identifier || !String(identifier).trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number or email address.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();

    // Validate the identifier format
    if (isEmail && !isValidEmail(cleanIdentifier)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!isEmail && !isValidPhone(cleanIdentifier.replace(/[\s\-+()]/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian phone number.' },
        { status: 400 }
      );
    }

    const db = getDB();

    // Find existing customer
    let existingCustomer = db.customers.find((c) =>
      isEmail
        ? c.email?.toLowerCase() === cleanIdentifier
        : c.phone.replace(/[^0-9]/g, '') === cleanIdentifier.replace(/[^0-9]/g, '')
    );

    const isNewCustomer = !existingCustomer;

    if (!existingCustomer) {
      // Create a new customer record
      const defaultName = name
        ? sanitizeString(String(name), 100)
        : isEmail
        ? cleanIdentifier.split('@')[0]
        : `Customer ${cleanIdentifier.slice(-4)}`;

      existingCustomer = {
        id: 'cust-' + Date.now(),
        name: defaultName,
        email: isEmail ? cleanIdentifier : undefined,
        phone: !isEmail ? cleanIdentifier : '',
        createdAt: new Date().toISOString(),
      } as CustomerUser;

      db.customers.unshift(existingCustomer);
      saveDB(db);
    }

    // Fetch this customer's orders (stripped of admin fields)
    const customerOrders = db.orders
      .filter((o) => {
        if (isEmail) return o.email?.toLowerCase() === cleanIdentifier;
        return o.phone.replace(/[^0-9]/g, '') === cleanIdentifier.replace(/[^0-9]/g, '');
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(({ internalNotes: _, ...safe }) => safe);

    return NextResponse.json({
      success: true,
      customer: existingCustomer,
      orders: customerOrders,
      isNewCustomer,
      message: isNewCustomer ? 'Welcome! Your account has been created.' : 'Welcome back!',
    });
  } catch (err: unknown) {
    console.error('[POST /api/customer/auth] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
