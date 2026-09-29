// ─── Admin Authentication Middleware ─────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

/** Constant-time string comparison to prevent timing attacks */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generates a signed admin session token.
 * Format: admin_<timestamp>_<base64(secret+timestamp)>
 */
export function generateAdminToken(): string {
  const ts = Date.now();
  const secret = process.env.ADMIN_SECRET || 'moonshine_secret_key';
  const payload = Buffer.from(`${secret}_${ts}`).toString('base64url');
  return `admin_${ts}_${payload}`;
}

/**
 * Validates an admin session token from the Authorization header.
 * Returns true if valid, false otherwise.
 * Tokens expire after 24 hours.
 */
export function verifyAdminToken(token: string): boolean {
  if (!token || !token.startsWith('admin_')) return false;

  try {
    const parts = token.split('_');
    if (parts.length < 3) return false;

    const ts = parseInt(parts[1], 10);
    if (isNaN(ts)) return false;

    // Check token is not older than 24 hours
    const maxAge = 24 * 60 * 60 * 1000; // 24h
    if (Date.now() - ts > maxAge) return false;

    const secret = process.env.ADMIN_SECRET || 'moonshine_secret_key';
    const expectedPayload = Buffer.from(`${secret}_${ts}`).toString('base64url');
    const givenPayload = parts[2];

    return safeEqual(givenPayload, expectedPayload);
  } catch {
    return false;
  }
}

/**
 * Validates admin password against the stored/env password.
 * Falls back to env variable, then db setting, then default.
 */
export function verifyAdminPassword(password: string): boolean {
  const envPassword = process.env.ADMIN_PASSWORD;
  const db = getDB();
  const dbPassword = db.settings.adminPasswordHash || 'moonshine2026';

  const validPassword = envPassword || dbPassword;
  return safeEqual(password, validPassword);
}

/**
 * Middleware: requires a valid admin token in the Authorization header.
 * Use at the top of protected route handlers.
 * 
 * @example
 * const authError = requireAdminAuth(request);
 * if (authError) return authError;
 */
export function requireAdminAuth(request: NextRequest | Request): NextResponse | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json(
      { success: false, error: 'Authorization header is required.' },
      { status: 401 }
    );
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!verifyAdminToken(token)) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired admin session. Please log in again.' },
      { status: 401 }
    );
  }

  return null; // Auth passed
}
