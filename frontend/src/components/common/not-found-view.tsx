'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass, Home, Boxes, BookOpen, MessageCircle, ArrowRight, Link2,
} from 'lucide-react';

interface NotFoundViewProps {
  locale?: string;
}

export function NotFoundView({ locale = 'fa' }: NotFoundViewProps) {
  const pathname = usePathname();

  // Prefer the locale embedded in the requested URL (first path segment) so the
  // root-level not-found — which renders for any unmatched path and cannot read
  // the locale on the server — still shows the correct language. Falls back to
  // the explicitly provided locale prop.
  const segLocale = pathname?.split('/').filter(Boolean)[0];
  const activeLocale = segLocale === 'en' || segLocale === 'fa' ? segLocale : locale;
  const isEn = activeLocale === 'en';

  // usePathname returns a percent-encoded path; decode it so non-Latin URLs
  // (e.g. Persian slugs) display readably. Fall back to the raw value if the
  // encoding is malformed.
  let displayPath = pathname || '/';
  try {
    displayPath = decodeURIComponent(displayPath);
  } catch {
    /* keep the raw encoded path */
  }

  const quickLinks = [
    { icon: Home,          href: `/${activeLocale}`,         label: isEn ? 'Home' : 'خانه' },
    { icon: Boxes,         href: `/${activeLocale}/products`, label: isEn ? 'Products' : 'محصولات' },
    { icon: BookOpen,      href: `/${activeLocale}/blog`,     label: isEn ? 'Blog' : 'وبلاگ' },
    { icon: MessageCircle, href: `/${activeLocale}/contact`,  label: isEn ? 'Contact' : 'تماس با ما' },
  ];

  return (
    <section dir={isEn ? 'ltr' : 'rtl'} className="relative overflow-hidden bg-mesh">
      {/* grid pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />
      {/* floating blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -start-24 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl animate-float-slow" />
        <div className="absolute top-32 -end-20 h-72 w-72 rounded-full bg-coral-300/20 blur-3xl animate-float" />
        <div className="absolute bottom-0 start-1/3 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl animate-float-slow" />
      </div>

      <div className="container mx-auto relative flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">

        {/* Eyebrow */}
        <div className="chip animate-fade-up animate-fill-both">
          <Compass className="h-3.5 w-3.5" />
          {isEn ? 'Lost in space' : 'مسیر را گم کردید'}
        </div>

        {/* Big 404 */}
        <h1
          className="display mt-6 leading-none animate-fade-up animate-fill-both animate-delay-100"
          style={{ fontSize: 'clamp(6rem, 22vw, 16rem)' }}
          aria-hidden="true"
        >
          <span className="text-gradient">404</span>
        </h1>

        {/* Message */}
        <h2 className="display text-display-xs mt-2 text-ink animate-fade-up animate-fill-both animate-delay-200">
          {isEn ? 'This page took a wrong turn' : 'این صفحه پیدا نشد'}
        </h2>
        <p className="mt-4 max-w-md text-ink-soft leading-relaxed animate-fade-up animate-fill-both animate-delay-200">
          {isEn
            ? 'The page you are looking for does not exist or may have been moved.'
            : 'صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا جابجا شده است.'}
        </p>

        {/* Searched URL */}
        <div className="mt-7 w-full max-w-lg animate-fade-up animate-fill-both animate-delay-300">
          <span className="block mb-2 text-xs font-bold uppercase tracking-wider text-ink-muted">
            {isEn ? 'You searched for' : 'آدرس جستجو شده'}
          </span>
          <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-white/80 backdrop-blur px-4 py-3 shadow-soft">
            <span className="icon-tile h-9 w-9 shrink-0 bg-coral-gradient">
              <Link2 className="h-4 w-4" />
            </span>
            <code dir="ltr" className="flex-1 truncate text-start text-sm font-semibold text-ink">
              {displayPath}
            </code>
            <span className="shrink-0 rounded-full bg-coral-50 px-2.5 py-1 text-[11px] font-bold text-coral-600">
              404
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 animate-fade-up animate-fill-both animate-delay-300">
          <Link href={`/${activeLocale}`} className="btn-primary">
            {isEn ? 'Back to Home' : 'بازگشت به خانه'}
            <ArrowRight className="h-4 w-4 flip-x" />
          </Link>
          <Link href={`/${activeLocale}/contact`} className="btn-ghost">
            {isEn ? 'Report a Problem' : 'گزارش مشکل'}
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-14 w-full max-w-2xl animate-fade-in animate-fill-both animate-delay-500">
          <span className="block mb-5 text-xs font-bold uppercase tracking-wider text-ink-muted">
            {isEn ? 'Popular destinations' : 'صفحات پرطرفدار'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(({ icon: Icon, href, label }, i) => (
              <Link
                key={href}
                href={href}
                className="card group flex flex-col items-center gap-3 p-5"
              >
                <span className={`icon-tile h-11 w-11 ${i % 2 === 0 ? 'bg-brand-gradient' : 'bg-coral-gradient'} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-ink">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
