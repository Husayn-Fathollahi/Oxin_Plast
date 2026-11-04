/**
 * site-config.ts
 * Single source of truth for site-wide static configuration.
 * Update this file when the company info changes.
 */
export const siteConfig = {
  name: 'سلمان پلاستیک',
  legalName: 'Salman Plastic Industry',
  description:
    'تولیدکننده سطل‌های پدالی و سبدهای پیک‌نیک — محصولات پلیمری با مواد اولیه PP درجه یک.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://plasticcompany.ir',

  /**
   * Direct-download URL for the product catalog PDF.
   * Google Drive direct-download link (uc?export=download) so clicking any
   * "Download Catalog" button downloads the file directly.
   */
  catalogUrl:
    'https://drive.google.com/uc?export=download&id=1N86gsjJNQIO8tlmBLXc1lv9dLCJevsaF',

  contact: {
    address: 'Tehran, Iran',
    phone: '+98 992 888 3595',
    email: 'info@plasticcompany.ir',
  },

  social: {
    instagram: "https://instagram.com/plasticcompany",
    linkedin: "https://linkedin.com/company/plasticcompany",
    whatsapp: "https://wa.me/+989928883595",
    telegram: "https://t.me/oxinplast",
    rubika: "https://rubika.ir/oxinplast",
    bale: "https://ble.ir/oxinplast",
  },

  /** Live chat (Crisp) placeholder — set the website ID from the Crisp dashboard. */
  crisp: {
    websiteId: process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ?? '',
  },
} as const;
