import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

/**
 * GET /api/admin/customers
 * Returns all registered customers with their order history aggregated.
 * Supports ?search= and ?page=&limit= query params.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));

  const db = getDB();
  let customers = db.customers || [];

  if (search) {
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(search) ||
        (c.email && c.email.toLowerCase().includes(search))
    );
  }

  // Sort newest first
  customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Enrich with order stats
  const enriched = customers.map((c) => {
    const customerOrders = db.orders.filter(
      (o) =>
        o.email?.toLowerCase() === c.email?.toLowerCase() ||
        o.phone.replace(/[^0-9]/g, '') === c.phone.replace(/[^0-9]/g, '')
    );

    const totalSpent = customerOrders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const lastOrder = customerOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    return {
      ...c,
      orderCount: customerOrders.length,
      totalSpent,
      lastOrderId: lastOrder?.id,
      lastOrderDate: lastOrder?.createdAt,
    };
  });

  const total = enriched.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedCustomers = enriched.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    count: paginatedCustomers.length,
    total,
    page,
    totalPages,
    customers: paginatedCustomers,
  });
}

/**
 * DELETE /api/admin/customers?id=cust-xxx
 * Removes a customer record (does not affect their orders).
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Customer ID is required as a query parameter (?id=...).' },
      { status: 400 }
    );
  }

  const db = getDB();
  const idx = (db.customers || []).findIndex((c) => c.id === id);

  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Customer not found.' }, { status: 404 });
  }

  const deleted = db.customers[idx];
  db.customers.splice(idx, 1);
  saveDB(db);

  return NextResponse.json({
    success: true,
    message: `Customer "${deleted.name}" (${deleted.phone}) removed.`,
  });
}
