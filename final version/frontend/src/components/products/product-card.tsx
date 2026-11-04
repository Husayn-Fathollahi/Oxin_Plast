'use client';

import { Link } from '@/lib/i18n/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface ProductCardProps {
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl?: string;
  category?: string;
}

const FALLBACK = '/images/3d/3d-pedal-bin.jpg';

function resolve(src?: string) {
  if (!src) return FALLBACK;
  if (src.includes('178358') || src.includes('006.png')) return FALLBACK;
  return src;
}

export function ProductCard({ name, slug, shortDescription, imageUrl, category }: ProductCardProps) {
  const [src, setSrc] = useState(() => resolve(imageUrl));

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-teal-500/50 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => {
            if (src !== FALLBACK) setSrc(FALLBACK);
          }}
        />
        {category && (
          <span className="absolute start-3 top-3 rounded-3xl border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#164E53]">
            {category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-slate-100 p-5">
        <h3 className="text-lg font-black tracking-tight text-[#0F172A]">{name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{shortDescription}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0D9488]">
          View Details
          <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
