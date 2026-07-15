/**
 * Product categories — single source of truth for the whole app (FA/EN).
 *
 * Products live in the database and are added via the admin panel, so we do NOT
 * store a category column. Instead each product is assigned to a category
 * automatically by matching keywords in its (Persian / English) name.
 *
 * Display labels are shown through the project's i18n system
 * (see `translations/{fa,en}/products.json` → `categories.*`). The `fa` / `en`
 * strings kept here are the canonical fallback and are used to keep the two
 * sources aligned.
 *
 * Product models such as "راگا" / "نو" / "Special" are NEVER category names —
 * they only help detect that a product is a "کلمن" (cooler).
 */

export type CategorySlug =
  | 'kitchenware'
  | 'cooling-storage'
  | 'industrial-gallons'
  | 'bulk-barrels'
  | 'home-accessories';

export interface CategoryDef {
  slug: CategorySlug;
  /** Canonical Persian label (display goes through i18n, this is the fallback). */
  fa: string;
  /** Canonical English label. */
  en: string;
  /** Persian/English keywords used to auto-assign a product to this category. */
  keywords: string[];
}

/** Ordered list of category slugs — drives tab order everywhere. */
export const CATEGORY_ORDER: CategorySlug[] = [
  'kitchenware',
  'cooling-storage',
  'industrial-gallons',
  'bulk-barrels',
  'home-accessories',
];

export const productCategories: Record<CategorySlug, CategoryDef> = {
  kitchenware: {
    slug: 'kitchenware',
    fa: 'ظروف آشپزخانه و پذیرایی',
    en: 'Kitchen & Dining',
    keywords: [
      'بانکه', 'فریزری', 'جاقاشقی', 'قالب بستنی', 'قالب', 'کاسه پاریس',
      'کاسه', 'پاریس', 'سینی',
      'jar', 'freezer', 'spoon', 'ice cream', 'mold', 'mould', 'bowl', 'paris',
      'tray', 'kitchen', 'dining',
    ],
  },
  'cooling-storage': {
    slug: 'cooling-storage',
    fa: 'کلمن و محصولات برودتی',
    en: 'Cooling & Insulated',
    keywords: [
      'کلمن', 'یخچال صندوقی', 'یخچال', 'صندوقی', 'بنتیک', 'یونولیت', 'برودتی',
      'cooler', 'cool box', 'chest fridge', 'fridge', 'icebox', 'bentik',
      'styrofoam', 'insulated', 'cooling',
    ],
  },
  'industrial-gallons': {
    slug: 'industrial-gallons',
    fa: 'گالن و مخازن صنعتی',
    en: 'Industrial Gallons',
    keywords: [
      'گالن کتابی', 'گالن', 'کتابی', 'دبه', 'مخزن', 'مخازن',
      'gallon', 'jerry can', 'jerrycan', 'jerry-can', 'tank', 'book gallon',
    ],
  },
  'bulk-barrels': {
    slug: 'bulk-barrels',
    fa: 'بشکه‌های پلی‌اتیلن',
    en: 'Bulk Barrels',
    keywords: ['بشکه', 'barrel', 'drum'],
  },
  'home-accessories': {
    slug: 'home-accessories',
    fa: 'لوازم بهداشتی و جانبی',
    en: 'Home & Accessories',
    keywords: [
      'آفتابه', 'پمپ نفت', 'پمپ', 'پاشش', 'قلک', 'شیرآلات',
      'ewer', 'watering', 'oil pump', 'pump', 'sprayer', 'spray', 'piggy',
      'faucet', 'accessory', 'accessories',
    ],
  },
};

/**
 * Optional manual overrides: map a product `slug` directly to a category.
 * Use this only for edge cases that keyword matching cannot resolve.
 *   e.g. 'my-product-slug': 'kitchenware'
 */
export const slugOverrides: Record<string, CategorySlug> = {};

/** Normalizes Persian/English text for robust keyword matching. */
function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/\u200c/g, '') // ZWNJ (نیم‌فاصله)
    .replace(/\u064a/g, '\u06cc') // ARABIC YEH → FARSI YEH
    .replace(/\u0649/g, '\u06cc') // ALEF MAKSURA → FARSI YEH
    .replace(/\u0643/g, '\u06a9') // ARABIC KAF → FARSI KEHEH
    .replace(/[\s\u200e\u200f]/g, ''); // spaces + LRM/RLM
}

// Pre-normalize keywords once for performance.
const normalizedKeywords: Record<CategorySlug, string[]> = Object.fromEntries(
  CATEGORY_ORDER.map((slug) => [
    slug,
    productCategories[slug].keywords.map(normalize),
  ]),
) as Record<CategorySlug, string[]>;

/** Type guard for a valid category slug. */
export function isCategorySlug(slug: string): slug is CategorySlug {
  return Object.prototype.hasOwnProperty.call(productCategories, slug);
}

/** Returns the category definition for a slug, or `undefined`. */
export function getCategory(slug: string): CategoryDef | undefined {
  return isCategorySlug(slug) ? productCategories[slug] : undefined;
}

/** Returns the localized label for a category definition. */
export function getCategoryLabel(category: CategoryDef, locale: string): string {
  return locale === 'en' ? category.en : category.fa;
}

/**
 * Determines a product's category from its name (and optional English name).
 * A `slug` may be provided to allow manual overrides.
 * Returns `null` when no category matches (product stays uncategorised).
 */
export function categorizeProduct(
  name: string,
  nameEn?: string | null,
  slug?: string | null,
): CategorySlug | null {
  if (slug && slugOverrides[slug]) return slugOverrides[slug];

  const haystack = normalize(`${name} ${nameEn ?? ''}`);
  for (const catSlug of CATEGORY_ORDER) {
    if (normalizedKeywords[catSlug].some((kw) => kw && haystack.includes(kw))) {
      return catSlug;
    }
  }
  return null;
}
