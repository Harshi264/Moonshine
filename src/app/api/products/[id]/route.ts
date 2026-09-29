import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const product = db.products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  // Get related products in same category
  const relatedProducts = db.products
    .filter((p) => p.id !== product.id && p.status === 'active' && p.category === product.category)
    .slice(0, 4);

  // Get product reviews
  const reviews = db.reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  return NextResponse.json({ success: true, product, relatedProducts, reviews });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDB();

    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const existing = db.products[index];
    const price = body.price !== undefined ? Number(body.price) : existing.price;
    const salePrice = body.salePrice !== undefined ? (body.salePrice ? Number(body.salePrice) : undefined) : existing.salePrice;

    let discountPercent = existing.discountPercent;
    if (salePrice && price) {
      discountPercent = Math.round(((price - salePrice) / price) * 100);
    } else if (body.discountPercent !== undefined) {
      discountPercent = Number(body.discountPercent);
    }

    const updatedProduct = {
      ...existing,
      ...body,
      price,
      salePrice,
      discountPercent,
      isSale: salePrice !== undefined && salePrice < price,
      updatedAt: new Date().toISOString(),
    };

    db.products[index] = updatedProduct;
    saveDB(db);

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  db.products.splice(index, 1);
  saveDB(db);

  return NextResponse.json({ success: true, message: 'Product deleted' });
}
