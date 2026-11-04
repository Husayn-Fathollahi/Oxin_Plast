'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsCarouselProps {
  isEn: boolean;
  isAr?: boolean;
}

interface Testimonial {
  quoteFa: React.ReactNode;
  quoteEn: React.ReactNode;
  quoteAr: React.ReactNode;
  initialsFa: string;
  initialsEn: string;
  initialsAr: string;
  nameFa: string;
  nameEn: string;
  nameAr: string;
  roleFa: string;
  roleEn: string;
  roleAr: string;
}

const testimonials: Testimonial[] = [
  {
    quoteFa: (
      <>«در طول ۲ سال تأمین سطل‌های پدالی سلمان پلاستیک برای بنکداری‌مان، <span className="text-gradient">حتی یک مورد برگشتی نداشتیم</span>. کیفیت PP و مکانیزم پدال در حد بی‌نظیری است.»</>
    ),
    quoteEn: (
      <>&ldquo;Two years of sourcing Salman Plastic pedal bins for our wholesale business and <span className="text-gradient">not a single return</span>. The PP quality and pedal mechanism are genuinely exceptional.&rdquo;</>
    ),
    quoteAr: (
      <>«عامان من توريد سلال الدواسة من سلمان بلاستيك لمتجرنا بالجملة، و<span className="text-gradient">لم نشهد أي مردود</span>. جودة PP وآلية الدواسة استثنائيتان حقاً.»</>
    ),
    initialsFa: 'ا.ک', initialsEn: 'AK', initialsAr: 'أ.ك',
    nameFa: 'احمد کریمی',       nameEn: 'Ahmad Karimi',    nameAr: 'أحمد كريمي',
    roleFa: 'مدیر خرید، بنکداری آرش — تهران',
    roleEn: 'Purchasing Manager, Arash Wholesale — Tehran',
    roleAr: 'مدير المشتريات، جملة آرش — طهران',
  },
  {
    quoteFa: (
      <>«سطل‌های پدالی <span className="text-gradient">یکدست و بادوام</span> که سه سال است برای تمام شعب فروشگاه‌های زنجیره‌ای‌مان تهیه می‌کنیم. تحویل از درب کارخانه سریع و بدون دردسر است.»</>
    ),
    quoteEn: (
      <>&ldquo;Consistently <span className="text-gradient">durable and uniform</span> — we have been supplying all our chain store branches for three years. Ex-factory delivery is fast and hassle-free.&rdquo;</>
    ),
    quoteAr: (
      <>«متينة ومتجانسة <span className="text-gradient">باستمرار</span> — نزوّد جميع فروعنا منذ ثلاث سنوات. التسليم من المصنع سريع وخالٍ من المتاعب.»</>
    ),
    initialsFa: 'م.ر', initialsEn: 'MR', initialsAr: 'م.ر',
    nameFa: 'مریم رضایی',          nameEn: 'Maryam Rezaei',    nameAr: 'مريم رضائي',
    roleFa: 'مدیر خرید، هایپرمی زنجیره‌ای',
    roleEn: 'Purchasing Manager, HyperMe Retail Chain',
    roleAr: 'مدير المشتريات، سلسلة هايبرمي',
  },
  {
    quoteFa: (
      <>«سبدهای پیک‌نیک ۴ قفله‌ای که برای هتل سفارش دادیم <span className="text-gradient">دقیقاً همان چیزی بود</span> که انتظار داشتیم. ظاهر مرتب، مقاوم، و مهمانان از آن‌ها راضی‌اند.»</>
    ),
    quoteEn: (
      <>&ldquo;The 4-lock picnic baskets we ordered for the hotel were <span className="text-gradient">exactly as expected</span>. Clean look, durable, and guests are very satisfied.&rdquo;</>
    ),
    quoteAr: (
      <>«سلال النزهة ذات الأقفال الأربعة التي طلبناها للفندق كانت <span className="text-gradient">تماماً كما توقعنا</span>. مظهر أنيق ومتين، والضيوف راضون.»</>
    ),
    initialsFa: 'ر.م', initialsEn: 'RM', initialsAr: 'ر.م',
    nameFa: 'رضا محمدی',             nameEn: 'Reza Mohammadi',   nameAr: 'رضا محمدي',
    roleFa: 'مدیر امور عمومی، هتل بین‌المللی',
    roleEn: 'General Affairs Manager, International Hotel',
    roleAr: 'مدير الشؤون العامة، فندق دولي',
  },
  {
    quoteFa: (
      <>«با بسته‌بندی پالتایز صادراتی، محصولات را مستقیم به مشتریان عراقی ارسال کردیم. <span className="text-gradient">کیفیت PP بهداشتی</span> حرف نداشت و هیچ شکایتی از گمرک نداشتیم.»</>
    ),
    quoteEn: (
      <>&ldquo;With export-palletized packaging, we shipped directly to Iraqi customers. The <span className="text-gradient">food-grade PP quality</span> was flawless and customs had zero issues.&rdquo;</>
    ),
    quoteAr: (
      <>«بتغليف منصات التصدير، شحنّا مباشرةً إلى العملاء العراقيين. <span className="text-gradient">جودة PP الصحي</span> كانت ممتازة ولم تواجه الجمارك أي مشكلة.»</>
    ),
    initialsFa: 'س.ا', initialsEn: 'SA', initialsAr: 'س.أ',
    nameFa: 'سارا احمدی',          nameEn: 'Sara Ahmadi',      nameAr: 'سارة أحمدي',
    roleFa: 'مدیر صادرات، گروه تجاری دلتا',
    roleEn: 'Export Manager, Delta Trading Group',
    roleAr: 'مدير التصدير، مجموعة دلتا التجارية',
  },
];

