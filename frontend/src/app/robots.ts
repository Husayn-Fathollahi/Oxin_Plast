import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site-config';

const BASE_URL = siteConfig.siteUrl.replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Block admin panels (both locale prefixes) and all API routes
      disallow: ['/fa/admin/', '/en/admin/', '/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
