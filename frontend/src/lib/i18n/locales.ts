/**
 * All supported locale codes.
 * Phase 1: fa, en  |  Phase 2: ar, tr, ru
 */
export const locales = ['fa', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fa';

/** Locales that require RTL text direction. */
export const rtlLocales: Locale[] = ['fa'];

/** Human-readable display name for each locale (shown in the language switcher). */
export const localeDisplayNames: Record<Locale, string> = {
  fa: 'فارسی',
  en: 'English',
};
