// src/lib/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'fa',
  localePrefix: 'always' // یعنی همیشه /fa و /en توی URL باشه
});

