import { apiClient } from '@/lib/api-client';

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  images: string[];
  category?: string;
  specs: Record<string, string>;
  catalogPdfUrl?: string;
  publishedAt: string;
}

/**
 * Fetches a single product by its slug.
 * Returns null when the product is not found (404).
 */
export async function getProductDetail(slug: string): Promise<ProductDetail | null> {
  try {
    const response = await apiClient.get<ProductDetail>(`/products/${slug}`);
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
