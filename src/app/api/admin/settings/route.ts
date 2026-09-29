import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json({ success: true, settings: db.settings });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    db.settings = {
      ...db.settings,
      ...body,
    };

    saveDB(db);

    return NextResponse.json({ success: true, settings: db.settings, message: 'Settings updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
