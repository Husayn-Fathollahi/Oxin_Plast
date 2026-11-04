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
import {
  ArrowRight, ArrowUpRight,
  ShieldCheck, FlaskConical, Truck, Layers, Sparkles,
  Boxes, Gauge, Building2,
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

  const tints = ['bg-[#1E5E63]', 'bg-[#0D9488]', 'bg-[#164E53]'] as const;
  const cardIcons = [Boxes, Layers, Gauge] as const;

  const featuredCards = homeProducts.map((p: any, i: number) => {
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
      Icon: cardIcons[i % cardIcons.length],
      tint: tints[i % tints.length],
    };
  });

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

      {/* ============================================================
          PRODUCTS — bento grid (1st card wider on tablet) + category strip
          ============================================================ */}
      <ScrollReveal>
        <section id="products" className="container mx-auto py-20">
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

          {/* Category quick-select */}
          <div className="mb-8 flex flex-wrap gap-2">
            {productCategories.map(({ label }, i) => (
              <Link
                key={label}
                href="/products"
                className={`inline-flex items-center rounded-md px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
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
            {featuredCards.map(({ slug, Icon, category, title, desc, imageUrl, tint }: any, idx: number) => (
              <Link
                key={slug}
                href={`/products/${slug}`}
                className={`card group overflow-hidden ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`relative overflow-hidden bg-slate-100 ${idx === 0 ? 'h-64' : 'h-52'}`}>
                  <FeaturedProductImage src={imageUrl} alt={title} />
                  <span className={`absolute start-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg text-white ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{category}</span>
                  <h3 className="display mt-2 text-xl text-ink">{title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                    {isAr ? 'عرض التفاصيل' : isEn ? 'View Details' : 'مشاهده جزئیات'}
                    <ArrowRight className="h-4 w-4 flip-x transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ============================================================
          B2B CUSTOMERS WE SERVE
          ============================================================ */}
      <ScrollReveal>
        <section className="container mx-auto py-20">
          <div className="mx-auto mb-14 max-w-2xl text-center">
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { Icon: Boxes,      fa: 'بنکداران',               en: 'Wholesalers',         ar: 'تجار الجملة'         },
              { Icon: Layers,     fa: 'فروشگاه‌های زنجیره‌ای',  en: 'Retail Chains',       ar: 'سلاسل البيع'         },
              { Icon: ArrowUpRight,fa:'صادرکنندگان',            en: 'Exporters',           ar: 'المصدّرون'           },
              { Icon: Sparkles,   fa: 'هتل و رستوران',           en: 'Hotels & F&B',        ar: 'الفنادق والمطاعم'    },
              { Icon: ShieldCheck,fa: 'بیمارستان و کلینیک',     en: 'Hospitals & Clinics', ar: 'المستشفيات'          },
              { Icon: Building2,  fa: 'ادارات و شرکت‌ها',       en: 'Offices & Corps',     ar: 'المكاتب والشركات'    },
            ].map(({ Icon, fa, en, ar }, i) => (
              <div
                key={fa}
                className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:border-teal-300 hover:shadow-md"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-lg text-white transition-transform duration-300 group-hover:scale-110 ${
                    i % 2 === 0 ? 'bg-[#1E5E63]' : 'bg-[#0D9488]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-[#0F172A]">
                  {isAr ? ar : isEn ? en : fa}
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ============================================================
          WHY SALMAN PLASTIC
          ============================================================ */}
      <ScrollReveal>
        <section className="py-20">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-[#0C2628] px-6 py-16 lg:px-16 lg:py-20">
              <div className="relative grid items-start gap-12 lg:grid-cols-2">
                <div>
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      Icon: ShieldCheck,
                      fa_t: 'مواد اولیه درجه یک',     en_t: 'Premium Raw Material',  ar_t: 'مواد خام من الدرجة الأولى',
                      fa_d: 'PP بهداشتی ۱۰۰٪ بکر؛ ایمن برای محیط‌های غذایی و مقاوم در برابر ضربه و رطوبت.',
                      en_d: '100% virgin food-grade PP — impact-resistant, moisture-proof and approved for food-contact environments.',
                      ar_d: 'PP بكر 100٪ للاستخدام الغذائي — مقاوم للصدمات والرطوبة ومعتمد للبيئات الغذائية.',
                    },
                    {
                      Icon: FlaskConical,
                      fa_t: 'آزمون کیفی در هر مرحله', en_t: 'Quality Control Lab',    ar_t: 'مختبر مراقبة الجودة',
                      fa_d: 'هر محموله پیش از ارسال از آزمون‌های رنگ‌ثبات، مقاومت و ایمنی ماده می‌گذرد.',
                      en_d: 'Every batch undergoes colour-fastness, impact and material-safety testing before dispatch.',
                      ar_d: 'تخضع كل دفعة لاختبارات ثبات الألوان والمقاومة وسلامة المواد قبل الشحن.',
                    },
                    {
                      Icon: Truck,
                      fa_t: 'تحویل از درب کارخانه',   en_t: 'Ex-Factory Delivery',   ar_t: 'تسليم من المصنع',
                      fa_d: 'موجودی آماده برای ارسال فوری؛ بسته‌بندی پالتایز صادراتی برای بازارهای خارج از کشور.',
                      en_d: 'Ready stock for immediate shipping; export-palletized packaging for international markets.',
                      ar_d: 'مخزون جاهز للشحن الفوري؛ تغليف منصات للتصدير للأسواق الدولية.',
                    },
                    {
                      Icon: Sparkles,
                      fa_t: 'رنگ و سایز سفارشی',       en_t: 'Custom Color & Size',   ar_t: 'ألوان وأحجام مخصصة',
                      fa_d: 'سطل از ۲۰ تا ۶۰ لیتر، سبد از ۱۲ تا ۴۵ لیتر؛ پالت رنگی کامل با PP اصلی.',
                      en_d: 'Bins 20–60 L, baskets 12–45 L; full colour palette in virgin PP material.',
                      ar_d: 'سلال 20–60 لتراً، سلال نزهة 12–45 لتراً؛ لوح ألوان كامل بمادة PP البكر.',
                    },
                  ].map(({ Icon, fa_t, en_t, ar_t, fa_d, en_d, ar_d }) => (
                    <div
                      key={fa_t}
                      className="rounded-xl border border-teal-800/50 bg-teal-950/40 p-6 transition-colors hover:border-teal-700"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-900/60 text-teal-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="display mt-4 text-base text-white">
                        {isAr ? ar_t : isEn ? en_t : fa_t}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-teal-100/60">
                        {isAr ? ar_d : isEn ? en_d : fa_d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ============================================================
          ORDER PROCESS — NEW section for B2B buyers
          ============================================================ */}
      <ScrollReveal>
        <section className="container mx-auto py-20">
          <div className="mb-14 text-center">
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

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: '01',
                fa_t: 'استعلام قیمت',
                en_t: 'Request a Quote',
                ar_t: 'طلب عرض سعر',
                fa_d: 'فرم آنلاین یا تماس مستقیم با واحد فروش. نوع محصول، تعداد و رنگ دلخواه را مشخص کنید.',
                en_d: 'Fill the online form or call our sales team. Specify product type, quantity and colour.',
                ar_d: 'أكمل النموذج الإلكتروني أو اتصل بفريق المبيعات. حدد نوع المنتج والكمية واللون.',
              },
              {
                n: '02',
                fa_t: 'تأیید سفارش',
                en_t: 'Order Confirmation',
                ar_t: 'تأكيد الطلب',
                fa_d: 'کارشناس ما ظرف ۲۴ ساعت با شما تماس می‌گیرد، قیمت نهایی و زمان تحویل را تأیید می‌کند.',
                en_d: 'Our specialist contacts you within 24 hours, confirming final pricing and delivery schedule.',
                ar_d: 'يتواصل معك متخصصنا خلال 24 ساعة لتأكيد السعر النهائي وجدول التسليم.',
              },
              {
                n: '03',
                fa_t: 'تحویل از کارخانه',
                en_t: 'Ex-Factory Delivery',
                ar_t: 'التسليم من المصنع',
                fa_d: 'بسته‌بندی پالتایز صادراتی با مدارک کامل؛ تحویل از درب کارخانه یا ارسال به سراسر ایران.',
                en_d: 'Export-palletized with full documentation; ex-factory pickup or nationwide delivery.',
                ar_d: 'تغليف منصات للتصدير مع وثائق كاملة؛ استلام من المصنع أو توصيل على مستوى البلاد.',
              },
            ].map(({ n, fa_t, en_t, ar_t, fa_d, en_d, ar_d }) => (
              <div
                key={n}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Large muted step number as background decoration */}
                <div
                  aria-hidden
                  className="absolute end-4 top-2 select-none text-8xl font-black leading-none text-slate-50"
                >
                  {n}
                </div>
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1E5E63] text-base font-black text-white">
                    {n}
                  </span>
                  <h3 className="display mt-5 text-xl text-ink">
                    {isAr ? ar_t : isEn ? en_t : fa_t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
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
        <section className="container mx-auto py-20">
          <div className="relative overflow-hidden rounded-2xl bg-[#164E53] px-6 py-16 text-center lg:px-16 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(rgba(13,148,136,0.3) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative">
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
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-md bg-white px-7 py-3 text-sm font-bold text-[#164E53] transition-colors hover:bg-teal-50"
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
