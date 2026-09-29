import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { OrderStatus } from '@/types';
import { sendCustomerStatusUpdateEmail } from '@/lib/email';
import { sanitizeString } from '@/lib/validators';

/**
 * GET /api/orders/[id]
 * Returns a single order by ID.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
  }

  const db = getDB();
  const order = db.orders.find((o) => o.id.toUpperCase() === id.toUpperCase());

  if (!order) {
    return NextResponse.json({ success: false, error: `Order #${id} not found.` }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

/**
 * PUT /api/orders/[id]
 * Updates an order's status, internal notes, or any fields.
 * Also sends a customer status update email when status changes.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
    }

    const body = await request.json();
    const db = getDB();

    const idx = db.orders.findIndex((o) => o.id.toUpperCase() === id.toUpperCase());
    if (idx === -1) {
      return NextResponse.json({ success: false, error: `Order #${id} not found.` }, { status: 404 });
    }

    const currentOrder = db.orders[idx];

    // Validate new status if provided
    const validStatuses: OrderStatus[] = [
      'New', 'Contacted', 'Confirmed', 'Preparing', 'Ready', 'Shipped', 'Delivered', 'Cancelled',
    ];
    const newStatus: OrderStatus = body.status || currentOrder.status;
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}.` },
        { status: 400 }
      );
    }

    const internalNotes =
      body.internalNotes !== undefined
        ? sanitizeString(String(body.internalNotes), 1000)
        : currentOrder.internalNotes;

    const history = [...(currentOrder.statusHistory || [])];
    const statusChanged = newStatus !== currentOrder.status;

    if (statusChanged) {
      history.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: body.statusNote
          ? sanitizeString(String(body.statusNote), 200)
          : `Status updated to ${newStatus}`,
      });
    }

    const updatedOrder = {
      ...currentOrder,
      status: newStatus,
      internalNotes,
      statusHistory: history,
      updatedAt: new Date().toISOString(),
    };

    db.orders[idx] = updatedOrder;
    saveDB(db);

    // Send status update email to customer if status changed and email exists
    if (statusChanged && currentOrder.email) {
      try {
        await sendCustomerStatusUpdateEmail(updatedOrder, newStatus, body.statusNote);
      } catch (emailErr) {
        console.warn('[PUT /api/orders/[id]] Status email failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: unknown) {
    console.error('[PUT /api/orders/[id]] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

/**
 * DELETE /api/orders/[id]
 * Permanently deletes an order.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Order ID is required.' }, { status: 400 });
  }

  const db = getDB();
  const idx = db.orders.findIndex((o) => o.id.toUpperCase() === id.toUpperCase());

  if (idx === -1) {
    return NextResponse.json({ success: false, error: `Order #${id} not found.` }, { status: 404 });
  }

  const deletedOrder = db.orders[idx];
  db.orders.splice(idx, 1);
  saveDB(db);

  return NextResponse.json({
    success: true,
    message: `Order #${deletedOrder.id} has been permanently deleted.`,
  });
}
