import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const db = getDB();
    const settings = db.settings;

    const validPassword = settings.adminPasswordHash || 'moonshine2026';

    if (password === validPassword) {
      // Create admin session token
      const token = 'admin_session_' + Buffer.from(`moonshine_${Date.now()}`).toString('base64');
      return NextResponse.json({
        success: true,
        token,
        message: 'Authenticated successfully',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
