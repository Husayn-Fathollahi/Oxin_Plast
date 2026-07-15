import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { ArticleGrid } from '@/components/blog/article-grid';
import { prisma } from '@/lib/prisma';

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const title = t('meta.listingTitle');
  const description = t('meta.listingDescription');
  return {
    title,
    description,
    alternates: buildAlternates(locale, 'blog'),
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

/**
 * Blog listing page — Server Component.
 * Reads published articles directly from the database.
 */
export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const t = await getTranslations({ locale, namespace: 'blog' });

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      title: true,
      titleEn: true,
      slug: true,
      excerpt: true,
      excerptEn: true,
      image: true,
      createdAt: true,
    },
  });

  const cards = articles.map((a) => ({
    title: isEn ? (a.titleEn || a.title) : a.title,
    slug: a.slug,
    excerpt: isEn ? (a.excerptEn || a.excerpt) : a.excerpt,
    coverImageUrl: a.image ?? undefined,
    publishedAt: a.createdAt.toISOString(),
    locale,
    readMoreLabel: t('listing.readMore'),
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t('listing.title')}</h1>
      <ArticleGrid articles={cards} />
    </div>
  );
}
