import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { prisma } from '@/lib/prisma';
import {
  ProductsExplorer,
  type ExplorerCard,
  type ExplorerCategory,
} from '@/components/products/products-explorer';
import { CATEGORY_ORDER, categorizeProduct } from '@/constants/product-categories';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  const title = t('meta.listingTitle');
  const description = t('meta.listingDescription');
  return {
    title,
    description,
    alternates: buildAlternates(locale, 'products'),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title,
      description,
      locale: locale === 'en' ? 'en_US' : 'fa_IR',
    },
    twitter: {
      ...seoConfig.twitter,
      title,
      description,
    },
  };
}

export default async function ProductsPage({
  params,
}: ProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  const isEn = locale === 'en';

  // Map Prisma shape → explorer cards with locale-aware fields + category.
  const cards: ExplorerCard[] = products.map((p) => {
    const primaryImage =
      p.images.find((img) => img.isPrimary) ?? p.images[0] ?? null;
    const categorySlug = categorizeProduct(p.name, p.nameEn, p.slug);
    return {
      name: (isEn ? p.nameEn || p.name : p.name),
      slug: p.slug,
      shortDescription: (isEn ? p.excerptEn || p.excerpt : p.excerpt),
      imageUrl: primaryImage?.url ?? p.image ?? undefined,
      category: categorySlug ? t(`categories.${categorySlug}`) : undefined,
      categorySlug,
    };
  });

  // Always show all five categories as tabs (labels via i18n).
  const categories: ExplorerCategory[] = CATEGORY_ORDER.map((slug) => ({
    slug,
    label: t(`categories.${slug}`),
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t('listing.title')}</h1>
      <ProductsExplorer
        cards={cards}
        categories={categories}
        allLabel={t('categories.all')}
        emptyLabel={t('listing.empty')}
      />
    </div>
  );
}
