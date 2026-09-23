// src/lib/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fa', 'en', 'ar'],
  defaultLocale: 'fa',
  localeDetection: false,
  localePrefix: 'always'
});


