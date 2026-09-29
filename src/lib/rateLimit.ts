// ─── Simple In-Memory Rate Limiter ───────────────────────────────────────────
// Prevents abuse on public endpoints (order placement, review submission, etc.)

interface RateLimitEntry {
  count: number;
  firstRequestAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.firstRequestAt > 10 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Rate limits a given key (e.g. IP address or phone number).
 * 
 * @param key       - Unique identifier (IP, email, phone)
 * @param maxReqs   - Maximum requests allowed in the window
 * @param windowMs  - Time window in milliseconds (default 60s)
 * @returns `{ limited: true, retryAfterMs }` if rate-limited, otherwise `{ limited: false }`
 */
export function rateLimit(
  key: string,
  maxReqs = 5,
  windowMs = 60 * 1000
): { limited: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, firstRequestAt: now });
    return { limited: false };
  }

  // Reset window if expired
  if (now - entry.firstRequestAt > windowMs) {
    store.set(key, { count: 1, firstRequestAt: now });
    return { limited: false };
  }

  if (entry.count >= maxReqs) {
    const retryAfterMs = windowMs - (now - entry.firstRequestAt);
    return { limited: true, retryAfterMs };
  }

  entry.count += 1;
  return { limited: false };
}

/**
 * Extracts the best available IP address from a Next.js request.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
