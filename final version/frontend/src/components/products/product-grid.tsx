import { ProductCard, type ProductCardProps } from './product-card';

interface ProductGridProps {
  products: ProductCardProps[];
}

/**
 * ProductGrid — responsive grid of ProductCard components.
 * Shows an empty state when no products are available.
 */
export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} {...product} />
      ))}
    </div>
  );
}
