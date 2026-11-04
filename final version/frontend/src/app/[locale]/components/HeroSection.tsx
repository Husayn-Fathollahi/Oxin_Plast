'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';

type Locale = 'fa' | 'en' | 'ar';

const PRODUCTS = [
  {
    src: '/images/3d/3d-pedal-bin.jpg',
    title: { fa: 'سطل زباله پدالی صنعتی', en: 'Industrial Pedal Bin', ar: 'سلة مهملات بدواسة صناعية' },
  },
  {
    src: '/images/3d/3d-picnic-basket.jpg',
    title: { fa: 'سبد پیک‌نیک مقاوم', en: 'Durable Picnic Basket', ar: 'سلة نزهة متينة' },
  },
  {
    src: '/images/3d/3d-pedal-bin-closed.jpg',
    title: { fa: 'سطل پدالی درب‌بسته', en: 'Closed-Lid Pedal Bin', ar: 'سلة بدواسة بغطاء مغلق' },
  },
  {
    src: '/images/3d/hero-bin-open-v2.png',
    title: { fa: 'سطل پدالی درب‌باز', en: 'Open-Lid Pedal Bin', ar: 'سلة بدواسة بغطاء مفتوح' },
  },
  {
    src: '/images/3d/3d-quality-pp.jpg',
    title: { fa: 'محصولات پلیمری استاندارد', en: 'Quality Polymer Products', ar: 'منتجات بوليمرية مطابقة للمواصفات' },
  },
  {
    src: '/images/3d/3d-factory-pallets.jpg',
    title: { fa: 'تولید و آماده‌سازی صنعتی', en: 'Industrial Production and Handling', ar: 'الإنتاج والتجهيز الصناعي' },
  },
  {
    src: '/images/3d/hero-picnic-basket.png',
    title: { fa: 'سبد چهار قفله', en: 'Four-Lock Picnic Basket', ar: 'سلة نزهة بأربعة أقفال' },
  },
  {
    src: '/images/3d/3d-tile-custom.jpg',
    title: { fa: 'تولید متناسب با سفارش', en: 'Made to Order', ar: 'تصنيع حسب الطلب' },
  },
  {
    src: '/images/3d/hero-pedal-bin-closed.png',
    title: { fa: 'ظروف پلیمری بادوام', en: 'Durable Polymer Containers', ar: 'عبوات بوليمرية متينة' },
  },
] as const;

const SCROLL_PROMPT: Record<Locale, string> = {
  fa: 'برای دیدن محصولات اسکرول کنید',
  en: 'Scroll to explore our products',
  ar: 'مرّر لاستكشاف منتجاتنا',
};

const COMPANY_NAME: Record<Locale, string> = {
  fa: 'سلمان پلاستیک',
  en: 'Salman Plastic',
  ar: 'سلمان بلاستيك',
};

type TunnelCardData = {
  item: (typeof PRODUCTS)[number];
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
};

