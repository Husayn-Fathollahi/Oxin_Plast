'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, Phone } from 'lucide-react';
import { Link, usePathname } from '@/lib/i18n/navigation';

const navLinks = [
  { key: 'home',     href: '/'        },
  { key: 'products', href: '/products' },
  { key: 'catalog',  href: '/catalog'  },
  { key: 'blog',     href: '/blog'     },
  { key: 'about',    href: '/about'    },
  { key: 'contact',  href: '/contact'  },
] as const;

type NavKey = (typeof navLinks)[number]['key'];

interface NavProps {
  quoteLabel?: string;
  phone?: string;
}

export function Nav({ quoteLabel, phone }: NavProps) {
  const t        = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen]   = useState(false);

  const labels: Record<NavKey, string> = {
    home:     t('nav.home'),
    products: t('nav.products'),
    catalog:  t('nav.catalog'),
    blog:     t('nav.blog'),
    about:    t('nav.about'),
    contact:  t('nav.contact'),
  };

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ── Desktop nav ─────────────────────────────── */}
      <nav aria-label="Main navigation" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {navLinks.map(({ key, href }) => {
            const active = isActive(href);
            return (
              <li key={key}>
                <Link
                  href={href}
                  className={[
                    'relative px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-150',
                    active
                      ? 'text-[#164E53]'
                      : 'text-slate-700 hover:text-[#164E53]',
                  ].join(' ')}
                >
                  {labels[key]}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-4 -bottom-[1px] h-0.5 rounded-full bg-[#164E53]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Mobile hamburger ─────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="lg:hidden grid h-9 w-9 place-items-center rounded-md
                   text-slate-600 hover:bg-slate-100 transition-colors duration-150"
      >
        {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
      </button>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {open && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 px-4">
          <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <ul className="flex flex-col p-2">
              {navLinks.map(({ key, href }) => {
                const active = isActive(href);
                return (
                  <li key={key}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={[
                        'flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors',
                        active
                          ? 'bg-teal-50 text-[#164E53]'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                      ].join(' ')}
                    >
                      {labels[key]}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2 border-t border-slate-100 p-3">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  dir="ltr"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                  {phone}
                </a>
              )}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-lg bg-[#164E53] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#113C40]"
              >
                {quoteLabel ?? t('nav.quote')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
