import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Review } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const isAdmin = searchParams.get('admin') === 'true';

  const db = getDB();
  let reviews = db.reviews;

  // Filter for customer view unless admin
  if (!isAdmin) {
    reviews = reviews.filter((r) => r.status === 'approved');
  } else if (status) {
    reviews = reviews.filter((r) => r.status === status);
  }

  if (productId) {
    reviews = reviews.filter((r) => r.productId === productId);
  }

  if (featured === 'true') {
    reviews = reviews.filter((r) => r.isFeatured);
  }

  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate rating stats
  const totalCount = reviews.length;
  const avgRating = totalCount > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : '5.0';

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const key = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[key] = (distribution[key] || 0) + 1;
  });

  return NextResponse.json({
    success: true,
    count: totalCount,
    avgRating: Number(avgRating),
    distribution,
    reviews,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, orderId, customerName, customerEmail, rating, comment, images } = body;

    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Product, customer name, rating, and review comment are required.' },
        { status: 400 }
      );
    }

    const db = getDB();
    const product = db.products.find((p) => p.id === productId || p.slug === productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    // Check verified purchase by orderId
    let verifiedPurchase = false;
    let verifiedOrderId = undefined;

    if (orderId) {
      const formattedOrderId = orderId.trim().toUpperCase();
      const existingOrder = db.orders.find(
        (o) =>
          o.id.toUpperCase() === formattedOrderId &&
          o.items.some((item) => item.productId === product.id || item.productName === product.name)
      );

      if (existingOrder) {
        verifiedPurchase = true;
        verifiedOrderId = existingOrder.id;
      }
    }

    // Check anti-spam: duplicate review from same name/order
    const isDuplicate = db.reviews.some(
      (r) =>
        r.productId === product.id &&
        ((verifiedOrderId && r.orderId === verifiedOrderId) ||
          (r.customerName.toLowerCase() === customerName.trim().toLowerCase() && r.comment === comment.trim()))
    );

    if (isDuplicate) {
      return NextResponse.json({ success: false, error: 'A review for this product has already been submitted.' }, { status: 400 });
    }

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      productName: product.name,
      orderId: verifiedOrderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment.trim(),
      images: Array.isArray(images) ? images : [],
      verifiedPurchase,
      status: 'pending', // Pending admin approval
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };

    db.reviews.unshift(newReview);
    saveDB(db);

    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Thank you! Your review has been submitted and will appear after moderation.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
