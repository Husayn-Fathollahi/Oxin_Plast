import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EditArticleForm } from '@/features/blog/components/EditArticleForm';

interface EditArticlePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id }, select: { title: true } });
  if (!article) return {};
  return { title: `Edit: ${article.title}` };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id, locale } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Article</h1>
          <p className="mt-1 text-sm text-gray-500">{article.title}</p>
        </div>
        <a
          href={`/${locale}/admin/blog`}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          ← Back
        </a>
      </div>

      <EditArticleForm
        id={article.id}
        locale={locale}
        initial={{
          title: article.title,
          titleEn: article.titleEn ?? '',
          titleAr: article.titleAr ?? '',
          slug: article.slug,
          excerpt: article.excerpt,
          excerptEn: article.excerptEn ?? '',
          excerptAr: article.excerptAr ?? '',
          content: article.content,
          contentEn: article.contentEn ?? '',
          contentAr: article.contentAr ?? '',
          image: article.image ?? '',
          published: article.published,
        }}
      />
    </div>
  );
}
