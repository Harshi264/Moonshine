import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDB();

    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    db.reviews[idx] = {
      ...db.reviews[idx],
      ...body,
    };

    saveDB(db);

    return NextResponse.json({ success: true, review: db.reviews[idx] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const idx = db.reviews.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
  }

  db.reviews.splice(idx, 1);
  saveDB(db);

  return NextResponse.json({ success: true, message: 'Review deleted' });
}
