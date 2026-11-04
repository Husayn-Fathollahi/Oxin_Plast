import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Protects /fa/admin and /en/admin (and all sub-paths, except login)
const ADMIN_PATTERN = /^\/(fa|en|ar)\/admin(?!\/login)(\/|$)/;
// Protects /api/messages and all sub-paths (all methods)
const API_MESSAGES_PATTERN = /^\/api\/messages(\/|$)/;
// Protects write operations on admin-only mutation APIs
const ADMIN_WRITE_API_PATTERN = /^\/api\/(products|articles|upload)(\/|$)/;

// ── Verify signed session token using Web Crypto (Edge-compatible) ─────────────
// Token format: "<unix-ms>.<hex-HMAC-SHA256>"
async function verifyAdminSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const dotIndex = cookieValue.lastIndexOf('.');
  if (dotIndex === -1) return false;

  const ts = cookieValue.slice(0, dotIndex);
  const providedSig = cookieValue.slice(dotIndex + 1);

  // Reject tokens older than 7 days
  const issuedAt = parseInt(ts, 10);
  if (isNaN(issuedAt) || Date.now() - issuedAt > 7 * 24 * 60 * 60 * 1000) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${ts}:admin-session`),
  );
  const expectedSig = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time comparison via XOR (Web Crypto has no timingSafeEqual)
  if (providedSig.length !== expectedSig.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    diff |= providedSig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  return diff === 0;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /api/messages/* — return 401 JSON instead of redirecting
  if (API_MESSAGES_PATTERN.test(pathname)) {
    const session = request.cookies.get('admin_session');
    if (!(await verifyAdminSession(session?.value))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect write operations on /api/products, /api/articles, /api/upload
  if (ADMIN_WRITE_API_PATTERN.test(pathname) && request.method !== 'GET') {
    const session = request.cookies.get('admin_session');
    if (!(await verifyAdminSession(session?.value))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect admin pages — redirect to locale-aware login page
  if (ADMIN_PATTERN.test(pathname)) {
    const session = request.cookies.get('admin_session');
    if (!(await verifyAdminSession(session?.value))) {
      const locale = pathname.split('/')[1] ?? routing.defaultLocale;
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url),
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Protected API routes — must be listed explicitly
    '/api/messages/:path*',
    '/api/products/:path*',
    '/api/articles/:path*',
    '/api/upload/:path*',
    // All page routes — exclude static assets, other API routes, and files with extensions
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|.*\\..*).*)',
  ],
};
