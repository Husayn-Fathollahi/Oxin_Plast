'use client';

import Image from 'next/image';
import { ParallaxLayer } from '@/components/ui/ParallaxLayer';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  compact?: boolean;
  imageSrc?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  compact = false,
  imageSrc = '/images/3d/3d-hero-scene.jpg',
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-slate-200',
        compact ? 'min-h-[220px] py-14 sm:py-16' : 'min-h-[320px] py-20 sm:py-24',
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <ParallaxLayer speed={0.14} className="absolute inset-0">
          <Image
            src={imageSrc}
            alt=""
            fill
            priority={false}
            className="scale-105 object-cover"
            sizes="100vw"
          />
        </ParallaxLayer>
        <div className="absolute inset-0 bg-[#061216]/72" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#164E53]/55 via-transparent to-[#061216]/40" />
      </div>

      <div className="container relative mx-auto px-5 lg:px-8">
        {eyebrow && (
          <div className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-200/90">
            <span className="h-px w-8 bg-[#0D9488]" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200/85 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
