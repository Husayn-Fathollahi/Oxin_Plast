import { apiClient } from '@/lib/api-client';
import type { ArticleCardProps } from '@/components/blog/article-card';
import type { ArticleDetail } from '@/features/blog/api/get-article-detail';

/**
 * BlogService — adapter for all blog-related API calls.
 */
export const blogService = {
  getAll(): Promise<{ data: ArticleCardProps[] }> {
    return apiClient.get<ArticleCardProps[]>('/blog');
  },

  getBySlug(slug: string): Promise<{ data: ArticleDetail }> {
    return apiClient.get<ArticleDetail>(`/blog/${slug}`);
  },

  create(payload: Partial<ArticleDetail>): Promise<{ data: ArticleDetail }> {
    return apiClient.post<ArticleDetail>('/blog', payload);
  },

  update(id: string, payload: Partial<ArticleDetail>): Promise<{ data: ArticleDetail }> {
    return apiClient.patch<ArticleDetail>(`/blog/${id}`, payload);
  },

  remove(id: string): Promise<{ data: void }> {
    return apiClient.delete<void>(`/blog/${id}`);
  },
};
