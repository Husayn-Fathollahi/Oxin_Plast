import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/config/site-config';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ProductGallery } from '@/features/products/components/ProductGallery';
import { ProductCard } from '@/components/products/product-card';
import { StructuredData } from '@/features/seo/components/structured-data';
import { ProductStickyBar } from '@/components/products/ProductStickyBar';

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, nameEn: true, nameAr: true, excerpt: true, excerptEn: true, excerptAr: true, image: true },
  });
  if (!product) return {};
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const title = isAr
    ? (product.nameAr?.trim()   || product.name || product.nameEn || '')
    : isEn ? (product.nameEn?.trim() || product.name) : product.name;
  const description = isAr
    ? (product.excerptAr?.trim()   || product.excerpt || product.excerptEn || '')
    : isEn ? (product.excerptEn?.trim() || product.excerpt) : product.excerpt;
  const imageUrl = product.image
    ? product.image.startsWith('http') ? product.image : `${siteConfig.siteUrl}${product.image}`
    : undefined;
  const ogLocale = isEn ? 'en_US' : isAr ? 'ar_SA' : 'fa_IR';
  return {
    title,
    description,
    alternates: buildAlternates(locale, `products/${slug}`),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      type: 'website',
      title,
      description,
      locale: ogLocale,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      ...seoConfig.twitter,
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug, locale } = await params;

  const [t, tCommon, product, relatedRaw] = await Promise.all([
    getTranslations({ locale, namespace: 'products' }),
    getTranslations({ locale, namespace: 'common' }),
    prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.product.findMany({
      where: { published: true, slug: { not: slug } },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
    }),
  ]);

  if (!product) notFound();

  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const displayName = isAr
    ? (product.nameAr?.trim()        || product.name || product.nameEn || '')
    : isEn ? (product.nameEn?.trim() || product.name) : product.name;
  const displayExcerpt = isAr
    ? (product.excerptAr?.trim()        || product.excerpt || product.excerptEn || '')
    : isEn ? (product.excerptEn?.trim() || product.excerpt) : product.excerpt;
  const displayDescription = isAr
    ? (product.descriptionAr?.trim()        || product.description || product.descriptionEn || '')
    : isEn ? (product.descriptionEn?.trim() || product.description) : product.description;

  // Resolve absolute image URL for JSON-LD structured data
  const primaryImageUrl =
    product.images.find((i: any) => i.isPrimary)?.url ??
    product.images[0]?.url ??
    product.image ??
    undefined;
  const absoluteImageUrl = primaryImageUrl
    ? primaryImageUrl.startsWith('http')
      ? primaryImageUrl
      : `${siteConfig.siteUrl}${primaryImageUrl}`
    : undefined;

  // Map related products to card props
  const relatedProducts = relatedRaw.map((p: any) => ({
    name: isAr
      ? (p.nameAr?.trim()    || p.name || p.nameEn || '')
      : isEn ? (p.nameEn?.trim() || p.name) : p.name,
    slug:             p.slug,
    shortDescription: isAr
      ? (p.excerptAr?.trim() || p.excerpt || p.excerptEn || '')
      : isEn ? (p.excerptEn?.trim() || p.excerpt) : p.excerpt,
    imageUrl:         p.images[0]?.url ?? p.image ?? undefined,
  }));

  // Parse specifications JSON safely (Prisma returns JsonValue)
  const specs =
    product.specifications &&
    typeof product.specifications === 'object' &&
    !Array.isArray(product.specifications)
      ? (product.specifications as Record<string, string>)
      : null;

  return (
    <>
      {/* Product JSON-LD — enables Google rich results for product pages */}
      <StructuredData
        type="Product"
        data={{
          name:        displayName,
          description: displayExcerpt,
          ...(absoluteImageUrl ? { image: absoluteImageUrl } : {}),
          brand: { '@type': 'Brand', name: siteConfig.name },
          url:   `${siteConfig.siteUrl}/${locale}/products/${slug}`,
        }}
      />

      <div className="container mx-auto px-4 pt-12 pb-28 md:py-12">
        <Breadcrumbs
          items={[
            { label: tCommon('nav.products'), href: `/${locale}/products` },
            { label: displayName, href: '#' },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ── Image gallery ── */}
          <ProductGallery images={product.images} productName={displayName} />

          {/* ── Product details ── */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
              <p className="mt-3 text-base text-gray-600">{displayExcerpt}</p>
            </div>

            {/* ── Primary CTAs ── */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center gap-2"
              >
                {t('detail.requestQuote')}
              </Link>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="btn-ghost inline-flex items-center gap-2"
              >
                {t('detail.contactSales')}
              </a>
              {siteConfig.social.whatsapp && (
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  {t('detail.whatsapp')}
                </a>
              )}
            </div>

            {/* ── Description ── */}
            {displayDescription && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  {t('detail.description')}
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {displayDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Technical Specifications ── */}
        {specs && Object.keys(specs).length > 0 && (
          <section
            className="mt-12 border-t border-gray-100 pt-12"
            aria-labelledby="specs-heading"
          >
            <h2 id="specs-heading" className="display text-display-xs text-ink mb-6">
              {t('detail.specs')}
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              {/* Desktop: table layout (sm and above) */}
              <table className="hidden w-full text-sm sm:table">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="w-2/5 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {t('detail.specLabel')}
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {t('detail.valueLabel')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key} className="even:bg-gray-50/60">
                      <td className="px-5 py-3 font-medium text-gray-700">{key}</td>
                      <td className="px-5 py-3 text-gray-900">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile: stacked definition list */}
              <dl className="divide-y divide-gray-100 sm:hidden">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col px-4 py-3 even:bg-gray-50/60">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {key}
                    </dt>
                    <dd className="mt-0.5 text-sm text-gray-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (          <section className="mt-20" aria-labelledby="related-heading">
            <h2 id="related-heading" className="display text-display-xs text-ink mb-8">
              {t('detail.relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p:any) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA bar — product pages only, hidden on md+ */}
      <ProductStickyBar
        quoteLabel={t('detail.requestQuote')}
        whatsappLabel={t('detail.whatsapp')}
      />
    </>
  );
}
