import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { Category } from '@/types';

export async function GET() {
  const db = getDB();
  return NextResponse.json({ success: true, categories: db.categories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = db.categories.find((c) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 });
    }

    const newCategory: Category = {
      id: body.id || slug,
      name,
      slug,
      description: body.description || '',
      image: body.image || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    };

    db.categories.push(newCategory);
    saveDB(db);

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
