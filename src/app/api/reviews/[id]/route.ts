import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { sanitizeString } from '@/lib/validators';

/**
 * PUT /api/reviews/[id]
 * Updates a review (admin moderation: approve, reject, feature, etc.)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
    }

    const body = await request.json();
    const db = getDB();

    const idx = db.reviews.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: `Review ${id} not found.` }, { status: 404 });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'approved', 'rejected', 'hidden'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}.`,
        },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json(
          { success: false, error: 'Rating must be a whole number between 1 and 5.' },
          { status: 400 }
        );
      }
    }

    // Sanitize editable fields
    const updates: Partial<typeof db.reviews[number]> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.isFeatured !== undefined) updates.isFeatured = Boolean(body.isFeatured);
    if (body.comment !== undefined) updates.comment = sanitizeString(String(body.comment), 2000);
    if (body.rating !== undefined) updates.rating = Number(body.rating);

    db.reviews[idx] = { ...db.reviews[idx], ...updates };
    saveDB(db);

    return NextResponse.json({ success: true, review: db.reviews[idx] });
  } catch (err: unknown) {
    console.error('[PUT /api/reviews/[id]] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

/**
 * DELETE /api/reviews/[id]
 * Permanently deletes a review (admin only).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
  }

  const db = getDB();
  const idx = db.reviews.findIndex((r) => r.id === id);

  if (idx === -1) {
    return NextResponse.json({ success: false, error: `Review ${id} not found.` }, { status: 404 });
  }

  db.reviews.splice(idx, 1);
  saveDB(db);

  return NextResponse.json({ success: true, message: `Review ${id} has been deleted.` });
}
