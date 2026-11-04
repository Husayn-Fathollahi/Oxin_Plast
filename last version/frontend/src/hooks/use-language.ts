'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/i18n/navigation';
import { locales, type Locale, localeDisplayNames, rtlLocales } from '@/lib/i18n/locales';

/**
 * useLanguage — provides the current locale, direction, and a switcher function.
 */
export function useLanguage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const isRtl = rtlLocales.includes(locale);

  function switchLocale(newLocale: Locale) {
    // next-intl handles the redirect to the new locale-prefixed URL
    router.replace(pathname, { locale: newLocale });
  }

  return {
    locale,
    isRtl,
    locales,
    localeDisplayNames,
    switchLocale,
  };
}
