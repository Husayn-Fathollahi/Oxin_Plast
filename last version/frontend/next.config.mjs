import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';
const isProd = process.env.NODE_ENV === 'production';

// ── Content-Security-Policy ───────────────────────────────────────────────────
// Notes:
//   • 'unsafe-inline' on script-src is required by Next.js App Router (inline
//     hydration scripts). Remove only if migrating to nonce-based CSP.
//   • 'unsafe-eval' is restricted to development where webpack needs it for HMR.
//   • Google Fonts are self-hosted at build time by next/font — no external font
//     domain is needed.
//   • images.unsplash.com is used for placeholder photos in several pages.
//   • api.plasticcompany.ir is the backend image host (Next.js remotePatterns).
//   • All browser fetch() calls go to /api/* (self) — no external connect-src
//     domain is needed in production.
//   • ws://localhost:* is needed in development for Next.js Fast Refresh.
const ContentSecurityPolicy = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://api.plasticcompany.ir",
  "font-src 'self' data:",
  isDev
    ? "connect-src 'self' ws://localhost:* wss://localhost:*"
    : "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for surfacing potential issues early
  reactStrictMode: true,

  images: {
    // Allow images served from the backend API domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.plasticcompany.ir',
        pathname: '/uploads/**',
      },
    ],
  },

  // Security headers applied to all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── Content-Security-Policy ────────────────────────────────────
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
          // ── MIME-type sniffing protection ──────────────────────────────
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // ── Clickjacking protection ────────────────────────────────────
          { key: 'X-Frame-Options', value: 'DENY' },
          // ── Referrer information leakage ───────────────────────────────
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // ── Browser feature permissions ────────────────────────────────
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },
          // ── Cross-origin window isolation ──────────────────────────────
          // Prevents cross-origin windows from accessing this page via opener.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // ── Cross-origin resource embedding control ────────────────────
          // Allows same-site embeds; blocks cross-site hotlinking.
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          // ── HSTS — production only (never sent over HTTP / localhost) ──
          ...(isProd
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ];
  },

  // Native modules used by Prisma's SQLite driver adapter
  serverExternalPackages: ['better-sqlite3'],
};

export default withNextIntl(nextConfig);
