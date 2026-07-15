'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

/**
 * Language switcher showing EN | FA.
 * The active locale is highlighted; clicking the other locale navigates to it
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
      <button
        onClick={() => switchTo('en')}
        disabled={isPending}
        aria-pressed={locale === 'en'}
        className={[
          'rounded-full px-3 py-1 text-xs font-bold transition-colors',
          locale === 'en'
            ? 'bg-brand-gradient text-white shadow-glow'
            : 'text-ink-muted hover:text-ink',
        ].join(' ')}
      >
        EN
      </button>
      <button
        onClick={() => switchTo('fa')}
        disabled={isPending}
        aria-pressed={locale === 'fa'}
        className={[
          'rounded-full px-3 py-1 text-xs font-bold transition-colors',
          locale === 'fa'
            ? 'bg-brand-gradient text-white shadow-glow'
            : 'text-ink-muted hover:text-ink',
        ].join(' ')}
      >
        FA
      </button>
    </div>
  );
}
