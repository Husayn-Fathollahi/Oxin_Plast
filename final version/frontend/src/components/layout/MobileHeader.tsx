'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import {
  PUBLIC_NAV_LINKS,
  type PublicNavKey,
  isNavActive,
} from '@/components/layout/nav-links';
import { cn } from '@/lib/utils';

export function MobileHeader() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const labels: Record<PublicNavKey, string> = {
    home: t('nav.home'),
    products: t('nav.products'),
    catalog: t('nav.catalog'),
    blog: t('nav.blog'),
    about: t('nav.about'),
    contact: t('nav.contact'),
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link href="/" className="min-w-0 shrink">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#164E53]"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-slate-200/70 bg-white/95 transition-[max-height,opacity] duration-300',
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-3 py-3" aria-label="Mobile navigation">
          {PUBLIC_NAV_LINKS.map(({ key, href }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  'rounded-2xl px-3 py-3 text-sm font-semibold',
                  active
                    ? 'bg-[#CCFBF1] text-[#164E53]'
                    : 'text-slate-700 hover:bg-slate-50',
                )}
              >
                {labels[key]}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#164E53] px-4 py-3 text-sm font-bold text-white"
          >
            {t('nav.quote')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
