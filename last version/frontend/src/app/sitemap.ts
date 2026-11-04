import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/config/site-config';

const BASE_URL = siteConfig.siteUrl.replace(/\/$/, '');
const LOCALES = ['fa', 'en'] as const;

/** Build a full URL for a given locale and path (without leading slash). */
function url(locale: string, path = '') {
  return `${BASE_URL}/${locale}${path ? `/${path}` : ''}`;
}

/** Produce alternates for every locale pointing to the same content. */
function alternates(path = '') {
  return {
    languages: Object.fromEntries(
      LOCALES.map((locale) => [locale, url(locale, path)]),
    ) as Record<string, string>,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ───────────────────────────────────────────────────────────
  const staticPaths = ['', 'about', 'contact', 'catalog', 'products', 'blog'];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: url('fa', path),          // canonical = FA (default locale)
    alternates: alternates(path),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
    lastModified: new Date(),
  }));

  // ── Products (slugs + updatedAt only for efficiency) ──────────────────────
  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: url('fa', `products/${p.slug}`),
    alternates: alternates(`products/${p.slug}`),
    changeFrequency: 'weekly',
    priority: 0.7,
    lastModified: p.updatedAt,
  }));

  // ── Blog articles (slugs + updatedAt only for efficiency) ─────────────────
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: url('fa', `blog/${a.slug}`),
    alternates: alternates(`blog/${a.slug}`),
    changeFrequency: 'weekly',
    priority: 0.6,
    lastModified: a.updatedAt,
  }));

  return [...staticEntries, ...productEntries, ...articleEntries];
}
