import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { CustomerUser } from '@/types';

export async function POST(request: Request) {
  try {
    const { identifier, name, isEmail } = await request.json();

    if (!identifier || !identifier.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid Phone Number or Email.' },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const db = getDB();

    let existingCustomer = db.customers.find((c) =>
      isEmail
        ? c.email?.toLowerCase() === cleanIdentifier
        : c.phone.replace(/[^0-9]/g, '') === cleanIdentifier.replace(/[^0-9]/g, '')
    );

    if (!existingCustomer) {
      // Create new customer entry
      existingCustomer = {
        id: 'cust-' + Date.now(),
        name: name ? name.trim() : (isEmail ? cleanIdentifier.split('@')[0] : `Customer ${cleanIdentifier.slice(-4)}`),
        email: isEmail ? cleanIdentifier : undefined,
        phone: !isEmail ? cleanIdentifier : '',
        createdAt: new Date().toISOString(),
      };
      db.customers.unshift(existingCustomer);
      saveDB(db);
    }

    return NextResponse.json({
      success: true,
      customer: existingCustomer,
      message: 'Logged in successfully!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
