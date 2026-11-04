import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import {
  Target, Eye, Heart, ShieldCheck, Recycle, FlaskConical, Truck,
  Sparkles, ArrowRight, CheckCircle, Factory,
} from 'lucide-react';

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
    { n: '35+',   l: isAr ? 'سنوات الخبرة'    : isEn ? 'Years of Craft'   : 'سال تجربه' },
    { n: '500+',  l: isAr ? 'خط إنتاج'         : isEn ? 'Product Lines'    : 'خط محصول' },
    { n: '1200+', l: isAr ? 'عميل راضٍ'        : isEn ? 'Happy Clients'    : 'مشتری راضی' },
    { n: '4',     l: isAr ? 'دول التصدير'      : isEn ? 'Export Countries' : 'کشور صادراتی' },
  ];

  const pillars = [
    { icon: Target, tint: 'bg-brand-gradient',
      t: isAr ? 'مهمتنا'    : isEn ? 'Our Mission' : 'مأموریت ما',
      d: isAr ? 'تصنيع حاويات صناعية تضع معيار المتانة والسلامة والقيمة في المنطقة.'
              : isEn ? 'To manufacture industrial containers that set the benchmark for durability, safety and value across the region.'
              : 'تولید ظروف صنعتی که معیار ماندگاری، ایمنی و ارزش را در منطقه تعیین می‌کنند.' },
    { icon: Eye, tint: 'bg-coral-gradient',
      t: isAr ? 'رؤيتنا'   : isEn ? 'Our Vision' : 'چشم‌انداز ما',
      d: isAr ? 'أن نصبح الاسم الأكثر ثقة في تصنيع البلاستيك، معروفين بالابتكار والجودة التي لا تُساوَم.'
              : isEn ? 'To become the most trusted name in plastic manufacturing, recognized for innovation and uncompromising quality.'
              : 'تبدیل‌شدن به معتبرترین نام در صنعت پلاستیک، شناخته‌شده برای نوآوری و کیفیت بی‌چون‌وچرا.' },
    { icon: Heart, tint: 'bg-brand-gradient',
      t: isAr ? 'قيمنا'    : isEn ? 'Our Values' : 'ارزش‌های ما',
      d: isAr ? 'النزاهة والدقة والاستدامة ترشد كل منتج نصنعه وكل علاقة نبنيها.'
              : isEn ? 'Integrity, precision and sustainability guide every product we make and every relationship we build.'
              : 'صداقت، دقت و پایداری راهنمای هر محصول ما و هر رابطه‌ای است که می‌سازیم.' },
  ];

  const values = [
    { icon: ShieldCheck,
      t: isAr ? 'جودة معتمدة'     : isEn ? 'Certified Quality'   : 'کیفیت گواهی‌شده',
      d: isAr ? 'معتمد بـ ISO 9001 وISIRI والأمم المتحدة.'   : isEn ? 'ISO 9001, ISIRI and UN approvals.'  : 'تأیید ISO 9001، ISIRI و UN.' },
    { icon: Recycle,
      t: isAr ? 'الاستدامة'        : isEn ? 'Sustainability'      : 'پایداری',
      d: isAr ? 'مواد HDPE قابلة للتدوير 100٪.'               : isEn ? '100% recyclable HDPE materials.'   : 'مواد HDPE کاملاً بازیافتی.' },
    { icon: FlaskConical,
      t: isAr ? 'بحث وتطوير داخلي': isEn ? 'In-House R&D'        : 'تحقیق و توسعه',
      d: isAr ? 'مختبر مخصص ومرفق اختبار.'                    : isEn ? 'Dedicated lab and testing facility.' : 'آزمایشگاه و واحد تست اختصاصی.' },
    { icon: Truck,
      t: isAr ? 'تغطية وطنية'     : isEn ? 'Nationwide Reach'    : 'پوشش سراسری',
      d: isAr ? 'التوصيل إلى جميع المحافظات الـ 31.'          : isEn ? 'Delivery to all 31 provinces.'      : 'ارسال به تمام ۳۱ استان.' },
  ];

  const timeline = [
    { y: '1990',
      t: isAr ? 'التأسيس'          : isEn ? 'Founded'          : 'تأسیس',
      d: isAr ? 'بدأنا كورشة صغيرة لإنتاج الحاويات المنزلية.'
              : isEn ? 'Started as a small workshop producing household containers.'
              : 'آغاز به‌عنوان کارگاهی کوچک برای تولید ظروف خانگی.' },
    { y: '2002',
      t: isAr ? 'التوسع الصناعي'   : isEn ? 'Industrial Scale'  : 'مقیاس صنعتی',
      d: isAr ? 'توسعنا إلى مصنع صناعي كامل بخطوط آلية.'
              : isEn ? 'Expanded to a full industrial plant with automated lines.'
              : 'توسعه به کارخانه صنعتی کامل با خطوط اتوماتیک.' },
    { y: '2014',
      t: isAr ? 'الشهادات'         : isEn ? 'Certifications'    : 'گواهینامه‌ها',
      d: isAr ? 'حصلنا على ISO 9001 وموافقة الأمم المتحدة للبضائع الخطرة.'
              : isEn ? 'Achieved ISO 9001 and UN approval for hazardous goods.'
              : 'دریافت ISO 9001 و تأییدیه UN برای کالاهای خطرناک.' },
    { y: '2021',
      t: isAr ? 'الانطلاق العالمي' : isEn ? 'Going Global'      : 'حضور جهانی',
      d: isAr ? 'بدأنا التصدير إلى دول رابطة الدول المستقلة المجاورة.'
              : isEn ? 'Began exporting to neighboring CIS countries.'
              : 'آغاز صادرات به کشورهای همسایه CIS.' },
  ];

  return (
    <div className="overflow-clip">
      {/* Hero */}
      <section className="relative bg-mesh">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -start-16 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl animate-float-slow" />
          <div className="absolute top-20 -end-16 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl animate-float" />
        </div>
        <div className="container mx-auto relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="chip animate-fade-up animate-fill-both">
                <Sparkles className="h-3.5 w-3.5" />
                {isAr ? 'منذ عام 1990' : isEn ? 'Since 1990' : 'از سال ۱۳۶۹'}
              </div>
              <h1 className="display text-display mt-6 animate-fade-up animate-fill-both animate-delay-100">
                {isAr ? <>ثلاثة عقود من<br /><span className="text-gradient">التميز الصناعي</span></>
                      : isEn ? <>Three decades of<br /><span className="text-gradient">industrial mastery</span></>
                      : <>سه دهه<br /><span className="text-gradient">تسلط صنعتی</span></>}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft animate-fade-up animate-fill-both animate-delay-200">
                {isAr
                  ? 'من ورشة متواضعة إلى رائد إقليمي في تصنيع البلاستيك؛ قصتنا مبنية على الحرفية والثقة والهوس بالجودة.'
                  : isEn
                  ? 'From a modest workshop to a regional leader in plastic manufacturing, our story is built on craftsmanship, trust and an obsession with quality.'
                  : 'از یک کارگاه کوچک تا یکی از پیشروان منطقه‌ای صنعت پلاستیک؛ داستان ما بر پایه مهارت، اعتماد  بر کیفیت بنا شده است.'}
              </p>
              <div className="mt-9 flex flex-wrap gap-4 animate-fade-up animate-fill-both animate-delay-300">
                <Link href="/products" className="btn-primary">
                  {isAr ? 'منتجاتنا' : isEn ? 'Our Products' : 'محصولات ما'}
                  <ArrowRight className="h-4 w-4 flip-x" />
                </Link>
                <Link href="/contact" className="btn-ghost">
                  {isAr ? 'تواصل معنا' : isEn ? 'Get in Touch' : 'تماس با ما'}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 animate-scale-in animate-fill-both animate-delay-200">
              <div className="relative">
                <div className="relative rounded-5xl overflow-hidden shadow-lift rotate-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo/006.png"
                    alt={isAr ? 'مصنعنا' : isEn ? 'Our factory' : 'کارخانه ما'}
                    className="h-[480px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -start-6 card p-5 flex items-center gap-3 animate-float">
                  <span className="icon-tile h-11 w-11 bg-brand-gradient"><Factory className="h-5 w-5" /></span>
                  <div className="pe-2">
                    <div className="display text-xl text-ink">12,000 m²</div>
                    <div className="text-[11px] text-ink-muted">
                      {isAr ? 'مساحة الإنتاج' : isEn ? 'Production area' : 'سطح تولید'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ n, l }, i) => (
            <div key={l} className="card p-7 text-center">
              <div className={`mx-auto mb-4 h-1.5 w-12 rounded-full ${i % 2 === 0 ? 'bg-brand-gradient' : 'bg-coral-gradient'}`} />
              <div className="display text-4xl lg:text-5xl text-ink">{n}</div>
              <div className="mt-2 text-sm font-semibold text-ink-muted">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="container mx-auto py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map(({ icon: Icon, tint, t: title, d }) => (
            <div key={title} className="card p-8">
              <span className={`icon-tile h-12 w-12 ${tint}`}><Icon className="h-6 w-6" /></span>
              <h3 className="display text-xl mt-5 text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-5xl overflow-hidden shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/products/1783586901086-03bd84b70c654f48aaf6f76adcf97087.jpg"
              alt={isAr ? 'خط الإنتاج' : isEn ? 'Production line' : 'خط تولید'}
              className="h-[440px] w-full object-cover"
            />
          </div>
          <div>
            <span className="eyebrow">
              <span className="dash" /> {isAr ? 'قصتنا' : isEn ? 'Our Story' : 'داستان ما'}
            </span>
            <h2 className="display text-display-sm mt-4">
              {isAr ? <>مبنية على <span className="text-gradient">الثقة</span>، صقلها الزمن</>
                    : isEn ? <>Built on <span className="text-gradient">trust</span>, refined by time</>
                    : <>ساخته‌شده بر <span className="text-gradient">اعتماد</span>، صیقل‌خورده با زمان</>}
            </h2>
            <p className="mt-5 text-ink-soft leading-relaxed">
              {isAr
                ? 'ما بدأ عام 1990 كورشة عائلية أصبح اليوم أحد أكثر الشركات المصنّعة للبلاستيك ثقةً في المنطقة. كل حاوية تغادر مصنعنا تحمل ثلاثة عقود من الخبرة المتراكمة.'
                : isEn
                ? 'What began in 1990 as a family workshop has grown into one of the region’s most respected plastic manufacturers. Every container that leaves our plant carries three decades of accumulated know-how.'
                : 'آنچه در سال ۱۳۶۹ به‌عنوان یک کارگاه خانوادگی آغاز شد، امروز به یکی از معتبرترین تولیدکنندگان پلاستیک منطقه تبدیل شده است. هر ظرفی که کارخانه ما را ترک می‌کند، حامل سه دهه دانش انباشته است.'}
            </p>
            <ul className="mt-6 space-y-3">
              {[
                isAr ? 'إنتاج متكامل رأسياً'                        : isEn ? 'Vertically integrated production'        : 'تولید یکپارچه و کامل',
                isAr ? 'مواد آمنة للاستخدام الغذائي والكيميائي'    : isEn ? 'Food-grade and chemical-safe materials'   : 'مواد ایمن برای مواد غذایی و شیمیایی',
                isAr ? 'مراقبة جودة مخصصة في كل مرحلة'             : isEn ? 'Dedicated quality-control at every stage' : 'کنترل کیفیت اختصاصی در هر مرحله',
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 text-sm font-semibold text-ink">
                  <CheckCircle className="h-5 w-5 text-brand-500 shrink-0" /> {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow justify-center">
            <span className="dash" /> {isAr ? 'مسيرتنا' : isEn ? 'Our Journey' : 'مسیر ما'} <span className="dash" />
          </span>
          <h2 className="display text-display-sm mt-4">
            {isAr ? 'المراحل التي شكّلتنا' : isEn ? 'Milestones that shaped us' : 'نقاط عطفی که ما را ساختند'}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timeline.map(({ y, t: title, d }, i) => (
            <div key={y} className="card p-7">
              <div className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold text-white ${i % 2 === 0 ? 'bg-brand-gradient' : 'bg-coral-gradient'}`}>{y}</div>
              <h3 className="display text-lg mt-4 text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values strip on brand panel */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-5xl bg-brand-950 px-6 py-14 lg:px-16">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -end-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -start-10 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
            </div>
            <div className="relative">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
                  <span className="inline-block h-px w-10 bg-brand-400" />
                  {isAr ? 'ما يحرّكنا' : isEn ? 'What Drives Us' : 'آنچه ما را پیش می‌برد'}
                </span>
                <h2 className="display text-display-sm mt-4 text-white">
                  {isAr ? 'مبادئ لا نتنازل عنها' : isEn ? 'Principles we never compromise' : 'اصولی که هرگز نادیده نمی‌گیریم'}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map(({ icon: Icon, t: title, d }) => (
                  <div key={title} className="rounded-3xl bg-white/5 border border-white/10 p-6 transition-colors hover:bg-white/10">
                    <span className="icon-tile h-12 w-12 bg-white/10 text-brand-300"><Icon className="h-6 w-6" /></span>
                    <h3 className="display text-base mt-4 text-white">{title}</h3>
                    <p className="mt-2 text-sm text-brand-100/70 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-16 pb-24">
        <div className="relative overflow-hidden rounded-5xl bg-coral-gradient px-6 py-14 lg:px-16 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 start-1/4 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-20 end-1/4 h-60 w-60 rounded-full bg-gold-300/30 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="display text-display-sm text-white max-w-2xl mx-auto">
              {isAr ? 'تريد العمل معنا؟' : isEn ? 'Want to work with us?' : 'مایل به همکاری با ما هستید؟'}
            </h2>
            <p className="mt-4 text-white/85 max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'دعنا نبني شيئاً دائماً معاً. فريقنا مستعد للمساعدة.'
                : isEn
                ? 'Let’s build something durable together. Our team is ready to help.'
                : 'بیایید با هم چیزی ماندگار بسازیم. تیم ما آماده کمک است.'}
            </p>
            <Link href="/contact" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-coral-600 shadow-lift transition-transform hover:-translate-y-1">
              {isAr ? 'تواصل مع فريقنا' : isEn ? 'Contact Our Team' : 'تماس با تیم ما'}
              <ArrowRight className="h-4 w-4 flip-x" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
