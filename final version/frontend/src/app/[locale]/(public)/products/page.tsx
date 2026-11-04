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
import { PageHero } from '@/components/ui/PageHero';

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

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  const isEn = locale === 'en';
  const isAr = locale === 'ar';

  const cards: ExplorerCard[] = products.map((p) => {
    const primaryImage =
      p.images.find((img) => img.isPrimary) ?? p.images[0] ?? null;
    const categorySlug = categorizeProduct(p.name, p.nameEn, p.slug);
    return {
      name: isAr
        ? (p.nameAr?.trim() || p.name || p.nameEn || '')
        : isEn ? (p.nameEn?.trim() || p.name) : p.name,
      slug: p.slug,
      shortDescription: isAr
        ? (p.excerptAr?.trim() || p.excerpt || p.excerptEn || '')
        : isEn ? (p.excerptEn?.trim() || p.excerpt) : p.excerpt,
      imageUrl: primaryImage?.url ?? p.image ?? undefined,
      category: categorySlug ? t(`categories.${categorySlug}`) : undefined,
      categorySlug,
    };
  });

  const categories: ExplorerCategory[] = CATEGORY_ORDER.map((slug) => ({
    slug,
    label: t(`categories.${slug}`),
  }));

  return (
    <div>
      <PageHero
        eyebrow={isAr ? 'المنتجات' : isEn ? 'Products' : 'محصولات'}
        title={t('listing.title')}
        description={t('meta.listingDescription')}
        imageSrc="/images/3d/3d-pedal-bin.jpg"
      />
      <div className="container mx-auto px-5 py-12 lg:px-8">
        <ProductsExplorer
          cards={cards}
          categories={categories}
          allLabel={t('categories.all')}
          emptyLabel={t('listing.empty')}
        />
      </div>
    </div>
  );
}
