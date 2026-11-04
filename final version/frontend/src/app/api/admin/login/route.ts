import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

// ── In-memory rate limiter — 5 attempts per IP per 10 minutes ─────────────────
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

interface RateEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateEntry>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

// ── Timing-safe string comparison ─────────────────────────────────────────────
function safeEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    // Constant-time even when lengths differ (pad to same length)
    if (aBuf.length !== bBuf.length) {
      timingSafeEqual(aBuf, aBuf); // dummy op to keep timing consistent
      return false;
    }
    return timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

// ── Build a signed session token: "<timestamp>.<HMAC-SHA256>" ─────────────────
function buildSessionToken(secret: string): string {
  const ts = Date.now().toString();
  const sig = createHmac('sha256', secret)
    .update(`${ts}:admin-session`)
    .digest('hex');
  return `${ts}.${sig}`;
}

// ── POST /api/admin/login ─────────────────────────────────────────────────────
export async function POST(request: Request) {
  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many login attempts. Please wait and try again.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!expectedUser || !expectedPass || !sessionSecret) {
    const missing = [
      !expectedUser && 'ADMIN_USERNAME',
      !expectedPass && 'ADMIN_PASSWORD',
      !sessionSecret && 'ADMIN_SESSION_SECRET',
    ].filter(Boolean).join(', ');
    console.error(`[admin/login] Missing required env variable(s): ${missing}`);
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  // Always run both comparisons to prevent timing oracle on which field failed
  const userOk = safeEqual(username ?? '', expectedUser);
  const passOk = safeEqual(password ?? '', expectedPass);

  if (!userOk || !passOk) {
    // Generic message — does not reveal whether username or password was wrong
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const sessionToken = buildSessionToken(sessionSecret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
