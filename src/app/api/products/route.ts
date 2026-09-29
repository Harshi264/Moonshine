import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Product } from '@/types';
import { validateProductBody, sanitizeString } from '@/lib/validators';

/**
 * GET /api/products
 * Returns products list with filtering, sorting, and pagination.
 * Supports ?category=&search=&tag=&status=&featured=&bestseller=&newarrival=&sale=&sort=&page=&limit=
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const bestseller = searchParams.get('bestseller');
  const newarrival = searchParams.get('newarrival');
  const sale = searchParams.get('sale');
  const sort = searchParams.get('sort');
  const includeHidden = searchParams.get('admin') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));

  const db = getDB();
  let products = db.products;

  // Filter hidden unless admin
  if (!includeHidden) {
    products = products.filter((p) => p.status !== 'hidden');
  }

  // Category filter
  if (category) {
    const catLower = category.toLowerCase();
    if (catLower === 'new-arrivals') {
      products = products.filter((p) => p.isNewArrival);
    } else if (catLower === 'sale') {
      products = products.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price));
    } else {
      products = products.filter(
        (p) =>
          p.category.toLowerCase() === catLower ||
          p.category.toLowerCase().replace(/\s+/g, '-') === catLower
      );
    }
  }

  // Search
  if (search) {
    const s = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tags?.some((t) => t.toLowerCase().includes(s))
    );
  }

  // Tag filter
  if (tag) {
    products = products.filter((p) => p.tags?.includes(tag));
  }

  // Status filter
  if (status) {
    products = products.filter((p) => p.status === status);
  }

  // Flag filters
  if (featured === 'true') products = products.filter((p) => p.isFeatured);
  if (bestseller === 'true') products = products.filter((p) => p.isBestseller);
  if (newarrival === 'true') products = products.filter((p) => p.isNewArrival);
  if (sale === 'true') products = products.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price));

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  } else if (sort === 'price-high') {
    products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'name-az') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name-za') {
    products.sort((a, b) => b.name.localeCompare(a.name));
  }

  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedProducts = products.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    count: paginatedProducts.length,
    total,
    page,
    totalPages,
    products: paginatedProducts,
  });
}

/**
 * POST /api/products
 * Creates a new product. Admin-only.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required product fields
    const validation = validateProductBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0], errors: validation.errors },
        { status: 400 }
      );
    }

    const db = getDB();
    const name = sanitizeString(String(body.name), 200);
    const rawSlug = body.slug || name;
    const slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    if (db.products.some((p) => p.slug === slug)) {
      return NextResponse.json(
        { success: false, error: `A product with slug "${slug}" already exists. Choose a different name.` },
        { status: 400 }
      );
    }

    const price = Number(body.price);
    const salePrice = body.salePrice ? Number(body.salePrice) : undefined;
    const discountPercent =
      salePrice && price > salePrice
        ? Math.round(((price - salePrice) / price) * 100)
        : body.discountPercent
        ? Number(body.discountPercent)
        : undefined;

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      slug,
      name,
      category: sanitizeString(String(body.category), 100),
      subcategory: body.subcategory ? sanitizeString(String(body.subcategory), 100) : undefined,
      description: sanitizeString(String(body.description || ''), 2000),
      price,
      salePrice,
      discountPercent,
      isSale: Boolean(salePrice && salePrice < price),
      images:
        Array.isArray(body.images) && body.images.length > 0
          ? body.images.slice(0, 8) // Max 8 images
          : ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'],
      stock: Math.max(0, Number(body.stock) || 0),
      variants: body.variants || [],
      dimensions: body.dimensions ? sanitizeString(String(body.dimensions), 100) : undefined,
      weight: body.weight ? sanitizeString(String(body.weight), 50) : undefined,
      materials: body.materials ? sanitizeString(String(body.materials), 300) : undefined,
      fragranceInfo: body.fragranceInfo ? sanitizeString(String(body.fragranceInfo), 200) : undefined,
      colorOptions: Array.isArray(body.colorOptions) ? body.colorOptions.slice(0, 20) : [],
      customizationFields: body.customizationFields || [],
      careInstructions: body.careInstructions ? sanitizeString(String(body.careInstructions), 500) : undefined,
      shippingInfo: body.shippingInfo ? sanitizeString(String(body.shippingInfo), 300) : undefined,
      tags: Array.isArray(body.tags) ? body.tags.slice(0, 20) : [],
      isFeatured: Boolean(body.isFeatured),
      isBestseller: Boolean(body.isBestseller),
      isNewArrival: Boolean(body.isNewArrival),
      status: ['active', 'out_of_stock', 'hidden'].includes(body.status) ? body.status : 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDB(db);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/products] Error:', err);
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
