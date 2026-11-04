import { apiClient } from '@/lib/api-client';

export interface SeoConfig {
  id: string;
  routeKey: string;       // e.g. "home", "products", "products/[slug]"
  title?: string;
  description?: string;
  ogImageUrl?: string;
  noIndex: boolean;
  canonicalUrl?: string;
}

/**
 * SeoService — reads and updates per-page SEO configurations.
 */
export const seoService = {
  getAll(): Promise<{ data: SeoConfig[] }> {
    return apiClient.get<SeoConfig[]>('/seo');
  },

  getByRouteKey(routeKey: string): Promise<{ data: SeoConfig }> {
    return apiClient.get<SeoConfig>(`/seo/${encodeURIComponent(routeKey)}`);
  },

  update(id: string, payload: Partial<SeoConfig>): Promise<{ data: SeoConfig }> {
    return apiClient.patch<SeoConfig>(`/seo/${id}`, payload);
  },
};
