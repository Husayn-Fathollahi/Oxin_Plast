import { Link } from '@/lib/i18n/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface ProductCardProps {
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl?: string;
  category?: string;
}

/**
 * ProductCard — single product item displayed in the listing grid.
 */
export function ProductCard({ name, slug, shortDescription, imageUrl, category }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="card group flex flex-col overflow-hidden">
      {/* Product image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-mesh text-sand-400">
            <span className="text-sm font-semibold">No image</span>
          </div>
        )}
        {category && (
          <span className="absolute top-4 start-4 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold text-brand-700 shadow-soft">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="display text-xl text-ink">{name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted line-clamp-2">{shortDescription}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
          View Details
          <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

