'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface ProductImageData {
  id: string;
  url: string;
  altEn: string | null;
  altFa: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductGalleryProps {
  images: ProductImageData[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const primaryImage =
    images.find((img) => img.isPrimary) ?? images[0] ?? null;

  const [selected, setSelected] = useState<ProductImageData | null>(primaryImage);

  if (images.length === 0 || !selected) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <span className="text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={selected.url}
            alt={selected.altEn ?? productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Thumbnails — only show when there are multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((img) => {
            const isActive = img.id === selected.id;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelected(img)}
                className={[
                  'overflow-hidden rounded-lg border-2 transition-colors',
                  isActive
                    ? 'border-brand-500 ring-2 ring-brand-200'
                    : 'border-transparent hover:border-gray-300',
                ].join(' ')}
                aria-label={img.altEn ?? `Image ${img.sortOrder + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={img.url}
                    alt={img.altEn ?? productName}
                    fill
                    sizes="(max-width: 640px) 25vw, 10vw"
                    className="object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
