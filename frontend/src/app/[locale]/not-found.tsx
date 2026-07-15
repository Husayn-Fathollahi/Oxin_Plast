/**
 * Locale-level not-found page.
 *
 * Catches 404s within the [locale] segment:
 *   /fa/invalid-page
 *   /en/anything-unknown
 *   /fa/products/unknown-slug  (notFound() bubbles up from page.tsx)
 *
 * Wrapped automatically by src/app/[locale]/layout.tsx which provides
 * <html>, <body>, fonts, globals.css, and NextIntlClientProvider.
 */
import { getLocale } from 'next-intl/server';
import { NotFoundView } from '@/components/common/not-found-view';

export default async function LocaleNotFound() {
  const locale = await getLocale();

  return <NotFoundView key="not-found-locale" locale={locale} />;
}
