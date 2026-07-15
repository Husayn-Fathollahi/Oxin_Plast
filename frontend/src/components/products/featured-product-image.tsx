'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK_IMAGE = '/images/logo/006.png';

interface FeaturedProductImageProps {
  src?: string | null;
  alt: string;
}

/**
 * FeaturedProductImage — next/image wrapper for homepage featured product cards.
 * Falls back to a default image when the product has no image or the image
 * fails to load at runtime. Absolute (external) URLs are rendered unoptimized
 * so they don't require an explicit `remotePatterns` entry.
 */
export function FeaturedProductImage({ src, alt }: FeaturedProductImageProps) {
  const initial = src && src.trim() !== '' ? src : FALLBACK_IMAGE;
  const [currentSrc, setCurrentSrc] = useState(initial);

  const isExternal = /^https?:\/\//i.test(currentSrc);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      unoptimized={isExternal}
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) setCurrentSrc(FALLBACK_IMAGE);
      }}
    />
  );
}
