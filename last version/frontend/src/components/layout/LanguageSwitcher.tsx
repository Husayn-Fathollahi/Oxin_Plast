'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

const languages = [
  { code: 'fa', label: 'FA' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next }));
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={isPending ? 'pointer-events-none opacity-40' : undefined}
    >
      <div className="flex items-center gap-0.5">
        {languages.map((lang, i) => (
          <span key={lang.code} className="flex items-center">
            {i > 0 && (
              <span aria-hidden className="mx-1 text-slate-300 text-[10px] select-none">
                /
              </span>
            )}
            <button
              onClick={() => switchTo(lang.code)}
              disabled={isPending || locale === lang.code}
              aria-pressed={locale === lang.code}
              className={[
                'text-[11px] font-bold tracking-wide transition-colors duration-100',
                locale === lang.code
                  ? 'text-[#164E53] cursor-default'
                  : 'text-slate-600 hover:text-slate-900 cursor-pointer',
              ].join(' ')}
            >
              {lang.label}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
