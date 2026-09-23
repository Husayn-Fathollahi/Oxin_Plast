'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

/**
 * Language switcher showing FA | EN | AR.
 * The active locale is highlighted; clicking another locale navigates to it
 * while preserving the current path.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  const languages = [
    { code: 'fa', label: 'FA' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div
      aria-label="Language switcher"
      className={[
        'flex items-center gap-1 rounded-full p-1',
        'border border-sand-200 bg-white',
        'text-sm transition-all',
        isPending ? 'opacity-50' : '',
      ].join(' ')}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchTo(lang.code)}
          disabled={isPending}
          aria-pressed={locale === lang.code}
          className={[
            'rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
            locale === lang.code
              ? 'bg-brand-gradient text-white shadow-glow'
              : 'text-ink-muted hover:text-ink',
          ].join(' ')}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
