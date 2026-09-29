import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Discount } from '@/types';

export async function GET() {
  const db = getDB();
  return NextResponse.json({ success: true, discounts: db.discounts || [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    const newDiscount: Discount = {
      id: 'disc-' + Date.now(),
      title: body.title || 'Festival Sale',
      targetType: body.targetType || 'product', // 'product' | 'category' | 'all'
      targetId: body.targetId,
      discountPercent: Number(body.discountPercent) || 10,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      code: body.code?.toUpperCase(),
    };

    // Apply discount to products
    if (newDiscount.isActive) {
      applyDiscountToProducts(db, newDiscount);
    }

    db.discounts = db.discounts || [];
    db.discounts.unshift(newDiscount);
    saveDB(db);

    return NextResponse.json({ success: true, discount: newDiscount });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;
    const db = getDB();

    if (action === 'remove-discount') {
      // Remove discount from product/category
      const productId = body.productId;
      if (productId) {
        const prod = db.products.find((p) => p.id === productId);
        if (prod) {
          prod.salePrice = undefined;
          prod.discountPercent = undefined;
          prod.isSale = false;
        }
      }
      saveDB(db);
      return NextResponse.json({ success: true, message: 'Discount removed' });
    }

    const idx = (db.discounts || []).findIndex((d) => d.id === id);
    if (idx !== -1) {
      db.discounts[idx] = { ...db.discounts[idx], ...body };
      if (db.discounts[idx].isActive) {
        applyDiscountToProducts(db, db.discounts[idx]);
      }
      saveDB(db);
      return NextResponse.json({ success: true, discount: db.discounts[idx] });
    }

    return NextResponse.json({ success: false, error: 'Discount not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

function applyDiscountToProducts(db: any, discount: Discount) {
  const percent = discount.discountPercent;
  if (!percent || percent <= 0) return;

  db.products.forEach((prod: any) => {
    let match = false;
    if (discount.targetType === 'all') {
      match = true;
    } else if (discount.targetType === 'category' && discount.targetId) {
      match = prod.category === discount.targetId || prod.category.toLowerCase() === discount.targetId.toLowerCase();
    } else if (discount.targetType === 'product' && discount.targetId) {
      match = prod.id === discount.targetId;
    }

    if (match) {
      const origPrice = prod.price;
      const salePrice = Math.round(origPrice * (1 - percent / 100));
      prod.salePrice = salePrice;
      prod.discountPercent = percent;
      prod.isSale = true;
    }
  });
}
