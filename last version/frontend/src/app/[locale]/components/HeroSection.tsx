'use client';

import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

const studioGradient =
  'radial-gradient(ellipse 44% 62% at 74% 42%, rgba(255,255,255,0.98), transparent 75%), radial-gradient(ellipse 48% 66% at 12% 92%, rgba(197,220,204,0.55), transparent 78%), linear-gradient(118deg, #fbfaf5 0%, #f1f4ee 47%, #dceae1 100%)';

export default function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 25,
    mass: 0.32,
  });

  const closedOpacity = useTransform(progress, [0, 0.22, 0.78, 1], [1, 1, 0, 0]);
  const openOpacity = useTransform(progress, [0, 0.22, 0.78, 1], [0, 0, 1, 1]);
  const productRotate = useTransform(progress, [0, 1], [-2.5, 2.5]);
  const productY = useTransform(progress, [0, 1], [8, -8]);
  const productScale = useTransform(progress, [0, 1], [0.99, 1.02]);
  const copyY = useTransform(progress, [0, 1], [0, -12]);
  const closedLabelOpacity = useTransform(progress, [0, 0.2, 0.38], [1, 1, 0]);
  const openLabelOpacity = useTransform(progress, [0.68, 0.84, 1], [0, 1, 1]);

  const scrollLabel =
    locale === 'fa'
      ? 'برای دیدن حالت باز، اسکرول کنید'
      : locale === 'ar'
        ? 'مرّر لاكتشاف الغطاء المفتوح'
        : 'SCROLL TO OPEN';
  const closedLabel = locale === 'fa' ? 'درپوش بسته' : locale === 'ar' ? 'الغطاء مغلق' : 'CLOSED';
  const openLabel = locale === 'fa' ? 'درپوش باز' : locale === 'ar' ? 'الغطاء مفتوح' : 'OPEN';

  return (
    <section ref={sectionRef} className="relative h-[165vh] sm:h-[180vh]">
      <div
        className="sticky top-0 flex min-h-[min(900px,100svh)] items-center overflow-hidden"
        style={{ background: studioGradient }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(22,78,83,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(22,78,83,0.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(90deg,transparent,black_24%,black_76%,transparent)]" />
          <div className="absolute -start-32 -top-40 h-[30rem] w-[30rem] rounded-full border border-white/40" />
          <div className="absolute -start-20 -top-28 h-[26rem] w-[26rem] rounded-full border border-white/35" />
          <div className="absolute end-[-8rem] bottom-[-14rem] h-[34rem] w-[34rem] rounded-full bg-white/35 blur-3xl" />
          <div className="absolute end-[8%] top-[10%] h-[min(70vw,760px)] w-[min(70vw,760px)] rounded-full border border-white/35" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/30 to-transparent" />
        </div>

        <div className="container relative mx-auto grid w-full grid-cols-1 items-center gap-1 px-5 py-5 sm:px-8 lg:min-h-[min(900px,100svh)] lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-10 lg:py-10">
          <motion.div
            style={{ y: copyY }}
            className="relative z-20 order-2 mx-auto w-full max-w-xl pb-5 lg:order-1 lg:mx-0 lg:pb-0"
          >
            <div className="mb-5 flex items-center gap-3 sm:mb-7">
              <span className="h-px w-9 bg-[#0d9488]" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#39736a] sm:text-[11px]">
                {t('badge')}
              </span>
            </div>

            <h1 className="display max-w-[14ch] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.12] tracking-[-0.045em] text-[#173a34] rtl:tracking-normal">
              {t('title')}
            </h1>

            <p className="mt-5 max-w-[38rem] text-[0.925rem] leading-[1.9] text-[#536760] sm:mt-6 sm:text-base sm:leading-[1.95]">
              {t('description')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#164e53]/10 pt-4 text-[10px] font-bold uppercase tracking-[0.11em] text-[#52716b] sm:mt-7 sm:gap-x-5 sm:text-[11px]">
              <span>100% Virgin PP</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-[#0d9488]" />
              <span>Food Grade</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-[#0d9488]" />
              <span>ISO 9001</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                href="/catalog"
                className="group inline-flex min-h-12 items-center gap-3 rounded-md bg-[#164e53] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-12px_rgba(22,78,83,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d7771]"
              >
                {t('cta_primary')}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center rounded-md border border-[#164e53]/15 bg-white/55 px-5 py-3 text-sm font-bold text-[#284740] transition-colors hover:border-[#0d9488]/50 hover:bg-white/80"
              >
                {t('cta_secondary')}
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3 text-[10px] font-bold tracking-[0.13em] text-[#71817d] sm:mt-9">
              <span className="relative h-px w-12 overflow-hidden bg-[#164e53]/15 sm:w-14">
                <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-[#0d9488]" />
              </span>
              <span>{scrollLabel}</span>
              <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#0d9488]" />
            </div>
          </motion.div>

          <div className="relative order-1 mx-auto flex h-[min(46svh,400px)] min-h-[280px] w-full max-w-[720px] items-center justify-center sm:h-[min(72svh,640px)] lg:order-2 lg:h-[min(86svh,780px)]">
            <div
              aria-hidden
              className="absolute inset-x-[4%] inset-y-[3%] rounded-t-[48%] rounded-b-[24px] border border-white/80"
              style={{
                background:
                  'radial-gradient(ellipse 62% 34% at 50% 19%, rgba(255,255,255,0.98), rgba(255,255,255,0.3) 76%, transparent 100%), linear-gradient(155deg, rgba(250,249,243,0.94) 0%, rgba(220,234,224,0.82) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 28px 80px -48px rgba(22,78,83,0.3)',
              }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-[15%] top-[11%] aspect-square rounded-full border border-white/75" />
            <div aria-hidden className="pointer-events-none absolute inset-x-[21%] top-[17%] aspect-square rounded-full border border-[#164e53]/[0.08]" />
            <div aria-hidden className="pointer-events-none absolute inset-x-[14%] bottom-[6%] h-14 rounded-[50%] bg-[#335a4c]/20 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute inset-x-[24%] bottom-[5%] h-5 rounded-[50%] border border-white/70 bg-white/35 shadow-[0_14px_34px_-18px_rgba(22,78,83,0.38)] backdrop-blur-sm" />

            <motion.div
              style={{ rotate: productRotate, y: productY, scale: productScale }}
              className="absolute inset-0"
            >
              <motion.img
                src="/uploads/products/2%20.png"
                alt=""
                aria-hidden="true"
                style={{ opacity: closedOpacity }}
                className="absolute bottom-[2%] left-1/2 h-auto max-h-[90%] w-[min(64%,23svh)] max-w-[400px] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_22px_27px_rgba(25,55,46,0.16)] sm:w-[min(72%,32svh)] sm:max-w-[320px] lg:w-[min(74%,40svh)] lg:max-w-[400px]"
              />
              <motion.img
                src="/uploads/products/1%20.png"
                alt=""
                aria-hidden="true"
                style={{ opacity: openOpacity }}
                className="absolute bottom-[2%] left-1/2 h-auto max-h-[90%] w-[min(64%,23svh)] max-w-[400px] -translate-x-1/2 object-contain object-bottom drop-shadow-[0_22px_27px_rgba(25,55,46,0.16)] sm:w-[min(72%,32svh)] sm:max-w-[320px] lg:w-[min(74%,40svh)] lg:max-w-[400px]"
              />
            </motion.div>

            <div className="absolute start-[4%] top-[10%] z-10 flex items-center gap-2.5 rounded-md border border-white/80 bg-white/65 px-3 py-2 shadow-sm backdrop-blur-sm">
              <span className="text-[9px] font-black tracking-[0.14em] text-[#0d9488]">01</span>
              <span className="h-4 w-px bg-[#164e53]/15" />
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#526c63]">SALMAN SIGNATURE</span>
            </div>

            <div className="absolute end-[7%] top-[10%] z-10 min-w-[82px] rounded-md border border-white/80 bg-white/65 px-3 py-2 text-center shadow-sm backdrop-blur-sm">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.12em] text-[#83928b]">
                {t('spec_capacity')}
              </span>
              <span className="mt-0.5 block text-sm font-black text-[#315d55]">{t('bin_cap')}</span>
              <span className="relative mt-1 block h-3 text-[8px] font-bold tracking-[0.08em] text-[#688077]">
                <motion.span style={{ opacity: closedLabelOpacity }} className="absolute inset-0">
                  {closedLabel}
                </motion.span>
                <motion.span style={{ opacity: openLabelOpacity }} className="absolute inset-0">
                  {openLabel}
                </motion.span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
