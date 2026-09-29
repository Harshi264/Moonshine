import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Product } from '@/types';

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
        (p) => p.category.toLowerCase() === catLower || p.category.toLowerCase().replace(/\s+/g, '-') === catLower
      );
    }
  }

  // Search query filter
  if (search) {
    const s = search.toLowerCase();
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

  // Specific flag filters
  if (featured === 'true') products = products.filter((p) => p.isFeatured);
  if (bestseller === 'true') products = products.filter((p) => p.isBestseller);
  if (newarrival === 'true') products = products.filter((p) => p.isNewArrival);
  if (sale === 'true') products = products.filter((p) => p.isSale || (p.salePrice && p.salePrice < p.price));

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === 'price-high') {
    products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: body.name,
      category: body.category || 'candles',
      subcategory: body.subcategory || '',
      description: body.description || '',
      price: Number(body.price) || 0,
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      discountPercent: body.salePrice && body.price
        ? Math.round(((Number(body.price) - Number(body.salePrice)) / Number(body.price)) * 100)
        : body.discountPercent,
      isSale: Boolean(body.isSale || (body.salePrice && Number(body.salePrice) < Number(body.price))),
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'],
      stock: Number(body.stock) || 0,
      variants: body.variants || [],
      dimensions: body.dimensions || '',
      weight: body.weight || '',
      materials: body.materials || '',
      fragranceInfo: body.fragranceInfo || '',
      colorOptions: body.colorOptions || [],
      customizationFields: body.customizationFields || [],
      careInstructions: body.careInstructions || '',
      shippingInfo: body.shippingInfo || '',
      tags: body.tags || [],
      isFeatured: Boolean(body.isFeatured),
      isBestseller: Boolean(body.isBestseller),
      isNewArrival: Boolean(body.isNewArrival),
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products.unshift(newProduct);
    saveDB(db);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
