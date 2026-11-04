'use client';

import { useMemo, useState } from 'react';
import { ProductCard, type ProductCardProps } from './product-card';

/** A product card enriched with the category slug it belongs to (or null). */
export interface ExplorerCard extends ProductCardProps {
  categorySlug: string | null;
}

/** A category tab shown above the grid. */
export interface ExplorerCategory {
  slug: string;
  label: string;
}

interface ProductsExplorerProps {
  cards: ExplorerCard[];
  /** All available categories (shown as tabs even when empty). */
  categories: ExplorerCategory[];
  /** Localized label for the "all products" tab. */
  allLabel: string;
  /** Localized message shown when the active category has no products. */
  emptyLabel: string;
}

/**
 * ProductsExplorer — client-side category tabs + product grid.
 * Clicking a tab filters the products instantly, without a page refresh.
 * Reuses ProductCard for full visual consistency.
 */
export function ProductsExplorer({
  cards,
  categories,
  allLabel,
  emptyLabel,
}: ProductsExplorerProps) {
  const [active, setActive] = useState<string>('all');

  const filtered = useMemo(
    () => (active === 'all' ? cards : cards.filter((c) => c.categorySlug === active)),
    [active, cards],
  );

  const tabs: ExplorerCategory[] = [{ slug: 'all', label: allLabel }, ...categories];

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = active === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setActive(tab.slug)}
              aria-pressed={isActive}
              className={
                isActive
                  ? 'rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white shadow-soft transition-colors'
                  : 'rounded-full border border-sand-200 bg-white px-5 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700'
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filtered grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">{emptyLabel}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
