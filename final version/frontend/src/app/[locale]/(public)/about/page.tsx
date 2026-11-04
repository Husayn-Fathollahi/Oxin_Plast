import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import {
  ShieldCheck, Recycle, FlaskConical, Truck,
  ArrowRight, CheckCircle,
} from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'common' });
  const title = t('about.meta.title');
  const description = t('about.meta.description');
  return {
    title,
    description,
    alternates: buildAlternates(locale, 'about'),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title,
      description,
      locale: isAr ? 'ar_SA' : isEn ? 'en_US' : 'fa_IR',
    },
    twitter: { ...seoConfig.twitter, title, description },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';

  const stats = [
    { n: '35+', l: isAr ? 'سنوات الخبرة' : isEn ? 'Years of Craft' : 'سال تجربه' },
    { n: '50+', l: isAr ? 'موديل منتج' : isEn ? 'Product Models' : 'مدل محصول' },
    { n: '100%', l: isAr ? 'PP غذائي' : isEn ? 'Virgin PP' : 'PP بکر' },
    { n: '31', l: isAr ? 'محافظة' : isEn ? 'Provinces' : 'استان پوشش' },
  ];

  const pillars = [
    {
      img: '/images/3d/3d-tile-quality.jpg',
      t: isAr ? 'مهمتنا' : isEn ? 'Our Mission' : 'مأموریت ما',
      d: isAr
        ? 'تصنيع منتجات بلاستيكية متينة وآمنة للطلب بالجملة.'
        : isEn
          ? 'Manufacture durable, food-safe plastics for wholesale demand.'
          : 'تولید محصولات پلاستیکی بادوام و بهداشتی برای تقاضای عمده.',
    },
    {
      img: '/images/3d/3d-factory-pallets.jpg',
      t: isAr ? 'رؤيتنا' : isEn ? 'Our Vision' : 'چشم‌انداز ما',
      d: isAr
        ? 'أن نكون الاسم الأكثر ثقة في سلال الدواسة وسلال النزهة.'
        : isEn
          ? 'Become the most trusted name in pedal bins and picnic baskets.'
          : 'تبدیل‌شدن به معتبرترین نام در سطل پدالی و سبد پیک‌نیک.',
    },
    {
      img: '/images/3d/3d-pedal-bin.jpg',
      t: isAr ? 'قيمنا' : isEn ? 'Our Values' : 'ارزش‌های ما',
      d: isAr
        ? 'الدقة والجودة والاستمرارية في كل شحنة مصنع.'
        : isEn
          ? 'Precision, quality and consistency in every factory shipment.'
          : 'دقت، کیفیت و ثبات در هر محموله کارخانه.',
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      t: isAr ? 'جودة معتمدة' : isEn ? 'Certified Quality' : 'کیفیت گواهی‌شده',
      d: isAr ? 'مواد PP غذائية ومراقبة دفعات الإنتاج.' : isEn ? 'Food-grade PP with batch quality control.' : 'PP بهداشتی با کنترل کیفی هر محموله.',
    },
    {
      icon: Recycle,
      t: isAr ? 'مواد قابلة للتدوير' : isEn ? 'Recyclable Material' : 'مواد قابل بازیافت',
      d: isAr ? 'بوليمرات قابلة لإعادة التدوير للأسواق الحديثة.' : isEn ? 'Recyclable polymers for modern markets.' : 'پلیمرهای قابل بازیافت برای بازارهای مدرن.',
    },
    {
      icon: FlaskConical,
      t: isAr ? 'اختبار داخلي' : isEn ? 'In-House Testing' : 'آزمون داخلی',
      d: isAr ? 'فحص اللون والمتانة قبل الشحن.' : isEn ? 'Colour and durability checks before dispatch.' : 'بررسی رنگ و دوام پیش از ارسال.',
    },
    {
      icon: Truck,
      t: isAr ? 'تسليم من المصنع' : isEn ? 'Ex-Factory Delivery' : 'تحویل از کارخانه',
      d: isAr ? 'تغليف منصات جاهز للتصدير والتوزيع.' : isEn ? 'Palletized packaging ready for export.' : 'بسته‌بندی پالتایز آماده صادرات و توزیع.',
    },
  ];

  const timeline = [
    {
      y: '1990',
      t: isAr ? 'التأسيس' : isEn ? 'Founded' : 'تأسیس',
      d: isAr ? 'ورشة عائلية لإنتاج الحاويات المنزلية.' : isEn ? 'Family workshop for household containers.' : 'کارگاه خانوادگی تولید ظروف خانگی.',
    },
    {
      y: '2002',
      t: isAr ? 'التوسع الصناعي' : isEn ? 'Industrial Scale' : 'مقیاس صنعتی',
      d: isAr ? 'خطوط إنتاج آلية وسعة أعلى.' : isEn ? 'Automated lines and higher capacity.' : 'خطوط اتوماتیک و ظرفیت بالاتر.',
    },
    {
      y: '2014',
      t: isAr ? 'معايير الجودة' : isEn ? 'Quality Standards' : 'استاندارد کیفیت',
      d: isAr ? 'تعزيز مراقبة الجودة ودرجة الغذاء.' : isEn ? 'Stronger QC and food-grade focus.' : 'تقویت کنترل کیفی و تمرکز Food Grade.',
    },
    {
      y: '2021',
      t: isAr ? 'التصدير' : isEn ? 'Export Growth' : 'رشد صادرات',
      d: isAr ? 'شحنات إقليمية بأسواق مجاورة.' : isEn ? 'Regional shipments to nearby markets.' : 'ارسال منطقه‌ای به بازارهای همسایه.',
    },
  ];

  return (
    <div className="overflow-clip bg-[#F8FAFC]">
      <PageHero
        eyebrow={isAr ? 'منذ عام 1990' : isEn ? 'Since 1990' : 'از سال ۱۳۶۹'}
        title={
          isAr
            ? 'ثلاثة عقود من التميز الصناعي'
            : isEn
              ? 'Three decades of industrial mastery'
              : 'سه دهه تسلط صنعتی'
        }
        description={
          isAr
            ? 'من ورشة متواضعة إلى مصنع موثوق لسلال الدواسة وسلال النزهة.'
            : isEn
              ? 'From a modest workshop to a trusted pedal-bin and picnic-basket factory.'
              : 'از کارگاهی کوچک تا کارخانه معتبر سطل پدالی و سبد پیک‌نیک.'
        }
        imageSrc="/images/3d/3d-factory-pallets.jpg"
      />

      <section className="container mx-auto px-5 py-10 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-3xl bg-[#164E53] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0D9488]"
          >
            {isAr ? 'منتجاتنا' : isEn ? 'Our Products' : 'محصولات ما'}
            <ArrowRight className="h-4 w-4 flip-x" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0F172A] transition-colors hover:border-teal-500/50"
          >
            {isAr ? 'تواصل معنا' : isEn ? 'Get in Touch' : 'تماس با ما'}
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-5 pb-16 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ n, l }) => (
            <div
              key={l}
              className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#0D9488]" />
              <div className="text-4xl font-black tabular-nums text-[#0F172A] lg:text-5xl">{n}</div>
              <div className="mt-2 text-sm font-semibold text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ img, t: title, d }) => (
            <div
              key={title}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-teal-500/40 hover:shadow-md"
            >
              <div className="relative aspect-[16/10]">
                <Image src={img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="border-t border-slate-100 p-6">
                <h3 className="text-xl font-black text-[#0F172A]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-5 py-14 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <Image
              src="/images/3d/3d-quality-pp.jpg"
              alt={isAr ? 'خط الإنتاج' : isEn ? 'Production quality' : 'کیفیت تولید'}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="mb-4 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
              <span className="h-px w-8 bg-[#0D9488]" />
              {isAr ? 'قصتنا' : isEn ? 'Our Story' : 'داستان ما'}
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#0F172A] lg:text-4xl">
              {isAr
                ? 'مبنية على الثقة، صقلها الزمن'
                : isEn
                  ? 'Built on trust, refined by time'
                  : 'ساخته‌شده بر اعتماد، صیقل‌خورده با زمان'}
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              {isAr
                ? 'ما بدأ كورشة عائلية أصبح مصنعاً موثوقاً لسلال الدواسة وسلال النزهة بجودة PP غذائية.'
                : isEn
                  ? 'What began as a family workshop is now a trusted factory for pedal bins and picnic baskets in food-grade PP.'
                  : 'آنچه کارگاهی خانوادگی بود، امروز کارخانه‌ای معتبر برای سطل پدالی و سبد پیک‌نیک با PP بهداشتی است.'}
            </p>
            <ul className="mt-6 space-y-3">
              {[
                isAr ? 'إنتاج متكامل من المواد إلى التعبئة' : isEn ? 'Integrated production from resin to packing' : 'تولید یکپارچه از مواد تا بسته‌بندی',
                isAr ? 'مواد آمنة غذائياً' : isEn ? 'Food-contact safe materials' : 'مواد ایمن برای تماس غذایی',
                isAr ? 'مراقبة جودة قبل كل شحنة' : isEn ? 'Quality checks before every shipment' : 'کنترل کیفیت پیش از هر محموله',
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 text-sm font-semibold text-[#0F172A]">
                  <CheckCircle className="h-5 w-5 shrink-0 text-[#0D9488]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 py-14 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
            <span className="h-px w-8 bg-[#0D9488]" />
            {isAr ? 'مسيرتنا' : isEn ? 'Our Journey' : 'مسیر ما'}
            <span className="h-px w-8 bg-[#0D9488]" />
          </span>
          <h2 className="mt-4 text-3xl font-black text-[#0F172A]">
            {isAr ? 'المراحل التي شكّلتنا' : isEn ? 'Milestones that shaped us' : 'نقاط عطفی که ما را ساختند'}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {timeline.map(({ y, t: title, d }) => (
            <div key={y} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="inline-flex items-center rounded-xl bg-[#164E53] px-3.5 py-1.5 text-sm font-bold text-white">
                {y}
              </div>
              <h3 className="mt-4 text-lg font-black text-[#0F172A]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="container mx-auto overflow-hidden rounded-3xl border border-[#134E4A] bg-[#164E53]">
          <div className="px-6 py-14 lg:px-14">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-200">
                {isAr ? 'ما يحرّكنا' : isEn ? 'What Drives Us' : 'آنچه ما را پیش می‌برد'}
              </span>
              <h2 className="mt-4 text-3xl font-black text-white">
                {isAr ? 'مبادئ لا نتنازل عنها' : isEn ? 'Principles we never compromise' : 'اصولی که نادیده نمی‌گیریم'}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(({ icon: Icon, t: title, d }) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/15 bg-white/5 p-6 transition-colors hover:bg-white/10"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CCFBF1]/15 text-teal-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-teal-100/75">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 py-14 pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800">
          <div className="absolute inset-0">
            <Image src="/images/3d/3d-factory-pallets.jpg" alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-[#061216]/78" />
          </div>
          <div className="relative px-6 py-14 text-center lg:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-black text-white">
              {isAr ? 'تريد العمل معنا؟' : isEn ? 'Want to work with us?' : 'مایل به همکاری با ما هستید؟'}
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-200/85">
              {isAr
                ? 'فريق المبيعات جاهز لعرض أسعار الجملة خلال 24 ساعة.'
                : isEn
                  ? 'Sales is ready with wholesale quotes within 24 hours.'
                  : 'تیم فروش آماده استعلام عمده در کمتر از ۲۴ ساعت است.'}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-3xl bg-[#0D9488] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-500"
            >
              {isAr ? 'تواصل مع فريقنا' : isEn ? 'Contact Our Team' : 'تماس با تیم ما'}
              <ArrowRight className="h-4 w-4 flip-x" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
