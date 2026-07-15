'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsCarouselProps {
  isEn: boolean;
}

interface Testimonial {
  quoteFa: React.ReactNode;
  quoteEn: React.ReactNode;
  initialsFa: string;
  initialsEn: string;
  nameFa: string;
  nameEn: string;
  roleFa: string;
  roleEn: string;
}

const testimonials: Testimonial[] = [
  {
    quoteFa: (
      <>«پس از دو سال استفاده در پنج استان، <span className="text-gradient">حتی یک خرابی هم نداشتیم</span>. مهندسی محصول خودش گویاست.»</>
    ),
    quoteEn: (
      <>&ldquo;After two years across five provinces, <span className="text-gradient">not a single failure</span>. The engineering speaks for itself.&rdquo;</>
    ),
    initialsFa: 'ا.ک',
    initialsEn: 'AK',
    nameFa: 'احمد کریمی',
    nameEn: 'Ahmad Karimi',
    roleFa: 'مدیر عملیات، پتروتک',
    roleEn: 'Operations Director, PetroTech',
  },
  {
    quoteFa: (
      <>«کیفیت در هر سفارش یکدست است و تحویل همیشه به‌موقع. برای همین <span className="text-gradient">سه سال است</span> فقط از این مجموعه خرید می‌کنیم.»</>
    ),
    quoteEn: (
      <>&ldquo;The quality is identical on every order and delivery is always on time. That&rsquo;s why we&rsquo;ve sourced exclusively from them for <span className="text-gradient">three years</span>.&rdquo;</>
    ),
    initialsFa: 'م.ر',
    initialsEn: 'MR',
    nameFa: 'مریم رضایی',
    nameEn: 'Maryam Rezaei',
    roleFa: 'مدیر خرید، صنایع غذایی گلستان',
    roleEn: 'Purchasing Manager, Golestan Foods',
  },
  {
    quoteFa: (
      <>«بشکه‌ها حتی زیر بارِ سنگین و دمای بالا فرم خودشان را حفظ می‌کنند. کار با این محصولات واقعاً <span className="text-gradient">بی‌دردسر</span> است.»</>
    ),
    quoteEn: (
      <>&ldquo;The barrels keep their shape even under heavy loads and high heat. Working with these products is genuinely <span className="text-gradient">hassle-free</span>.&rdquo;</>
    ),
    initialsFa: 'ر.م',
    initialsEn: 'RM',
    nameFa: 'رضا محمدی',
    nameEn: 'Reza Mohammadi',
    roleFa: 'سرپرست لجستیک، آریا شیمی',
    roleEn: 'Logistics Supervisor, Aria Chemical',
  },
  {
    quoteFa: (
      <>«پشتیبانی سریع و مواد اولیه <span className="text-gradient">درجه‌یک</span>؛ دقیقاً همان چیزی که یک تولیدکننده برای آرامش خاطر به آن نیاز دارد.»</>
    ),
    quoteEn: (
      <>&ldquo;Fast support and <span className="text-gradient">top-grade</span> raw materials — exactly what a manufacturer needs for peace of mind.&rdquo;</>
    ),
    initialsFa: 'س.ا',
    initialsEn: 'SA',
    nameFa: 'سارا احمدی',
    nameEn: 'Sara Ahmadi',
    roleFa: 'مدیر کیفیت، پردیس اگرو',
    roleEn: 'Quality Manager, Pardis Agro',
  },
];

const ROTATE_MS = 4500;

/**
 * TestimonialsCarousel — auto-rotating customer testimonials.
 * Keeps the existing centered "Client Voices" styling but cycles through
 * multiple quotes with a smooth fade, plus prev/next controls and dots.
 */
export function TestimonialsCarousel({ isEn }: TestimonialsCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const go = useCallback(
    (dir: 1 | -1) => setActive((prev) => (prev + dir + count) % count),
    [count],
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, count, active]);

  const current = testimonials[active];

  return (
    <div
      className="text-center max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="eyebrow justify-center">
        <span className="dash" /> {isEn ? 'Client Voices' : 'صدای مشتریان'} <span className="dash" />
      </span>

      {/* Slide viewport — fixed-ish height avoids jumpiness between quotes */}
      <div
        className="relative mt-8 flex min-h-[220px] items-center justify-center sm:min-h-[200px]"
        aria-live="polite"
      >
        <div key={active} className="animate-fade-up animate-fill-both">
          <blockquote className="display text-display-xs leading-snug text-ink">
            {isEn ? current.quoteEn : current.quoteFa}
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-gradient text-white font-bold">
              {isEn ? current.initialsEn : current.initialsFa}
            </span>
            <div className="text-start">
              <div className="font-bold text-ink">{isEn ? current.nameEn : current.nameFa}</div>
              <div className="text-sm text-ink-muted">{isEn ? current.roleEn : current.roleFa}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={isEn ? 'Previous testimonial' : 'نظر قبلی'}
          className="grid h-10 w-10 place-items-center rounded-full border border-sand-200 bg-white text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronLeft className="h-5 w-5 flip-x" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={isEn ? `Go to testimonial ${i + 1}` : `رفتن به نظر ${i + 1}`}
              aria-current={i === active}
              className={
                i === active
                  ? 'h-2.5 w-6 rounded-full bg-brand-gradient transition-all duration-300'
                  : 'h-2.5 w-2.5 rounded-full bg-sand-300 transition-all duration-300 hover:bg-brand-300'
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label={isEn ? 'Next testimonial' : 'نظر بعدی'}
          className="grid h-10 w-10 place-items-center rounded-full border border-sand-200 bg-white text-ink-muted transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronRight className="h-5 w-5 flip-x" />
        </button>
      </div>
    </div>
  );
}
