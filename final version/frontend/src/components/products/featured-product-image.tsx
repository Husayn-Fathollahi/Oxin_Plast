'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK_IMAGE = '/images/3d/3d-pedal-bin.jpg';

interface FeaturedProductImageProps {
  src?: string | null;
  alt: string;
}

function resolveSrc(src?: string | null) {
  if (!src || src.trim() === '') return FALLBACK_IMAGE;
  // Known deleted legacy uploads / missing logos
  if (src.includes('178358') || src.includes('006.png') || src.includes('222222222')) {
    return FALLBACK_IMAGE;
  }
  return src;
}

/**
 * FeaturedProductImage — next/image wrapper for homepage featured product cards.
 * Falls back when the product has no image or the image fails to load.
 */
export function FeaturedProductImage({ src, alt }: FeaturedProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveSrc(src));
  const isExternal = /^https?:\/\//i.test(currentSrc);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
      unoptimized={isExternal || currentSrc.endsWith('.png')}
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) setCurrentSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
