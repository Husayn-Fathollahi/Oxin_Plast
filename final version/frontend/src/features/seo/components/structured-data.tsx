/**
 * StructuredData — injects a JSON-LD <script> tag into the page <head>.
 * Supports Article, Product, Organization, BreadcrumbList schemas.
 *
 * Usage:
 *   <StructuredData type="Article" data={{ headline: "...", datePublished: "..." }} />
 */
type SchemaType = 'Article' | 'Product' | 'Organization' | 'BreadcrumbList';

interface StructuredDataProps {
  type: SchemaType;
  data: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
