import type { Metadata } from 'next';
import { seoConfig } from '@/config/seo-config';
import { siteConfig } from '@/config/site-config';

const BASE_URL = siteConfig.siteUrl.replace(/\/$/, '');
const LOCALES = ['fa', 'en'] as const;

/**
 * Builds canonical + hreflang alternates for a given locale and path.
 * @param locale  – current locale, e.g. 'fa' or 'en'
 * @param path    – locale-stripped path WITHOUT leading slash, e.g. 'products/my-slug'
 */
export function buildAlternates(locale: string, path = '') {
  const segment = path ? `/${path}` : '';
  return {
    canonical: `${BASE_URL}/${locale}${segment}`,
    languages: Object.fromEntries(
      LOCALES.map((l) => [l, `${BASE_URL}/${l}${segment}`]),
    ) as Record<string, string>,
  };
}

export interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
}

/**
 * Merges page-specific SEO options with global site defaults.
 * Use this in `generateMetadata()` functions across route segments.
 */
export function generatePageMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description = seoConfig.defaultDescription,
    canonicalUrl,
    ogImageUrl = seoConfig.defaultOgImageUrl,
    noIndex = false,
  } = options;

  return {
    title: title
      ? { absolute: `${title} | ${seoConfig.siteName}` }
      : seoConfig.siteName,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title: title ?? seoConfig.siteName,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
  };
}
