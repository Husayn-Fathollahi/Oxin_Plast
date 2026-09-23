import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { siteConfig } from '@/config/site-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/products/product-grid';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Link } from '@/lib/i18n/navigation';
import { categorizeProduct, getCategory } from '@/constants/product-categories';

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const t = await getTranslations({ locale, namespace: 'products' });
  const label = t(`categories.${category.slug}`);
  // Exact SEO format requested: "[category] | Plastic Company".
  // `absolute` bypasses the layout's default title template.
  const title = `${label} | ${siteConfig.name}`;
  const description = t('meta.listingDescription');

  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale, `products/category/${slug}`),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title,
      description,
      locale: locale === 'ar' ? 'ar_SA' : locale === 'en' ? 'en_US' : 'fa_IR',
    },
    twitter: {
      ...seoConfig.twitter,
      title,
      description,
    },
  };
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'products' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const label = t(`categories.${category.slug}`);

  // Keep only products whose auto-detected category matches this page.
  const cards = products
    .filter((p: any) => categorizeProduct(p.name, p.nameEn, p.slug) === category.slug)
    .map((p:any) => {
      const primaryImage = p.images.find((img: any) => img.isPrimary) ?? p.images[0] ?? null;
      return {
        name: isAr
          ? (p.nameAr?.trim()    || p.name || p.nameEn || '')
          : isEn ? (p.nameEn?.trim() || p.name) : p.name,
        slug: p.slug,
        shortDescription: isAr
          ? (p.excerptAr?.trim() || p.excerpt || p.excerptEn || '')
          : isEn ? (p.excerptEn?.trim() || p.excerpt) : p.excerpt,
        imageUrl: primaryImage?.url ?? p.image ?? undefined,
        category: label,
      };
    });

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: tCommon('nav.products'), href: `/${locale}/products` },
          { label, href: '#' },
        ]}
      />
      <h1 className="mt-8 mb-8 text-3xl font-bold">{label}</h1>
      {cards.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          {t('listing.empty')}
          <div className="mt-4">
            <Link href="/products" className="text-brand-600 hover:underline">
              {t('categories.all')}
            </Link>
          </div>
        </div>
      ) : (
        <ProductGrid products={cards} />
      )}
    </div>
  );
}
