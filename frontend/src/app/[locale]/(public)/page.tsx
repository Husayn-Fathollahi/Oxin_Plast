import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { siteConfig } from '@/config/site-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import { ContactSection } from '@/components/sections/ContactSection';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import { prisma } from '@/lib/prisma';
import { categorizeProduct } from '@/constants/product-categories';
import { FeaturedProductImage } from '@/components/products/featured-product-image';
import { formatDate } from '@/lib/utils/formatting';
import {
  ArrowRight, ArrowUpRight, ChevronDown, Plus,
  ShieldCheck, FlaskConical, Truck, Recycle, Layers, Sparkles,
  Droplets, Boxes, Gauge, Building2,
} from 'lucide-react';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const title = t('meta.title');
  const description = t('meta.description');
  return {
    title,
    description,
    alternates: buildAlternates(locale),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title,
      description,
      locale: locale === 'en' ? 'en_US' : 'fa_IR',
    },
    twitter: { ...seoConfig.twitter, title, description },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'home' });
  const tProducts = await getTranslations({ locale, namespace: 'products' });

  // ── Featured products for the "Our Products" section ──────────────────────
  // Show up to 3 products flagged as `isFeatured` in the admin panel.
  const featured = await prisma.product.findMany({
    where: { published: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  // Fallback: if fewer than 3 are featured, fill the remaining slots with the
  // latest published products so the homepage never looks empty/broken.
  let homeProducts = featured;
  if (featured.length < 3) {
    const fillers = await prisma.product.findMany({
      where: { published: true, id: { notIn: featured.map((p: any) => p.id) } },
      orderBy: { createdAt: 'desc' },
      take: 3 - featured.length,
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    homeProducts = [...featured, ...fillers];
  }

  const tints = ['bg-brand-gradient', 'bg-coral-gradient', 'bg-brand-gradient'] as const;
  const cardIcons = [Boxes, Layers, Gauge] as const;

  const featuredCards = homeProducts.map((p: any, i: number) => {
    const primaryImage = p.images.find((img: any) => img.isPrimary) ?? p.images[0] ?? null;
    const categorySlug = categorizeProduct(p.name, p.nameEn, p.slug);
    return {
      slug: p.slug,
      title: isAr
        ? p.nameAr || p.name
        : isEn ? p.nameEn || p.name : p.name,
      desc: isAr
        ? p.excerptAr || p.excerpt
        : isEn ? p.excerptEn || p.excerpt : p.excerpt,
      category: categorySlug
        ? tProducts(`categories.${categorySlug}`)
        : isEn ? 'Products' : isAr ? 'المنتجات' : 'محصولات',
      imageUrl: primaryImage?.url ?? p.image ?? null,
      Icon: cardIcons[i % cardIcons.length],
      tint: tints[i % tints.length],
    };
  });

  return (
    <div className="overflow-clip">

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative bg-mesh">
        {/* grid pattern */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />
        {/* floating color blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -start-24 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl animate-float-slow" />
          <div className="absolute top-40 -end-20 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl animate-float" />
          <div className="absolute bottom-0 start-1/3 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl animate-float-slow" />
        </div>

        <div className="container mx-auto relative pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left copy */}
            <div className="lg:col-span-6">
              <div className="chip animate-fade-up animate-fill-both">
                <Sparkles className="h-3.5 w-3.5" />
                {isAr ? 'مصنّع متخصص في البلاستيك الصناعي منذ 1990' : isEn ? 'Specialized Manufacturer of Industrial Plastics Since 1990' : 'تولیدکننده تخصصی پلاستیک صنعتی از ۱۳۶۹'}
              </div>

              <h1 className="display text-display mt-6 animate-fade-up animate-fill-both animate-delay-100">
                {isAr ? (
                  <>
                    حاويات <span className="text-gradient">بلاستيكية صناعية</span>؛<br />
                    متينة ومطابقة للمعايير
                  </>
                ) : isEn ? (
               <>
                <span className="text-gradient">Industrial Plastic</span> containers;<br />
                 durable and compliant.
                </>
                ) : (
                <>
                    تولید ظروف <span className="text-gradient">پلاستیکی صنعتی</span>؛<br />
                    ماندگار، استاندارد
                </>

                )}
              </h1>

      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
         {isAr
                  ? 'جالونات وحاويات تخزين HDPE عالية الجودة، مصمَّمة لأقسى البيئات الصناعية ومبنية لتدوم لعقود.'
                  : isEn
                  ? 'Premium HDPE jerry cans and storage containers, engineered for the most demanding industrial environments and built to last for decades.'
                : 'گالن‌ها و ظروف ذخیره‌سازی HDPE درجه‌یک، مهندسی‌شده برای سخت‌ترین محیط‌های صنعتی و ساخته‌شده برای دهه‌ها ماندگاری.'}
      </p>


              <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up animate-fill-both animate-delay-300">
                <Link href="/products" className="btn-primary">
                  {isAr ? 'استعرض المنتجات' : isEn ? 'Explore Products' : 'مشاهده محصولات'}
                  <ArrowRight className="h-4 w-4 flip-x" />
                </Link>
                <a
                  href={siteConfig.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  {isAr ? 'تحميل الكاتالوج' : isEn ? 'Download Catalog' : 'دانلود کاتالوگ'}
                </a>
              </div>

              {/* mini trust row */}
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 animate-fade-in animate-fill-both animate-delay-500">
                {[
                 {
      icon: ShieldCheck,
      label: isAr ? 'معتمد ISO 9001' : isEn ? 'ISO 9001 Certified' : 'ایزو ۹۰۰۱'
    },
    {
      icon: Sparkles,
      label: isAr ? '١٠٠٪ مواد بكر' : isEn ? '100% Virgin Materials' : '۱۰۰٪ مواد نو و درجه‌یک'
    },
    {
      icon: Gauge,
      label: isAr ? 'معتمد UN للتعبئة' : isEn ? 'UN Approved Packaging' : 'بر اساس استاندارد های (UN)'
    },
      ].map(({ icon: Icon, label }) => (
      <div key={label} className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
      <Icon className="h-4 w-4 text-brand-500" />
      {label}
    </div>
                ))}
              </div>
            </div>

            {/* Right visual */}
            <div className="lg:col-span-6 animate-scale-in animate-fill-both animate-delay-200">
              <div className="relative">
                {/* glow behind */}
                <div aria-hidden className="absolute -inset-4 rounded-[3rem] bg-brand-gradient opacity-20 blur-2xl" />
                {/* main image card */}
                <div className="ring-gradient relative rounded-5xl overflow-hidden shadow-lift rotate-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo/006.png"
                    alt={isEn ? 'Industrial plastic containers' : 'ظروف پلاستیکی صنعتی'}
                    className="h-[520px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent" />
                </div>

                {/* floating stat card */}
                <div className="absolute -bottom-6 -start-6 card p-5 w-44 animate-float">
                  <div className="display text-3xl text-gradient">35+</div>
                  <div className="text-xs font-semibold text-ink-muted mt-1">
                    {isAr ? 'سنوات من الخبرة' : isEn ? 'Years of expertise' : 'سال تجربه'}
                  </div>
                </div>

                {/* floating badge */}
                <div className="absolute -top-5 -end-3 card p-4 flex items-center gap-3 animate-float-slow">
                  <span className="icon-tile h-10 w-10 bg-coral-gradient">
                    <Droplets className="h-5 w-5" />
                  </span>
                  <div className="pe-2">
                    <div className="text-sm font-bold text-ink">500+</div>
                    <div className="text-[11px] text-ink-muted">{isAr ? 'عميل' : isEn ? 'Clients' : 'مشتری'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* scroll cue */}
          <div className="mt-16 flex justify-center">
            <ChevronDown className="h-5 w-5 text-ink-muted animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============================================================
          LOGO / CERT MARQUEE
          ============================================================ */}
      <section className="border-y border-sand-200 bg-white py-6">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee gap-16 pe-16">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-16">
                {['ISO 9001:2015', 'Food-Grade Raw Materials',  'UN Approved', 'CE Mark', 'REACH', 'FDA Grade'].map((c) => (
                  <span key={c + dup} className="display text-lg text-sand-400 whitespace-nowrap">{c}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS
          ============================================================ */}
      <section className="container mx-auto py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: '35+',   l: isAr ? 'سنوات خبرة'     : isEn ? 'Years Experience' : 'سال تجربه',  g: 'bg-brand-gradient' },
            { n: '500+',  l: isAr ? 'خطوط إنتاج'     : isEn ? 'Product Lines'    : 'خط محصول',   g: 'bg-coral-gradient' },
            { n: '1200+', l: isAr ? 'عميل نشط'       : isEn ? 'Active Clients'   : 'مشتری فعال', g: 'bg-brand-gradient' },
            { n: '31',    l: isAr ? 'محافظة مخدومة'  : isEn ? 'Provinces Served' : 'استان پوشش', g: 'bg-coral-gradient' },
          ].map(({ n, l, g }) => (
            <div key={l} className="card p-7 text-center">
              <div className={`mx-auto mb-4 h-1.5 w-12 rounded-full ${g}`} />
              <div className="display text-4xl lg:text-5xl text-ink">{n}</div>
              <div className="mt-2 text-sm font-semibold text-ink-muted">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          PRODUCTS
          ============================================================ */}
      <section id="products" className="container mx-auto py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow"><span className="dash" /> {isAr ? 'منتجاتنا' : isEn ? 'Our Products' : 'محصولات ما'}</span>
            <h2 className="display text-display-sm mt-4 max-w-xl">
              {isAr ? <>مصمَّمة لتحقيق<br /><span className="text-gradient">التميز الصناعي</span></>
                : isEn ? <>Engineered for<br /><span className="text-gradient">industrial excellence</span></>
                    : <>مهندسی‌شده برای<br /><span className="text-gradient">برتری صنعتی</span></>}
            </h2>
          </div>
          <Link href="/products" className="btn-ghost self-start">
            {isAr ? 'عرض جميع المنتجات' : isEn ? 'View All Products' : 'مشاهده همه'}
            <ArrowUpRight className="h-4 w-4 flip-x" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCards.map(({ slug, Icon, category, title, desc, imageUrl, tint }: any) => (
            <Link key={slug} href={`/products/${slug}`} className="card group overflow-hidden">
              <div className="relative h-56 overflow-hidden bg-sand-100">
                <FeaturedProductImage src={imageUrl} alt={title} />
                <span className={`absolute top-4 start-4 icon-tile h-11 w-11 ${tint} shadow-lift`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{category}</span>
                <h3 className="display text-xl mt-2 text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted line-clamp-3">{desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                  {isAr ? 'عرض التفاصيل' : isEn ? 'View Details' : 'مشاهده جزئیات'}
                  <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          INDUSTRIES WE SERVE
          ============================================================ */}
      <section className="container mx-auto py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow justify-center"><span className="dash" /> {isAr ? 'القطاعات التي نخدمها' : isEn ? 'Industries We Serve' : 'صنایع تحت پوشش'} <span className="dash" /></span>
          <h2 className="display text-display-sm mt-4">
            {isAr ? <>موثوق به في <span className="text-gradient">كل قطاع</span></>
              : isEn ? <>Trusted across <span className="text-gradient">every sector</span></>
                  : <>مورد اعتماد در <span className="text-gradient">هر صنعت</span></>}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: FlaskConical, t: isAr ? 'المواد الكيميائية' : isEn ? 'Chemicals' : 'شیمیایی' },
            { icon: Droplets,     t: isAr ? 'غذاء وزيوت'       : isEn ? 'Food & Oil' : 'غذا و روغن' },
            { icon: Truck,        t: isAr ? 'اللوجستيات'        : isEn ? 'Logistics' : 'حمل‌ونقل' },
            { icon: Building2,    t: isAr ? 'البناء'            : isEn ? 'Construction' : 'ساختمان' },
            { icon: Recycle,      t: isAr ? 'الزراعة'           : isEn ? 'Agriculture' : 'کشاورزی' },
            { icon: Gauge,        t: isAr ? 'البتروكيماويات'    : isEn ? 'Petrochemical' : 'پتروشیمی' },
          ].map(({ icon: Icon, t: label }, i) => (
            <div key={label} className="card p-6 flex flex-col items-center text-center gap-3 group">
              <span className={`icon-tile h-12 w-12 ${i % 2 === 0 ? 'bg-brand-gradient' : 'bg-coral-gradient'} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold text-ink">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          WHY US - feature grid on brand panel
          ============================================================ */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-5xl bg-brand-950 px-6 py-16 lg:px-16 lg:py-20">
            {/* decorative glows */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -end-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
              <div className="absolute -bottom-24 -start-10 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
                  <span className="inline-block h-px w-10 bg-brand-400" /> {isAr ? 'لماذا تختارنا' : isEn ? 'Why Choose Us' : 'چرا ما'}
                </span>
                <h2 className="display text-display-sm mt-4 text-white">
                  {isAr ? <>صناعة دقيقة.<br /><span className="text-brand-300">جودة مضمونة.</span></>
                    : isEn ? <>Precision crafted.<br /><span className="text-brand-300">Lifetime guaranteed.</span></>
                        : <>دقت در ساخت.<br /><span className="text-brand-300">کیفیت تضمین‌شده.</span></>}
                </h2>
                <p className="mt-6 max-w-md text-brand-100/80 leading-relaxed">
                  {isAr ? 'ثلاثة عقود من الخبرة في التصنيع الصناعي؛ حاويات تتجاوز التوقعات.'
                    : isEn ? 'Three decades of industrial manufacturing expertise, delivering containers that outlast expectations.'
                        : 'سه دهه تجربه تولید صنعتی؛ ظروفی که از انتظارات شما فراتر می‌روند.'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck,  t: isAr ? 'جودة معتمدة'     : isEn ? 'Certified Quality'      : 'کیفیت گواهی‌شده', d: isAr ? 'اعتمادات ISO 9001 وISIRI وUN.' : isEn ? 'ISO 9001, ISIRI and UN approvals.' : 'تأیید ISO 9001، ISIRI و UN.' },
                  { icon: FlaskConical, t: isAr ? 'مختبر داخلي'     : isEn ? 'In-House Lab'            : 'آزمایشگاه داخلی', d: isAr ? 'اختبار كل دفعة قبل الشحن.'     : isEn ? 'Every batch tested before dispatch.' : 'آزمایش هر دسته پیش از ارسال.' },
                  { icon: Truck,        t: isAr ? 'توصيل سريع'      : isEn ? 'Nationwide Delivery'     : 'ارسال سراسری',    d: isAr ? 'تغطية جميع مناطق الشحن.'       : isEn ? 'Covering all 31 provinces of Iran.' : 'پوشش تمام ۳۱ استان کشور.' },
                  { icon: Sparkles,     t: isAr ? 'تصنيع مخصص'      : isEn ? 'Custom Manufacturing'    : 'تولید سفارشی',    d: isAr ? 'أحجام وألوان وعلامات تجارية مخصصة.' : isEn ? 'Bespoke sizes, colors and branding.' : 'اندازه، رنگ و برند سفارشی.' },
                ].map(({ icon: Icon, t: title, d }) => (
                  <div key={title} className="rounded-3xl bg-white/5 border border-white/10 p-6 transition-colors hover:bg-white/10">
                    <span className="icon-tile h-12 w-12 bg-white/10 text-brand-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="display text-lg mt-4 text-white">{title}</h3>
                    <p className="mt-2 text-sm text-brand-100/70 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIAL
          ============================================================ */}
      <section className="container mx-auto py-20">
        <TestimonialsCarousel isEn={isEn} isAr={isAr} />
      </section>

      {/* ============================================================
          FAQ
          ============================================================ */}
      <section className="container mx-auto py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow"><span className="dash" /> {isAr ? 'الأسئلة الشائعة' : isEn ? 'Common Questions' : 'سوالات متداول'}</span>
            <h2 className="display text-display-sm mt-4">
              {isAr ? <>الإجابات،<br />قبل أن تسأل.</> : isEn ? <>Answers,<br />before you ask.</> : <>پاسخ‌ها،<br />پیش از پرسش.</>}
            </h2>
            <p className="mt-5 text-ink-muted leading-relaxed">
              {isAr ? 'لم تجد ما تبحث عنه؟ فريقنا على بُعد رسالة.'
                : isEn ? "Can't find what you're looking for? Our team is one message away."
                    : 'پاسخ خود را پیدا نکردید؟ تیم ما یک پیام با شما فاصله دارد.'}
            </p>
            <Link href="/contact" className="btn-primary mt-7">
              {isAr ? 'اتصل بنا' : isEn ? 'Contact Us' : 'تماس با ما'}
              <ArrowRight className="h-4 w-4 flip-x" />
            </Link>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {[
              { q: isAr ? 'ما المواد المستخدمة في جالوناتكم؟'
                  : isEn ? 'What materials are used in your jerry cans?' : 'گالن‌های شما از چه موادی ساخته شده‌اند؟',
                a: isAr ? 'نستخدم HDPE من الدرجة الأولى — آمن للغذاء، مقاوم للمواد الكيميائية ومستقر ضد الأشعة فوق البنفسجية.'
                  : isEn ? 'We use HDPE grade 1 - food-safe, chemical-resistant and UV-stabilized for outdoor use.'
                        : 'از HDPE درجه یک استفاده می‌کنیم؛ ایمن برای مواد غذایی، مقاوم در برابر مواد شیمیایی و UV-پایدار.' },
              { q: isAr ? 'ما هو الحد الأدنى لكمية الطلب؟'
                  : isEn ? 'What is the minimum order quantity?' : 'حداقل تعداد سفارش چقدر است؟',
                a: isAr ? 'المنتجات القياسية تبدأ من 200 وحدة. الطلبات ذات العلامة التجارية الخاصة تتطلب 500 وحدة كحد أدنى.'
                  : isEn ? 'Standard products start at 200 units. Custom-branded orders require a minimum of 500 units.'
                        : 'محصولات استاندارد از ۲۰۰ عدد و سفارشات برند‌شده از ۵۰۰ عدد آغاز می‌شوند.' },
              { q: isAr ? 'هل تقدمون أحجاماً وألواناً مخصصة؟'
                  : isEn ? 'Do you offer custom sizing and colors?' : 'اندازه و رنگ سفارشی دارید؟',
                a: isAr ? 'نعم — نصنع من 1 لتر إلى 220 لتراً بالألوان الكاملة لبنتون مع ملصقات مخصصة.'
                  : isEn ? 'Yes - we manufacture from 1L to 220L in the full Pantone palette with custom labeling.'
                        : 'بله؛ از ۱ تا ۲۲۰ لیتر در طیف کامل پانتون با لیبل سفارشی تولید می‌کنیم.' },
              { q: isAr ? 'ما هو الإطار الزمني للتسليم؟'
                  : isEn ? 'What is the delivery timeframe?' : 'زمان تحویل چقدر است؟',
                a: isAr ? 'الطلبات القياسية تُشحن خلال 5 إلى 7 أيام عمل. الطلبات المخصصة تحتاج 15 إلى 25 يوماً.'
                  : isEn ? 'Standard orders ship within 5 to 7 business days. Custom orders require 15 to 25 days.'
                        : 'سفارشات استاندارد ۵ تا ۷ روز کاری و سفارشات سفارشی ۱۵ تا ۲۵ روز.' },
              { q: isAr ? 'هل تصدّرون دولياً؟'
                  : isEn ? 'Do you export internationally?' : 'صادرات بین‌المللی دارید؟',
                a: isAr ? 'نعم. منتجاتنا حاصلة على اعتماد UN — نشحن حالياً إلى العراق وأفغانستان وأذربيجان ودول رابطة الدول المستقلة.'
                  : isEn ? 'Yes. Our products hold UN approval - currently shipping to Iraq, Afghanistan, Azerbaijan and CIS countries.'
                        : 'بله؛ محصولات ما تأییدیه UN دارند و به عراق، افغانستان، آذربایجان و کشورهای CIS ارسال می‌شوند.' },
            ].map(({ q, a }) => (
              <details key={q} className="faq-details card p-6 group">
                <summary className="flex items-center justify-between gap-6">
                  <span className="faq-q display text-base text-ink transition-colors">{q}</span>
                  <span className="icon-tile h-9 w-9 shrink-0 bg-brand-50 text-brand-600">
                    <Plus className="faq-icon h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA BANNER
          ============================================================ */}
      <section className="container mx-auto py-20">
        <div className="relative overflow-hidden rounded-5xl bg-coral-gradient px-6 py-16 lg:px-16 lg:py-20 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 start-1/4 h-60 w-60 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-20 end-1/4 h-60 w-60 rounded-full bg-gold-300/30 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="display text-display-sm text-white max-w-2xl mx-auto">
              {isAr ? 'هل أنت مستعد للطلب؟ دعنا ننفذه لك.'
                : isEn ? 'Ready to order? Let us build it for you.' : 'آماده سفارش هستید؟ بسپارید به ما.'}
            </h2>
            <p className="mt-5 text-white/85 max-w-xl mx-auto leading-relaxed">
              {isAr ? 'احصل على عرض سعر مجاني خلال 24 ساعة. فريق المبيعات لدينا جاهز.'
                : isEn ? 'Receive a free quote within 24 hours. Our sales team is standing by.'
                    : 'در کمتر از ۲۴ ساعت قیمت  دریافت کنید. تیم فروش ما آماده است.'}
            </p>
            <Link href="/contact" className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-coral-600 shadow-lift transition-transform hover:-translate-y-1">
              {isAr ? 'احصل على عرض سعر مجاني' : isEn ? 'Get a Free Quote' : 'دریافت قیمت '}
              <ArrowRight className="h-4 w-4 flip-x" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          LATEST ARTICLES
          ============================================================ */}
      <LatestArticles locale={locale} isEn={isEn} isAr={isAr} t={t} />

      {/* ============================================================
          CONTACT
          ============================================================ */}
      <ContactSection />
    </div>
  );
}

async function LatestArticles({
  locale,
  isEn,
  isAr,
  t,
}: {
  locale: string;
  isEn: boolean;
  isAr: boolean;
  t: Awaited<ReturnType<typeof getTranslations<'home'>>>;
}) {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      slug: true,
      title: true,
      titleEn: true,
      titleAr: true,
      excerpt: true,
      excerptEn: true,
      excerptAr: true,
      image: true,
      createdAt: true,
    },
  });

  if (articles.length === 0) return null;

  return (
    <section className="container mx-auto py-20">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
        <div>
          <span className="eyebrow"><span className="dash" /> {isAr ? 'المعرفة' : isEn ? 'Knowledge' : 'دانش‌نامه'}</span>
          <h2 className="display text-display-sm mt-4">{t('latestBlog.title')}</h2>
        </div>
        <Link href="/blog" className="btn-ghost self-start">
          {isAr ? 'جميع المقالات' : isEn ? 'All Articles' : 'همه مقالات'}
          <ArrowUpRight className="h-4 w-4 flip-x" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a: any) => {
          const title   = isAr ? (a.titleAr   || a.title)   : isEn ? (a.titleEn   || a.title)   : a.title;
          const excerpt = isAr ? (a.excerptAr || a.excerpt) : isEn ? (a.excerptEn || a.excerpt) : a.excerpt;
          return (
            <Link key={a.slug} href={`/blog/${a.slug}` as '/'} className="card group overflow-hidden">
              <div className="relative h-48 overflow-hidden bg-sand-100">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image} alt={title}
                       className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full bg-mesh" />
                )}
              </div>
              <div className="p-6">
                <time dateTime={a.createdAt.toISOString()} className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {formatDate(a.createdAt.toISOString(), locale)}
                </time>
                <h3 className="display text-lg mt-2 text-ink line-clamp-2">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted line-clamp-2">{excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                  {isAr ? 'اقرأ المزيد' : isEn ? 'Read More' : 'ادامه مطلب'}
                  <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