const ROTATE_MS = 4800;

export function TestimonialsCarousel({ isEn, isAr = false }: TestimonialsCarouselProps) {
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, count, active]);

  const current = testimonials[active];

  return (
    <div
      className="mx-auto max-w-3xl text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="eyebrow justify-center">
        <span className="dash" />
        {isAr ? 'أصوات عملائنا' : isEn ? 'Client Voices' : 'صدای مشتریان'}
        <span className="dash" />
      </span>

      <div
        className="relative mt-8 flex min-h-[220px] items-center justify-center sm:min-h-[200px]"
        aria-live="polite"
      >
        <div key={active} className="animate-fade-up animate-fill-both">
          <blockquote className="display text-display-xs leading-snug text-ink">
            {isAr ? current.quoteAr : isEn ? current.quoteEn : current.quoteFa}
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#1E5E63] font-bold text-white">
              {isAr ? current.initialsAr : isEn ? current.initialsEn : current.initialsFa}
            </span>
            <div className="text-start">
              <div className="font-bold text-ink">
                {isAr ? current.nameAr : isEn ? current.nameEn : current.nameFa}
              </div>
              <div className="text-sm text-ink-muted">
                {isAr ? current.roleAr : isEn ? current.roleEn : current.roleFa}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={isAr ? 'الشهادة السابقة' : isEn ? 'Previous' : 'قبلی'}
          className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronLeft className="h-4 w-4 flip-x" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={isAr ? `شهادة ${i + 1}` : isEn ? `Testimonial ${i + 1}` : `نظر ${i + 1}`}
              aria-current={i === active}
              className={
                i === active
                  ? 'h-2 w-6 rounded-sm bg-brand-gradient transition-all duration-300'
                  : 'h-2 w-2 rounded-sm bg-slate-200 transition-all duration-300 hover:bg-brand-300'
              }
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label={isAr ? 'الشهادة التالية' : isEn ? 'Next' : 'بعدی'}
          className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ChevronRight className="h-4 w-4 flip-x" />
        </button>
      </div>
    </div>
  );
}
