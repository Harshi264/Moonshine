import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

/**
 * PUT /api/contact/[id]
 * Updates status ('read', 'unread', 'replied') and optional replyNote
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, replyNote } = body;

    const db = getDB();
    const idx = (db.messages || []).findIndex((m) => m.id === id);

    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    if (status) {
      db.messages[idx].status = status;
      if (status === 'replied') {
        db.messages[idx].repliedAt = new Date().toISOString();
      }
    }
    if (replyNote !== undefined) {
      db.messages[idx].replyNote = replyNote;
    }

    saveDB(db);

    return NextResponse.json({
      success: true,
      message: db.messages[idx],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/contact/[id]
 * Deletes a message from the database
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const initialLength = (db.messages || []).length;
    db.messages = (db.messages || []).filter((m) => m.id !== id);

    if (db.messages.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    saveDB(db);

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
