import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Review } from '@/types';
import { validateReviewBody, sanitizeString } from '@/lib/validators';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * GET /api/reviews
 * Returns approved reviews (or all if ?admin=true).
 * Supports ?productId=&status=&featured=&page=&limit= filters.
 * Also returns rating statistics (average, distribution).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const isAdmin = searchParams.get('admin') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  const db = getDB();
  let reviews = db.reviews;

  // Filter for customer vs admin view
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

  // Rating statistics
  const totalCount = reviews.length;
  const avgRating =
    totalCount > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1))
      : 5.0;

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
  reviews.forEach((r) => {
    const key = Math.min(5, Math.max(1, Math.round(r.rating)));
    distribution[key] = (distribution[key] || 0) + 1;
  });

  // Pagination
  const total = reviews.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedReviews = reviews.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    count: paginatedReviews.length,
    total,
    page,
    totalPages,
    avgRating,
    distribution,
    reviews: paginatedReviews,
  });
}

/**
 * POST /api/reviews
 * Submits a new customer review. 
 * Rate limited: 3 reviews per 10 minutes per IP.
 * Verifies purchase against order ID, prevents duplicate reviews.
 */
export async function POST(request: Request) {
  // Rate limit: 3 reviews per 10 minutes per IP
  const ip = getClientIp(request);
  const { limited, retryAfterMs } = rateLimit(`review_submit_${ip}`, 3, 10 * 60_000);
  if (limited) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many review submissions. Please wait ${Math.ceil((retryAfterMs ?? 600000) / 60000)} minutes.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const validation = validateReviewBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0], errors: validation.errors },
        { status: 400 }
      );
    }

    const { productId, orderId, customerName, customerEmail, rating, comment, images } = body;
    const db = getDB();

    // Verify product exists
    const product = db.products.find(
      (p) => p.id === productId || p.slug === productId
    );
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    // Verify purchase if orderId provided
    let verifiedPurchase = false;
    let verifiedOrderId: string | undefined;

    if (orderId) {
      const formattedOrderId = String(orderId).trim().toUpperCase();
      const matchingOrder = db.orders.find(
        (o) =>
          o.id.toUpperCase() === formattedOrderId &&
          o.items.some(
            (item) => item.productId === product.id || item.productName === product.name
          )
      );
      if (matchingOrder) {
        verifiedPurchase = true;
        verifiedOrderId = matchingOrder.id;
      }
    }

    // Anti-spam: check for duplicate review from same name/order/email
    const isDuplicate = db.reviews.some(
      (r) =>
        r.productId === product.id &&
        (
          (verifiedOrderId && r.orderId === verifiedOrderId) ||
          (r.customerName.toLowerCase() === String(customerName).trim().toLowerCase() &&
            r.comment === String(comment).trim()) ||
          (customerEmail && r.customerEmail?.toLowerCase() === String(customerEmail).toLowerCase())
        )
    );

    if (isDuplicate) {
      return NextResponse.json(
        { success: false, error: 'A review for this product has already been submitted.' },
        { status: 409 }
      );
    }

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      productName: product.name,
      orderId: verifiedOrderId,
      customerName: sanitizeString(String(customerName), 100),
      customerEmail: customerEmail ? String(customerEmail).trim().toLowerCase() : undefined,
      rating: Math.min(5, Math.max(1, Math.round(Number(rating)))),
      comment: sanitizeString(String(comment), 2000),
      images: Array.isArray(images) ? images.slice(0, 5) : [], // Max 5 images
      verifiedPurchase,
      status: 'pending', // Always starts as pending — admin must approve
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };

    db.reviews.unshift(newReview);
    saveDB(db);

    return NextResponse.json(
      {
        success: true,
        review: newReview,
        message: verifiedPurchase
          ? '✅ Thank you! Your verified review has been submitted and will appear after a quick moderation check.'
          : '✅ Thank you! Your review has been submitted and will appear after moderation (2-24h).',
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('[POST /api/reviews] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
