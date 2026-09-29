import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Discount } from '@/types';
import { validateDiscountBody, sanitizeString } from '@/lib/validators';

/**
 * GET /api/discounts
 * Returns all discounts.
 */
export async function GET() {
  const db = getDB();
  const now = new Date();

  // Auto-deactivate expired discounts
  let updated = false;
  (db.discounts || []).forEach((d) => {
    if (d.isActive && d.endDate && new Date(d.endDate) < now) {
      d.isActive = false;
      updated = true;
    }
  });
  if (updated) saveDB(db);

  return NextResponse.json({ success: true, discounts: db.discounts || [] });
}

/**
 * POST /api/discounts
 * Creates a new discount and optionally applies it to matching products.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate
    const validation = validateDiscountBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0], errors: validation.errors },
        { status: 400 }
      );
    }

    const db = getDB();

    // Check for duplicate discount code
    if (body.code) {
      const code = String(body.code).toUpperCase().trim();
      if ((db.discounts || []).some((d) => d.code === code && d.isActive)) {
        return NextResponse.json(
          { success: false, error: `Discount code "${code}" already exists and is active.` },
          { status: 400 }
        );
      }
    }

    const newDiscount: Discount = {
      id: 'disc-' + Date.now(),
      title: sanitizeString(String(body.title), 150),
      targetType: body.targetType,
      targetId: body.targetId ? sanitizeString(String(body.targetId), 100) : undefined,
      discountPercent: Number(body.discountPercent),
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      code: body.code ? String(body.code).toUpperCase().trim() : undefined,
    };

    // Apply discount to matching products
    let affectedProducts = 0;
    if (newDiscount.isActive) {
      affectedProducts = applyDiscountToProducts(db, newDiscount);
    }

    db.discounts = db.discounts || [];
    db.discounts.unshift(newDiscount);
    saveDB(db);

    return NextResponse.json(
      {
        success: true,
        discount: newDiscount,
        affectedProducts,
        message: `Discount created and applied to ${affectedProducts} product(s).`,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[POST /api/discounts] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * PUT /api/discounts
 * Updates an existing discount or removes a discount from a specific product.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;
    const db = getDB();

    // Action: remove discount from a specific product
    if (action === 'remove-discount') {
      const productId = String(body.productId || '');
      if (!productId) {
        return NextResponse.json(
          { success: false, error: 'productId is required to remove a discount.' },
          { status: 400 }
        );
      }

      const prod = db.products.find((p) => p.id === productId);
      if (!prod) {
        return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
      }

      prod.salePrice = undefined;
      prod.discountPercent = undefined;
      prod.isSale = false;
      saveDB(db);

      return NextResponse.json({
        success: true,
        message: `Discount removed from "${prod.name}".`,
      });
    }

    // Update an existing discount
    if (!id) {
      return NextResponse.json({ success: false, error: 'Discount ID is required.' }, { status: 400 });
    }

    const idx = (db.discounts || []).findIndex((d) => d.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Discount not found.' }, { status: 404 });
    }

    // Validate discount percent if provided
    if (body.discountPercent !== undefined) {
      const pct = Number(body.discountPercent);
      if (pct <= 0 || pct >= 100) {
        return NextResponse.json(
          { success: false, error: 'Discount percent must be between 1 and 99.' },
          { status: 400 }
        );
      }
    }

    db.discounts[idx] = { ...db.discounts[idx], ...body };
    let affectedProducts = 0;
    if (db.discounts[idx].isActive) {
      affectedProducts = applyDiscountToProducts(db, db.discounts[idx]);
    }

    saveDB(db);

    return NextResponse.json({
      success: true,
      discount: db.discounts[idx],
      affectedProducts,
    });
  } catch (err: unknown) {
    console.error('[PUT /api/discounts] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

/**
 * DELETE /api/discounts?id=disc-xxx
 * Deletes a discount by ID.
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Discount ID is required as a query parameter (?id=...).' },
      { status: 400 }
    );
  }

  const db = getDB();
  const idx = (db.discounts || []).findIndex((d) => d.id === id);
  if (idx === -1) {
    return NextResponse.json({ success: false, error: 'Discount not found.' }, { status: 404 });
  }

  const deleted = db.discounts[idx];
  db.discounts.splice(idx, 1);
  saveDB(db);

  return NextResponse.json({ success: true, message: `Discount "${deleted.title}" deleted.` });
}

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Applies a discount to matching products and returns number of products affected. */
function applyDiscountToProducts(
  db: ReturnType<typeof import('@/lib/db').getDB>,
  discount: Discount
): number {
  const percent = discount.discountPercent;
  if (!percent || percent <= 0) return 0;

  let count = 0;
  db.products.forEach((prod) => {
    let match = false;
    if (discount.targetType === 'all') {
      match = true;
    } else if (discount.targetType === 'category' && discount.targetId) {
      match =
        prod.category === discount.targetId ||
        prod.category.toLowerCase() === discount.targetId.toLowerCase();
    } else if (discount.targetType === 'product' && discount.targetId) {
      match = prod.id === discount.targetId;
    }

    if (match) {
      prod.salePrice = Math.round(prod.price * (1 - percent / 100));
      prod.discountPercent = percent;
      prod.isSale = true;
      count++;
    }
  });

  return count;
}
