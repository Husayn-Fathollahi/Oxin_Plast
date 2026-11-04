import { apiClient } from '@/lib/api-client';

export interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  publishedAt: string;
  category?: string;
  tags: string[];
}

/**
 * Fetches a single blog article by slug.
 * Returns null when not found.
 */
export async function getArticleDetail(slug: string): Promise<ArticleDetail | null> {
  try {
    const response = await apiClient.get<ArticleDetail>(`/blog/${slug}`);
    return response.data;
  } catch (error: unknown) {
    const isNotFound =
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      (error as { status: number }).status === 404;
    if (isNotFound) return null;
    throw error;
  }
}
