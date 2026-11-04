import { siteConfig } from './site-config';

/**
 * seo-config.ts
 * Default SEO values applied across all pages.
 * Individual pages override these via generateMetadata().
 */
export const seoConfig = {
  siteName: siteConfig.name,
  defaultDescription: siteConfig.description,
  defaultOgImageUrl: `${siteConfig.siteUrl}/images/ui/og-default.jpg`,

  defaultOpenGraph: {
    siteName: siteConfig.name,
    locale: 'fa_IR',
    type: 'website' as const,
  },

  twitter: {
    card: 'summary_large_image' as const,
    site: '@plasticcompany',
  },

  /**
   * Routes that should never be indexed by search engines.
   * Applies to all paths starting with these prefixes.
   */
  noIndexPrefixes: ['/admin', '/api'],
} as const;
