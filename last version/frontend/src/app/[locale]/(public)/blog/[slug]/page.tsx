import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/config/site-config';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { StructuredData } from '@/features/seo/components/structured-data';
import { formatDate } from '@/lib/utils/formatting';

interface BlogArticlePageProps {
  params: Promise<{ slug: string; locale: string }>;
}

/** Resolve an image path to an absolute URL for OpenGraph/Twitter meta tags. */
function toAbsoluteUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${siteConfig.siteUrl}${path}`;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';

  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    select: {
      title: true,
      titleEn: true,
      titleAr: true,
      excerpt: true,
      excerptEn: true,
      excerptAr: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!article) return {};

  const title = isAr
    ? (article.titleAr?.trim()   || article.title || article.titleEn || '')
    : isEn ? (article.titleEn?.trim() || article.title) : article.title;
  const description = isAr
    ? (article.excerptAr?.trim()   || article.excerpt || article.excerptEn || '')
    : isEn ? (article.excerptEn?.trim() || article.excerpt) : article.excerpt;
  const imageUrl = toAbsoluteUrl(article.image);
  const ogLocale = isEn ? 'en_US' : isAr ? 'ar_SA' : 'fa_IR';

  return {
    title,
    description,
    alternates: buildAlternates(locale, `blog/${slug}`),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      type: 'article',
      title,
      description,
      locale: ogLocale,
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
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

/**
 * Individual blog article page — Server Component.
 * Reads the article directly from the database by slug.
 */
export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug, locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';

  const article = await prisma.article.findUnique({
    where: { slug, published: true },
  });
  if (!article) notFound();

  const displayTitle = isAr
    ? (article.titleAr?.trim()   || article.title || article.titleEn || '')
    : isEn ? (article.titleEn?.trim() || article.title) : article.title;
  const displayExcerpt = isAr
    ? (article.excerptAr?.trim()   || article.excerpt || article.excerptEn || '')
    : isEn ? (article.excerptEn?.trim() || article.excerpt) : article.excerpt;
  const displayContent = isAr
    ? (article.contentAr?.trim()   || article.content || article.contentEn || '')
    : isEn ? (article.contentEn?.trim() || article.content) : article.content;

  const publishedAt = article.createdAt.toISOString();
  const modifiedAt  = article.updatedAt.toISOString();
  const imageUrl    = toAbsoluteUrl(article.image);

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      {/* JSON-LD structured data */}
      <StructuredData
        type="Article"
        data={{
          headline: displayTitle,
          description: displayExcerpt,
          ...(imageUrl ? { image: imageUrl } : {}),
          datePublished: publishedAt,
          dateModified: modifiedAt,
          author: {
            '@type': 'Organization',
            name: siteConfig.name,
          },
        }}
      />

      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: displayTitle, href: '#' },
        ]}
      />

      {/* Header */}
      <header className="mt-6 mb-10">
        <h1 className="text-4xl font-bold leading-snug text-gray-900">
          {displayTitle}
        </h1>
        <time
          dateTime={publishedAt}
          className="mt-3 block text-sm text-gray-500"
        >
          {formatDate(publishedAt, locale)}
        </time>
      </header>

      {/* Cover image */}
      {article.image && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={article.image}
            alt={displayTitle}
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Excerpt */}
      <p className="mb-8 text-lg text-gray-600 border-l-4 border-brand-600 pl-4 italic">
        {displayExcerpt}
      </p>

      {/* Content */}
      <div className="space-y-4 text-gray-800 leading-relaxed">
        {displayContent.split('\n').map((paragraph: string, i: number) =>
          paragraph.trim() ? (
            <p key={i}>{paragraph}</p>
          ) : null
        )}
      </div>
    </article>
  );
}