const TUNNEL_CARDS: TunnelCardData[] = PRODUCTS.map((item, index) => {
  const goldenAngle = (index * 137.5 * Math.PI) / 180;

  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX: 0.28 + (index % 3) * 0.08,
    radiusFactorY: 0.26 + (index % 2) * 0.09,
    rotationZ: (index % 2 === 0 ? 1 : -1) * (3 + (index % 5) * 2),
    index,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
  reduceMotion: boolean;
  locale: Locale;
}

function TunnelCard({ card, progress, pointer, total, stage, reduceMotion, locale }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;
  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -680 : -1500;
  const nearZ = stage.isMobile ? 90 : 300;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);
  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(78, Math.min(122, stage.width * 0.27))
    : Math.max(160, Math.min(240, stage.width * 0.17));
  const baseX = stage.isMobile
    ? card.angleCos * stage.width * card.radiusFactorX * 0.56
    : card.angleCos * stage.width * card.radiusFactorX;
  const baseY = stage.isMobile
    ? card.angleSin * stage.height * card.radiusFactorY * 0.68
    : card.angleSin * stage.height * card.radiusFactorY;
  const panStrength = stage.isMobile ? 12 : 36;

  const transform = useTransform(
    [z, pointer.x, pointer.y],
    ([currentZ, pointerX, pointerY]: number[]) => {
      const offsetX = baseX - pointerX * panStrength;
      const offsetY = baseY - pointerY * panStrength;
      const rotation = stage.isMobile ? card.rotationZ * 0.55 : card.rotationZ;
      return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currentZ}px) rotateZ(${rotation}deg)`;
    },
  );

  return (
    <motion.article
      suppressHydrationWarning
      style={{
        width: cardWidth,
        transform: reduceMotion
          ? `translate3d(calc(-50% + ${baseX}px), calc(-50% + ${baseY}px), 0) rotateZ(${card.rotationZ * (stage.isMobile ? 0.55 : 1)}deg)`
          : transform,
        opacity,
        zIndex: card.index + 1,
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-[4/5] select-none will-change-transform"
      aria-label={card.item.title[locale]}
    >
      <div className="group relative h-full w-full overflow-hidden rounded-lg bg-slate-800 shadow-2xl shadow-black/50 ring-1 ring-white/15 sm:rounded-2xl">
        <Image
          src={card.item.src}
          alt={card.item.title[locale]}
          fill
          sizes="(max-width: 1023px) 27vw, 18vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={card.index < 3}
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-1.5 sm:p-4">
          <span className={stage.isMobile ? 'text-[8px] font-bold leading-[1.15] text-white drop-shadow' : 'text-[10px] font-bold leading-4 text-white drop-shadow sm:text-xs sm:leading-5'}>
            {card.item.title[locale]}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale() as Locale;
  const isRtl = locale !== 'en';
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<StageDimensions>({
    width: 1440,
    height: 900,
    isMobile: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight - (window.innerWidth < 1024 ? 56 : 0),
        isMobile: window.innerWidth < 1024,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const reduceMotion = Boolean(reduce);
  const pointer = useCameraParallax(!reduceMotion && !stage.isMobile);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  const titleScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    stage.isMobile ? [0.94, 1, 1.03] : [0.82, 1, 1.12],
  );
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.55, 1, 1, 0.8]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const progressScale = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={locale === 'fa' ? 'معرفی محصولات سلمان پلاستیک' : locale === 'ar' ? 'منتجات سلمان بلاستيك' : 'Salman Plastic products'}
      className="relative h-[115svh] border-b border-slate-200 sm:h-[125svh] lg:h-[220svh]"
    >
      <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-[#071418] [perspective:900px] lg:top-0 lg:h-svh lg:[perspective:1200px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(#1e4b50_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_55%,transparent_100%)] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(13,148,136,0.24),transparent_68%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_100%,rgba(22,78,83,0.32),transparent_48%)]" />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[48vmin] w-[48vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-300/20" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" aria-hidden="true" />

        <div
          suppressHydrationWarning
          className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
        >
          {mounted &&
            TUNNEL_CARDS.map((card) => (
              <TunnelCard
                key={card.index}
                card={card}
                progress={smoothProgress}
                pointer={pointer}
                total={TUNNEL_CARDS.length}
                stage={stage}
                reduceMotion={reduceMotion}
                locale={locale}
              />
            ))}
        </div>

        <motion.div
          style={{
            scale: reduceMotion ? 1 : titleScale,
            opacity: reduceMotion ? 1 : titleOpacity,
          }}
          className="pointer-events-none absolute inset-x-4 top-[9%] z-20 mx-auto max-w-3xl text-center sm:top-[14%] sm:px-8 lg:top-[18%]"
        >
          <p className="mb-2 text-[9px] font-bold leading-4 tracking-[0.08em] text-teal-200 sm:mb-5 sm:text-xs sm:tracking-[0.25em]">
            {t('badge')}
          </p>
          <h1 className="mx-auto max-w-[20ch] text-[clamp(1.25rem,5.7vw,3.75rem)] font-black leading-[1.25] tracking-tight text-white sm:text-4xl sm:leading-[1.35] md:text-5xl lg:text-6xl">
            {t('title')}
            <span className="mt-1 block text-sm text-teal-200 sm:mt-3 sm:text-xl lg:text-2xl">
              {COMPANY_NAME[locale]}
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-[9px] leading-[1.45] text-slate-200/90 sm:mt-4 sm:text-sm sm:leading-7">
            {t('description')}
          </p>
          <div className="pointer-events-auto mt-2 flex justify-center gap-2 sm:mt-6 sm:gap-3">
            <Link
              href="/catalog"
              className="inline-flex min-h-8 items-center justify-center rounded-lg bg-teal-600 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 sm:min-h-11 sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
            >
              {t('cta_primary')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-8 items-center justify-center rounded-lg border border-white/30 bg-slate-950/20 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 sm:min-h-11 sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: reduceMotion ? 0 : promptOpacity }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[9px] font-bold text-slate-300 sm:bottom-10 sm:gap-2 sm:text-xs"
        >
          <span>{SCROLL_PROMPT[locale]}</span>
          <span className="h-6 w-px bg-gradient-to-b from-teal-400 to-transparent" aria-hidden="true" />
        </motion.div>

        <div className="absolute inset-x-4 bottom-3 z-30 h-px overflow-hidden bg-white/15 sm:inset-x-8 sm:bottom-5 lg:inset-x-10">
          <motion.span
            style={{
              scaleX: reduceMotion ? 0 : progressScale,
              transformOrigin: isRtl ? 'right' : 'left',
            }}
            className="block h-full bg-teal-400"
            aria-hidden="true"
          />
        </div>

        <ul
          className="sr-only"
          aria-label={locale === 'fa' ? 'محصولات نمایش‌داده‌شده' : locale === 'ar' ? 'المنتجات المعروضة' : 'Displayed products'}
        >
          {PRODUCTS.map((product) => (
            <li key={product.src}>{product.title[locale]}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
