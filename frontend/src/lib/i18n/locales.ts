/**
 * All supported locale codes.
 */
export const locales = ['fa', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fa';

/** Locales that require RTL text direction. */
export const rtlLocales: Locale[] = ['fa', 'ar'];

/** Human-readable display name for each locale (shown in the language switcher). */
export const localeDisplayNames: Record<Locale, string> = {
  fa: 'فارسی',
  en: 'English',
  ar: 'العربية',
};
