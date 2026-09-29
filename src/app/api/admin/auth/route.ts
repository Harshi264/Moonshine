import { NextResponse } from 'next/server';
import { generateAdminToken, verifyAdminPassword } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

/**
 * POST /api/admin/auth
 * Authenticates admin with password and returns a signed session token.
 * Rate limited to 5 attempts per minute per IP.
 */
export async function POST(request: Request) {
  // Rate limit: 5 attempts per minute per IP
  const ip = getClientIp(request);
  const { limited, retryAfterMs } = rateLimit(`admin_login_${ip}`, 5, 60_000);
  if (limited) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many login attempts. Please wait ${Math.ceil((retryAfterMs ?? 60000) / 1000)} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin password. Please try again.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();

    return NextResponse.json({
      success: true,
      token,
      expiresIn: '24h',
      message: 'Authenticated successfully.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
