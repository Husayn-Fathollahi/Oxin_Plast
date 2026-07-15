import { apiClient } from '@/lib/api-client';
import type { ProductCardProps } from '@/components/products/product-card';

/**
 * Fetches the full list of published products from the backend.
 * Used in the products listing Server Component.
 */
export async function getProducts(): Promise<ProductCardProps[]> {
  const response = await apiClient.get<ProductCardProps[]>('/products');
  return response.data;
}
