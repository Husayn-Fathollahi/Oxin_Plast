'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/lib/i18n/navigation';

const navLinks = [
  { key: 'home',     href: '/'         },
  { key: 'products', href: '/products' },
  { key: 'blog',     href: '/blog'     },
  { key: 'catalog',  href: '/catalog'  },
  { key: 'about',    href: '/about'    },
  { key: 'contact',  href: '/contact'  },
] as const;

type NavKey = (typeof navLinks)[number]['key'];

export function Nav({ quoteLabel }: { quoteLabel?: string }) {
  const t        = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const labels: Record<NavKey, string> = {
    home:     t('nav.home'),
    products: t('nav.products'),
    blog:     t('nav.blog'),
    catalog:  t('nav.catalog'),
    about:    t('nav.about'),
    contact:  t('nav.contact'),
  };

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {navLinks.map(({ key, href }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
                    active
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-ink-soft hover:text-ink hover:bg-sand-100',
                  ].join(' ')}
                >
                  {labels[key]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="md:hidden grid h-10 w-10 place-items-center rounded-2xl
                   border border-sand-200 bg-white text-ink"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-x-0 top-[72px] z-40 animate-fade-down animate-fill-both">
          <div className="container mx-auto">
            <div className="card p-4 mt-2">
              <ul className="flex flex-col gap-1">
                {navLinks.map(({ key, href }) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={[
                          'block rounded-2xl px-4 py-3 text-base font-semibold transition-colors',
                          active
                            ? 'text-brand-700 bg-brand-50'
                            : 'text-ink-soft hover:bg-sand-100',
                        ].join(' ')}
                      >
                        {labels[key]}
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-2">
                  <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                    {quoteLabel ?? labels.contact}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

