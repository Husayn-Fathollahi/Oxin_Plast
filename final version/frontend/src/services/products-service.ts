import { apiClient } from '@/lib/api-client';
import type { ProductCardProps } from '@/components/products/product-card';
import type { ProductDetail } from '@/features/products/api/get-product-detail';

/**
 * ProductsService — server-side service adapter for product data.
 * Centralises all product-related API calls used by Server Components and admin pages.
 */
export const productsService = {
  getAll(): Promise<{ data: ProductCardProps[] }> {
    return apiClient.get<ProductCardProps[]>('/products');
  },

  getBySlug(slug: string): Promise<{ data: ProductDetail }> {
    return apiClient.get<ProductDetail>(`/products/${slug}`);
  },

  create(payload: Partial<ProductDetail>): Promise<{ data: ProductDetail }> {
    return apiClient.post<ProductDetail>('/products', payload);
  },

  update(id: string, payload: Partial<ProductDetail>): Promise<{ data: ProductDetail }> {
    return apiClient.patch<ProductDetail>(`/products/${id}`, payload);
  },

  remove(id: string): Promise<{ data: void }> {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
