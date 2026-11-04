import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import HeroSection from '../components/HeroSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { prisma } from '@/lib/prisma';
import { categorizeProduct } from '@/constants/product-categories';
import { FeaturedProductImage } from '@/components/products/featured-product-image';
import { formatDate } from '@/lib/utils/formatting';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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

  const featured = await prisma.product.findMany({
    where: { published: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

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

  const featuredCards = homeProducts.map((p: any) => {
    const primaryImage = p.images.find((img: any) => img.isPrimary) ?? p.images[0] ?? null;
    const categorySlug = categorizeProduct(p.name, p.nameEn, p.slug);
    return {
      slug: p.slug,
      title: isAr ? p.nameAr || p.name : isEn ? p.nameEn || p.name : p.name,
      desc:  isAr ? p.excerptAr || p.excerpt : isEn ? p.excerptEn || p.excerpt : p.excerpt,
      category: categorySlug
        ? tProducts(`categories.${categorySlug}`)
        : isEn ? 'Products' : isAr ? 'المنتجات' : 'محصولات',
      imageUrl: primaryImage?.url ?? p.image ?? null,
    };
  });

  const families = [
    {
      href: '/products',
      img: '/images/3d/3d-pedal-bin.jpg',
      fa: 'سطل‌های پدالی',
      en: 'Pedal Bins',
      ar: 'سلال الدواسة',
      spec: '20–60 L · Soft-Close',
    },
    {
      href: '/products',
      img: '/images/3d/3d-picnic-basket.jpg',
      fa: 'سبد پیک‌نیک ۴ قفل',
      en: '4-Lock Picnic Baskets',
      ar: 'سلال نزهة 4 أقفال',
      spec: '12–45 L · UV Stable',
    },
  ] as const;

  // ── FAQ items (server-side, passed to client accordion) ──────────────────
  const faqItems = [
    {
      q: isAr ? 'ما المواد المستخدمة في سلال الدواسة؟'
        : isEn ? 'What materials are used in the pedal bins?'
              : 'سطل‌های پدالی از چه موادی ساخته شده‌اند؟',
      a: isAr ? 'نستخدم بولي بروبيلين (PP) بكراً بنسبة 100٪ بجودة Food Grade — مقاوم للصدمات والرطوبة ومعتمد للبيئات الغذائية.'
        : isEn ? 'We use 100% virgin polypropylene (PP) Food Grade — impact-resistant, moisture-proof and approved for food-contact environments.'
              : 'از پلی‌پروپیلن (PP) ۱۰۰٪ بکر و بهداشتی (Food Grade) استفاده می‌کنیم؛ مقاوم در برابر ضربه، رطوبت و مواد شیمیایی، با تأییدیه ایمنی مواد غذایی.',
    },
    {
      q: isAr ? 'ما هو الحد الأدنى لكمية الطلب؟'
        : isEn ? 'What is the minimum order quantity?'
              : 'حداقل تعداد سفارش چقدر است؟',
      a: isAr ? 'سلال الدواسة من 100 وحدة، وسلال النزهة من 50 وحدة. الطلبات بألوان أو شعارات مخصصة تتطلب 200 وحدة كحد أدنى.'
        : isEn ? 'Pedal bins from 100 units, picnic baskets from 50 units. Custom colour or branded orders require a minimum of 200 units.'
              : 'سطل‌های پدالی از ۱۰۰ عدد، سبدهای پیک‌نیک از ۵۰ عدد. سفارشات با رنگ یا لوگوی اختصاصی از ۲۰۰ عدد.',
    },
    {
      q: isAr ? 'هل تقدمون ألواناً وأحجاماً مخصصة؟'
        : isEn ? 'Do you offer custom colors and sizes?'
              : 'آیا رنگ و سایز سفارشی دارید؟',
      a: isAr ? 'نعم. سلال الدواسة بأحجام 20 و30 و45 و60 لتراً؛ سلال النزهة بأحجام 12 و24 و45 لتراً. لوح ألوان كامل بمادة PP البكر.'
        : isEn ? 'Yes. Pedal bins in 20, 30, 45 and 60 L; picnic baskets in 12, 24 and 45 L. Full colour palette in virgin PP.'
              : 'بله؛ سطل‌های پدالی در سایزهای ۲۰، ۳۰، ۴۵ و ۶۰ لیتر و سبدهای پیک‌نیک در ۱۲، ۲۴ و ۴۵ لیتر با پالت رنگی کامل.',
    },
    {
      q: isAr ? 'ما هو وقت التسليم؟'
        : isEn ? 'What is the lead time?'
              : 'زمان تحویل چقدر است؟',
      a: isAr ? 'المنتجات المتاحة في المخزون تُسلَّم فوراً من المصنع. الطلبات المخصصة تستغرق من 15 إلى 25 يوم عمل.'
        : isEn ? 'Stock items are available for immediate ex-factory collection. Custom orders take 15–25 business days.'
              : 'محصولات موجودی از درب کارخانه تحویل داده می‌شوند. سفارشات رنگ یا سایز اختصاصی ۱۵ تا ۲۵ روز کاری.',
    },
    {
      q: isAr ? 'هل تصدّرون دولياً؟'
        : isEn ? 'Do you export internationally?'
              : 'آیا به بازارهای خارجی صادرات دارید؟',
      a: isAr ? 'نعم. نصدّر بتغليف منصات إلى العراق وأفغانستان وأذربيجان ودول رابطة الدول المستقلة. نوفر وثائق جمركية كاملة.'
        : isEn ? 'Yes. We export with palletized packaging to Iraq, Afghanistan, Azerbaijan and CIS countries with full customs documentation.'
              : 'بله؛ با بسته‌بندی پالتایز صادراتی به عراق، افغانستان، آذربایجان و کشورهای CIS با مدارک گمرکی کامل ارسال می‌کنیم.',
    },
  ];

  // ── Product category quick-select chips ──────────────────────────────────
  const productCategories = isAr
    ? [{ label: 'الكل' }, { label: 'سلال الدواسة' }, { label: 'سلال النزهة' }, { label: 'مخصص' }]
    : isEn
      ? [{ label: 'All' }, { label: 'Pedal Bins' }, { label: 'Picnic Baskets' }, { label: 'Custom' }]
      : [{ label: 'همه' }, { label: 'سطل پدالی' }, { label: 'سبد پیک‌نیک' }, { label: 'سفارشی' }];

  // ── Trust marquee — language-aware ───────────────────────────────────────
  const trustItems = isAr
    ? ['PP بكر 100٪', 'Food Grade', 'مواد خام درجة أولى', 'تغليف التصدير', 'تسليم من المصنع', 'ضمان الجودة']
    : isEn
      ? ['100% Virgin PP', 'Food Grade', 'Premium Raw Material', 'Export Palletized', 'Ex-Factory Delivery', 'Quality Assured']
      : ['PP ۱۰۰٪ بهداشتی', 'Food Grade', 'تولید از مواد اولیه درجه یک', 'بسته‌بندی پالتایز صادراتی', 'تحویل از درب کارخانه', 'ضمانت کیفیت'];

  return (
    <div className="overflow-clip">
      <HeroSection />

      {/* ============================================================
          TRUST MARQUEE — language-aware items + diamond separators
          ============================================================ */}
      <section className="border-y border-slate-200 bg-white py-5">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee items-center">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center">
                {trustItems.flatMap((c, i) => [
                  <span
                    key={`t-${dup}-${i}`}
                    className="whitespace-nowrap px-8 text-sm font-bold uppercase tracking-wider text-slate-400"
                  >
                    {c}
                  </span>,
                  <span
                    key={`s-${dup}-${i}`}
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-sm bg-teal-200"
                  />,
                ])}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS — flat industrial strip, no white-card boxes
          ============================================================ */}
      <ScrollReveal>
        <section className="border-b border-slate-100">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 gap-px bg-slate-100 lg:grid-cols-4">
              {[
                { n: '۲۰+',  l: isAr ? 'سنوات خبرة'    : isEn ? 'Years Experience' : 'سال تجربه',   a: 'bg-[#0D9488]' },
                { n: '۵۰+',  l: isAr ? 'موديل منتج'    : isEn ? 'Product Models'   : 'مدل محصول',   a: 'bg-[#164E53]' },
                { n: '۱۰۰٪', l: isAr ? 'PP بهداشتي'    : isEn ? 'PP Food Grade'    : 'PP بهداشتی',  a: 'bg-[#0D9488]' },
                { n: '۳۱',   l: isAr ? 'محافظة مخدومة' : isEn ? 'Provinces Served' : 'استان پوشش',  a: 'bg-[#164E53]' },
              ].map(({ n, l, a }) => (
                <div key={l} className="flex flex-col gap-3 bg-white px-8 py-12">
                  <div className={`h-0.5 w-12 ${a}`} />
                  <div className="text-5xl font-black tabular-nums text-[#0F172A] lg:text-6xl">{n}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Product families — 3D visual anchors */}
      <ScrollReveal>
        <section className="container mx-auto px-5 py-16 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow"><span className="dash" />{isAr ? 'عائلات المنتج' : isEn ? 'Product Families' : 'خانواده‌های محصول'}</span>
              <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-[#0F172A] lg:text-4xl">
                {isAr ? 'صمّمت للطلب بالجملة' : isEn ? 'Built for wholesale volume' : 'طراحی‌شده برای تیراژ عمده'}
              </h2>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {families.map((f) => (
              <Link
                key={f.img}
                href={f.href}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-[#0F172A] shadow-sm transition-all duration-300 hover:border-teal-400/40 hover:shadow-md"
              >
                <div className="relative aspect-[16/11]">
                  <Image src={f.img} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061216] via-[#061216]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-200/80">{f.spec}</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{isAr ? f.ar : isEn ? f.en : f.fa}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-200">
                      {isAr ? 'استكشف' : isEn ? 'Explore' : 'مشاهده'}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Featured products */}
      <ScrollReveal>
        <section id="products" className="container mx-auto px-5 py-16 lg:px-8 lg:py-20">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">
                <span className="dash" />
                {isAr ? 'منتجاتنا' : isEn ? 'Our Products' : 'محصولات ما'}
              </span>
              <h2 className="display text-display-sm mt-4 max-w-xl">
                {isAr
                  ? <><span className="text-gradient">سلال صُمِّمت</span> لتدوم</>
                  : isEn
                    ? <>Engineered for <span className="text-gradient">lasting quality</span></>
                    : <>محصولاتی که <span className="text-gradient">ماندگار هستند</span></>}
              </h2>
            </div>
            <Link href="/products" className="btn-ghost self-start">
              {isAr ? 'عرض جميع المنتجات' : isEn ? 'View All Products' : 'مشاهده همه'}
              <ArrowUpRight className="h-4 w-4 flip-x" />
            </Link>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {productCategories.map(({ label }, i) => (
              <Link
                key={label}
                href="/products"
                className={`inline-flex items-center rounded-3xl px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  i === 0
                    ? 'bg-[#1E5E63] text-white'
                    : 'border border-slate-200 bg-white text-slate-500 hover:border-teal-400 hover:text-[#1E5E63]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCards.map(({ slug, category, title, desc, imageUrl }: any, idx: number) => (
              <Link
                key={slug}
                href={`/products/${slug}`}
                className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-teal-500/50 hover:shadow-md ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`relative overflow-hidden bg-slate-50 ${idx === 0 ? 'h-64' : 'h-52'}`}>
                  <FeaturedProductImage src={imageUrl} alt={title} />
                </div>
                <div className="border-t border-slate-100 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">{category}</span>
                  <h3 className="mt-2 text-xl font-black tracking-tight text-[#0F172A]">{title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0D9488]">
                    {isAr ? 'عرض التفاصيل' : isEn ? 'View Details' : 'مشاهده جزئیات'}
                    <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="container mx-auto px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow justify-center">
              <span className="dash" />
              {isAr ? 'عملاؤنا التجاريون' : isEn ? 'B2B Customers' : 'مشتریان تجاری ما'}
              <span className="dash" />
            </span>
            <h2 className="display text-display-sm mt-4">
              {isAr
                ? <><span className="text-gradient">من يثق</span> بنا</>
                : isEn
                  ? <>Who <span className="text-gradient">trusts us</span></>
                  : <>چه کسانی به ما <span className="text-gradient">اعتماد دارند</span></>}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
            {[
              { img: '/images/3d/3d-tile-wholesale.jpg', fa: 'بنکداران', en: 'Wholesalers', ar: 'تجار الجملة' },
              { img: '/images/3d/3d-tile-retail.jpg', fa: 'فروشگاه‌های زنجیره‌ای', en: 'Retail Chains', ar: 'سلاسل البيع' },
              { img: '/images/3d/3d-tile-delivery.jpg', fa: 'صادرکنندگان', en: 'Exporters', ar: 'المصدّرون' },
              { img: '/images/3d/3d-picnic-basket.jpg', fa: 'هتل و رستوران', en: 'Hotels & F&B', ar: 'الفنادق والمطاعم' },
              { img: '/images/3d/3d-tile-quality.jpg', fa: 'بیمارستان و کلینیک', en: 'Hospitals & Clinics', ar: 'المستشفيات' },
              { img: '/images/3d/3d-pedal-bin.jpg', fa: 'ادارات و شرکت‌ها', en: 'Offices & Corps', ar: 'المكاتب والشركات' },
            ].map(({ img, fa, en, ar }) => (
              <div
                key={fa}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image src={img} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 33vw" />
                </div>
                <div className="border-t border-slate-100 px-4 py-4 text-center">
                  <span className="text-sm font-bold text-[#0F172A]">{isAr ? ar : isEn ? en : fa}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="px-5 py-16 lg:px-8 lg:py-20">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0C2628]">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[280px] lg:min-h-full">
                  <Image
                    src="/images/3d/3d-quality-pp.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#0C2628] via-[#0C2628]/40 to-transparent lg:bg-gradient-to-t" />
                </div>
                <div className="relative px-6 py-12 lg:px-12 lg:py-16">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-400">
                    <span className="inline-block h-px w-8 bg-teal-600" />
                    {isAr ? 'لماذا تختارنا' : isEn ? 'Why Choose Us' : 'چرا سلمان پلاستیک'}
                  </span>
                  <h2 className="display text-display-sm mt-4 text-white">
                    {isAr
                      ? <>جودة PP.<br /><span className="text-[#0D9488]">ضمان المصنع.</span></>
                      : isEn
                        ? <>PP quality.<br /><span className="text-[#0D9488]">Factory guarantee.</span></>
                        : <>کیفیت PP.<br /><span className="text-[#0D9488]">ضمانت کارخانه.</span></>}
                  </h2>
                  <p className="mt-6 max-w-md leading-relaxed text-teal-100/65">
                    {isAr
                      ? 'مواد PP بكر 100٪، تصنيع دقيق ومتحكم به، وتسليم سريع من المصنع إلى الجملة وأسواق التصدير.'
                      : isEn
                        ? '100% virgin PP, precision manufacturing, and fast factory-direct delivery to wholesale and export markets.'
                        : 'مواد اولیه PP بکر ۱۰۰٪، تولید دقیق و کنترل‌شده، و تحویل سریع از کارخانه به بنکداران و بازارهای صادراتی.'}
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      {
                        img: '/images/3d/3d-tile-quality.jpg',
                        fa_t: 'مواد اولیه درجه یک',
                        en_t: 'Premium Raw Material',
                        ar_t: 'مواد خام من الدرجة الأولى',
                        fa_d: 'PP بهداشتی ۱۰۰٪ بکر؛ ایمن برای محیط‌های غذایی.',
                        en_d: '100% virgin food-grade PP for food-contact use.',
                        ar_d: 'PP بكر 100٪ للاستخدام الغذائي.',
                      },
                      {
                        img: '/images/3d/3d-tile-delivery.jpg',
                        fa_t: 'تحویل از درب کارخانه',
                        en_t: 'Ex-Factory Delivery',
                        ar_t: 'تسليم من المصنع',
                        fa_d: 'موجودی آماده و بسته‌بندی پالتایز صادراتی.',
                        en_d: 'Ready stock with export-palletized packaging.',
                        ar_d: 'مخزون جاهز وتغليف منصات للتصدير.',
                      },
                      {
                        img: '/images/3d/3d-tile-custom.jpg',
                        fa_t: 'رنگ و سایز سفارشی',
                        en_t: 'Custom Color & Size',
                        ar_t: 'ألوان وأحجام مخصصة',
                        fa_d: 'سطل ۲۰–۶۰ لیتر، سبد ۱۲–۴۵ لیتر.',
                        en_d: 'Bins 20–60 L, baskets 12–45 L.',
                        ar_d: 'سلال 20–60 لتر، سلال نزهة 12–45 لتر.',
                      },
                      {
                        img: '/images/3d/3d-factory-pallets.jpg',
                        fa_t: 'تیراژ کارخانه‌ای',
                        en_t: 'Factory Scale',
                        ar_t: 'إنتاج صناعي',
                        fa_d: 'تولید پایدار برای سفارش‌های عمده B2B.',
                        en_d: 'Stable output for wholesale B2B orders.',
                        ar_d: 'إنتاج مستقر لطلبات الجملة.',
                      },
                    ].map(({ img, fa_t, en_t, ar_t, fa_d, en_d, ar_d }) => (
                      <div
                        key={fa_t}
                        className="overflow-hidden rounded-3xl border border-teal-800/50 bg-teal-950/40 transition-colors hover:border-teal-600"
                      >
                        <div className="relative h-28">
                          <Image src={img} alt="" fill className="object-cover opacity-90" sizes="240px" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-black text-white">{isAr ? ar_t : isEn ? en_t : fa_t}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-teal-100/60">
                            {isAr ? ar_d : isEn ? en_d : fa_d}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="container mx-auto px-5 py-16 lg:px-8 lg:py-20">
          <div className="mb-12 text-center">
            <span className="eyebrow justify-center">
              <span className="dash" />
              {isAr ? 'كيفية الطلب' : isEn ? 'How to Order' : 'نحوه سفارش'}
              <span className="dash" />
            </span>
            <h2 className="display text-display-sm mt-4">
              {isAr
                ? <><span className="text-gradient">ثلاث خطوات</span> بسيطة</>
                : isEn
                  ? <>Three <span className="text-gradient">simple steps</span></>
                  : <>سه گام <span className="text-gradient">ساده</span></>}
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                n: '01',
                img: '/images/3d/step-quote.jpg',
                fa_t: 'استعلام قیمت',
                en_t: 'Request a Quote',
                ar_t: 'طلب عرض سعر',
                fa_d: 'فرم آنلاین یا تماس مستقیم با واحد فروش. نوع محصول، تعداد و رنگ دلخواه را مشخص کنید.',
                en_d: 'Fill the online form or call our sales team. Specify product type, quantity and colour.',
                ar_d: 'أكمل النموذج الإلكتروني أو اتصل بفريق المبيعات. حدد نوع المنتج والكمية واللون.',
              },
              {
                n: '02',
                img: '/images/3d/step-confirm.jpg',
                fa_t: 'تأیید سفارش',
                en_t: 'Order Confirmation',
                ar_t: 'تأكيد الطلب',
                fa_d: 'کارشناس ما ظرف ۲۴ ساعت با شما تماس می‌گیرد، قیمت نهایی و زمان تحویل را تأیید می‌کند.',
                en_d: 'Our specialist contacts you within 24 hours, confirming final pricing and delivery schedule.',
                ar_d: 'يتواصل معك متخصصنا خلال 24 ساعة لتأكيد السعر النهائي وجدول التسليم.',
              },
              {
                n: '03',
                img: '/images/3d/step-delivery.jpg',
                fa_t: 'تحویل از کارخانه',
                en_t: 'Ex-Factory Delivery',
                ar_t: 'التسليم من المصنع',
                fa_d: 'بسته‌بندی پالتایز صادراتی با مدارک کامل؛ تحویل از درب کارخانه یا ارسال به سراسر ایران.',
                en_d: 'Export-palletized with full documentation; ex-factory pickup or nationwide delivery.',
                ar_d: 'تغليف منصات للتصدير مع وثائق كاملة؛ استلام من المصنع أو توصيل على مستوى البلاد.',
              },
            ].map(({ n, img, fa_t, en_t, ar_t, fa_d, en_d, ar_d }) => (
              <div
                key={n}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-teal-500/40 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                  <span className="absolute start-4 top-4 rounded-3xl bg-[#164E53] px-2.5 py-1 text-xs font-black text-white">
                    {n}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[#0F172A]">
                    {isAr ? ar_t : isEn ? en_t : fa_t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {isAr ? ar_d : isEn ? en_d : fa_d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <ScrollReveal>
        <section className="container mx-auto py-20">
          <TestimonialsCarousel isEn={isEn} isAr={isAr} />
        </section>
      </ScrollReveal>

      {/* ============================================================
          FAQ — smooth accordion (client component)
          ============================================================ */}
      <ScrollReveal>
        <section className="container mx-auto py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="eyebrow">
                <span className="dash" />
                {isAr ? 'الأسئلة الشائعة' : isEn ? 'Common Questions' : 'سوالات متداول'}
              </span>
              <h2 className="display text-display-sm mt-4">
                {isAr
                  ? <>الإجابات،<br />قبل أن تسأل.</>
                  : isEn
                    ? <>Answers,<br />before you ask.</>
                    : <>پاسخ‌ها،<br />پیش از پرسش.</>}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-muted">
                {isAr
                  ? 'لم تجد ما تبحث عنه؟ فريقنا على بُعد رسالة.'
                  : isEn
                    ? "Can't find your answer? Our team is one message away."
                    : 'پاسخ خود را پیدا نکردید؟ تیم ما یک پیام با شما فاصله دارد.'}
              </p>
              <Link href="/contact" className="btn-primary mt-7">
                {isAr ? 'اتصل بنا' : isEn ? 'Contact Us' : 'تماس با ما'}
                <ArrowRight className="h-4 w-4 flip-x" />
              </Link>
            </div>

            <div className="lg:col-span-8">
              <FaqAccordion items={faqItems} />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ============================================================
          CTA BANNER
          ============================================================ */}
      <ScrollReveal>
        <section className="container mx-auto px-5 py-16 lg:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800">
            <div className="absolute inset-0">
              <Image src="/images/3d/3d-factory-pallets.jpg" alt="" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-[#061216]/78" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#164E53]/70 to-transparent" />
            </div>
            <div className="relative px-6 py-16 text-center lg:px-16 lg:py-24">
              <h2 className="display text-display-sm mx-auto max-w-2xl text-white">
                {isAr
                  ? 'هل أنت مستعد للاستفسار عن أسعار الجملة؟'
                  : isEn
                    ? 'Ready for a wholesale price quote?'
                    : 'آماده‌ی استعلام قیمت عمده هستید؟'}
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-relaxed text-teal-100/75">
                {isAr
                  ? 'يرد فريق مبيعاتنا خلال 24 ساعة — الطلبات من 100 وحدة.'
                  : isEn
                    ? 'Our sales team responds within 24 hours — orders from 100 units.'
                    : 'تیم فروش ما در کمتر از ۲۴ ساعت پاسخگوی شما است — سفارش از ۱۰۰ عدد.'}
              </p>
              <Link
                href="/contact"
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-3xl bg-white px-7 py-3 text-sm font-bold text-[#164E53] transition-colors hover:bg-teal-50"
              >
                {isAr ? 'احصل على عرض سعر' : isEn ? 'Get a Quote' : 'استعلام قیمت'}
                <ArrowRight className="h-4 w-4 flip-x" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

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
      title: true, titleEn: true, titleAr: true,
      excerpt: true, excerptEn: true, excerptAr: true,
      image: true,
      createdAt: true,
    },
  });

  if (articles.length === 0) return null;

  return (
    <ScrollReveal>
      <section className="container mx-auto py-20">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">
              <span className="dash" />
              {isAr ? 'المعرفة' : isEn ? 'Knowledge' : 'دانش‌نامه'}
            </span>
            <h2 className="display text-display-sm mt-4">{t('latestBlog.title')}</h2>
          </div>
          <Link href="/blog" className="btn-ghost self-start">
            {isAr ? 'جميع المقالات' : isEn ? 'All Articles' : 'همه مقالات'}
            <ArrowUpRight className="h-4 w-4 flip-x" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a: any) => {
            const title   = isAr ? (a.titleAr   || a.title)   : isEn ? (a.titleEn   || a.title)   : a.title;
            const excerpt = isAr ? (a.excerptAr || a.excerpt) : isEn ? (a.excerptEn || a.excerpt) : a.excerpt;
            return (
              <Link key={a.slug} href={`/blog/${a.slug}` as '/'} className="card group overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {a.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.image}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-clean-studio" />
                  )}
                </div>
                <div className="p-6">
                  <time
                    dateTime={a.createdAt.toISOString()}
                    className="text-xs font-bold uppercase tracking-wider text-brand-600"
                  >
                    {formatDate(a.createdAt.toISOString(), locale)}
                  </time>
                  <h3 className="display mt-2 line-clamp-2 text-lg text-ink">{title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">{excerpt}</p>
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
    </ScrollReveal>
  );
}
