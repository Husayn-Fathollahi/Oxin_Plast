'use client';

import { useState } from 'react';
import { siteConfig } from '@/config/site-config';

/**
 * BrandLogo — company logo for the site header.
 *
 * Renders the Oxin Plast logo image. If the image file is missing (e.g. not
 * uploaded yet), it gracefully falls back to the geometric mark + wordmark so
 * the header never shows a broken image.
 *
 * To use the real logo, save it as: public/images/logo/oxin-logo.png
 * (a transparent PNG is recommended so it sits nicely on the light header).
 */
export function BrandLogo() {
  const [imgOk, setImgOk] = useState(true);

  if (imgOk) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/images/logo/222222222.jpg"
        alt={siteConfig.name}
        onError={() => setImgOk(false)}
        className="h-14 w-auto object-contain"
      />
    );
  }

  return (
    <>
      <span
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-2xl text-white
                   bg-brand-gradient shadow-glow transition-transform duration-300
                   group-hover:scale-105 group-hover:rotate-3"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
        </svg>
      </span>
      <span className="display text-lg leading-none text-ink">{siteConfig.name}</span>
    </>
  );
}
