export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  category?: string;
  imageUrl?: string;
  catalogPdfUrl?: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}
