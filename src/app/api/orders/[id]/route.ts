import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const order = db.orders.find((o) => o.id.toUpperCase() === id.toUpperCase());
  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDB();

    const idx = db.orders.findIndex((o) => o.id.toUpperCase() === id.toUpperCase());
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const currentOrder = db.orders[idx];
    const newStatus: OrderStatus = body.status || currentOrder.status;
    const internalNotes = body.internalNotes !== undefined ? body.internalNotes : currentOrder.internalNotes;

    const history = currentOrder.statusHistory || [];
    if (newStatus !== currentOrder.status) {
      history.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: body.statusNote || `Status updated to ${newStatus}`,
      });
    }

    db.orders[idx] = {
      ...currentOrder,
      status: newStatus,
      internalNotes,
      statusHistory: history,
      updatedAt: new Date().toISOString(),
    };

    saveDB(db);

    return NextResponse.json({ success: true, order: db.orders[idx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const idx = db.orders.findIndex((o) => o.id.toUpperCase() === id.toUpperCase());
  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }

  db.orders.splice(idx, 1);
  saveDB(db);

  return NextResponse.json({ success: true, message: 'Order deleted' });
}
