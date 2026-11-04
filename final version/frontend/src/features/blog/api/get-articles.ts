import { apiClient } from '@/lib/api-client';
import type { ArticleCardProps } from '@/components/blog/article-card';

/**
 * Fetches the list of published blog articles.
 */
export async function getArticles(): Promise<ArticleCardProps[]> {
  const response = await apiClient.get<ArticleCardProps[]>('/blog');
  return response.data;
}
