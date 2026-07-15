export interface SeoConfigEntity {
  id: string;
  routeKey: string;
  title?: string;
  description?: string;
  ogImageUrl?: string;
  noIndex: boolean;
  canonicalUrl?: string;
  updatedAt: Date;
}
