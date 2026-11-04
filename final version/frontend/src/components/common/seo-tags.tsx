/**
 * SeoTags — renders canonical link, alternate hreflang links, and OG tags
 * as <head> metadata for client-rendered contexts.
 *
 * NOTE: For Server Components prefer Next.js `generateMetadata()`.
 * Use this component only in client-rendered edge cases.
 */
export interface SeoTagsProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  alternateLocales?: { locale: string; url: string }[];
}

export function SeoTags({
  title,
  description,
  canonicalUrl,
  ogImageUrl,
  alternateLocales = [],
}: SeoTagsProps) {
  // These tags are injected via Next.js Head in pages that require dynamic CSR SEO.
  // In App Router prefer generateMetadata(); this is a fallback utility component.
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      {alternateLocales.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}
    </>
  );
}
