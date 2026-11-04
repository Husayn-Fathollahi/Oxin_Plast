export interface ArticleEntity {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body?: string;
  coverImageUrl?: string;
  category?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
