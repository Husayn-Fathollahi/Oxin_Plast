import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // The middleware (localePrefix: 'always') ensures locale is always present and
  // valid before this config runs. This fallback is a safety net for edge cases
  // such as direct API calls or testing environments.
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const [admin, blog, catalog, common, contact, home, products] = await Promise.all([
    import(`../../translations/${locale}/admin.json`),
    import(`../../translations/${locale}/blog.json`),
    import(`../../translations/${locale}/catalog.json`),
    import(`../../translations/${locale}/common.json`),
    import(`../../translations/${locale}/contact.json`),
    import(`../../translations/${locale}/home.json`),
    import(`../../translations/${locale}/products.json`),
  ]);

  return {
    locale,
    messages: {
      admin: admin.default,
      blog: blog.default,
      catalog: catalog.default,
      common: common.default,
      contact: contact.default,
      home: home.default,
      products: products.default,
    },
  };
});
