'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Home,
  Package,
  BookOpen,
  FileText,
  Building2,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import {
  PUBLIC_NAV_LINKS,
  type PublicNavKey,
  isNavActive,
} from '@/components/layout/nav-links';
import { cn } from '@/lib/utils';

const ICONS: Record<PublicNavKey, typeof Home> = {
  home: Home,
  products: Package,
  catalog: FileText,
  blog: BookOpen,
  about: Building2,
  contact: Phone,
};

export function GlassSidebar() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const labels: Record<PublicNavKey, string> = {
    home: t('nav.home'),
    products: t('nav.products'),
    catalog: t('nav.catalog'),
    blog: t('nav.blog'),
    about: t('nav.about'),
    contact: t('nav.contact'),
  };

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false);
      }}
      className={cn(
        'fixed inset-y-0 z-50 hidden flex-col border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md transition-[width] duration-300 ease-out lg:flex',
        'start-0 border-e',
        expanded ? 'w-60' : 'w-[4.75rem]',
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-16 items-center justify-center border-b border-slate-200/70 px-3">
        <Link href="/" className="flex min-w-0 items-center justify-center overflow-hidden">
          {expanded ? (
            <BrandLogo />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#164E53] text-sm font-black tracking-wide text-white">
              SP
            </span>
          )}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        {PUBLIC_NAV_LINKS.map(({ key, href }) => {
          const active = isNavActive(pathname, href);
          const Icon = ICONS[key];
          return (
            <Link
              key={key}
              href={href}
              title={labels[key]}
              className={cn(
                'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150',
                active
                  ? 'bg-[#CCFBF1]/70 text-[#164E53]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#164E53]',
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-[#0D9488]"
                />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              <span
                className={cn(
                  'truncate transition-opacity duration-200',
                  expanded ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                {labels[key]}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-slate-200/70 p-3">
        <div className={cn('flex justify-center', expanded && 'justify-start px-1')}>
          <LanguageSwitcher />
        </div>
        <Link
          href="/contact"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#164E53] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0D9488]',
            !expanded && 'px-0',
          )}
        >
          {expanded ? (
            <>
              <span className="truncate">{t('nav.quote')}</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            </>
          ) : (
            <Phone className="h-4 w-4" />
          )}
        </Link>
      </div>
    </aside>
  );
}
