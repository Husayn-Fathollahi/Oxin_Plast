import { locales, defaultLocale, rtlLocales, localeDisplayNames } from '@/lib/i18n/locales';
import type { Locale } from '@/lib/i18n/locales';

/**
 * locales-config.ts
 * Re-exports locale settings and provides additional per-locale metadata
 * used by the language switcher and next.config.mjs.
 */
export { locales, defaultLocale, rtlLocales, localeDisplayNames };
export type { Locale };

/** Full locale metadata for configuration and UI rendering. */
export const localeMetadata: Record<Locale, {
  code: Locale;
  label: string;
  dir: 'ltr' | 'rtl';
  dateLocale: string;
}> = {
  fa: { code: 'fa', label: 'فارسی', dir: 'rtl', dateLocale: 'fa-IR' },
  en: { code: 'en', label: 'English', dir: 'ltr', dateLocale: 'en-US' },
};
