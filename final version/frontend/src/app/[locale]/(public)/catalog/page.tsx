import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { siteConfig } from '@/config/site-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import {
  Download, FileText, CheckCircle, Layers, Ruler, ShieldCheck, ArrowRight,
} from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

const CATALOG_PATH = siteConfig.catalogUrl;

interface CatalogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'catalog' });
  const title = t('meta.title');
  const description = t('meta.description');
  return {
    title,
    description,
    alternates: buildAlternates(locale, 'catalog'),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title,
      description,
      locale: isAr ? 'ar_SA' : isEn ? 'en_US' : 'fa_IR',
    },
    twitter: { ...seoConfig.twitter, title, description },
  };
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'catalog' });

  const highlights = [
    {
      icon: Layers,
      t: isAr ? 'نطاق كامل من المنتجات' : isEn ? 'Full Product Range' : 'طیف کامل محصولات',
      d: isAr ? 'كل خط وحجم ونوع في مكان واحد.' : isEn ? 'Every line, size and variant in one place.' : 'تمام خطوط، اندازه‌ها و انواع در یک فایل.',
    },
    {
      icon: Ruler,
      t: isAr ? 'المواصفات الفنية' : isEn ? 'Technical Specs' : 'مشخصات فنی',
      d: isAr ? 'الأبعاد والسعات ودرجات المواد.' : isEn ? 'Dimensions, capacities and material grades.' : 'ابعاد، ظرفیت و گرید مواد اولیه.',
    },
    {
      icon: ShieldCheck,
      t: isAr ? 'الشهادات' : isEn ? 'Certifications' : 'گواهینامه‌ها',
      d: isAr ? 'تفاصيل موافقة ISO وISIRI والأمم المتحدة.' : isEn ? 'ISO, ISIRI and UN approval details.' : 'جزئیات تأییدیه ISO، ISIRI و UN.',
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow={isAr ? 'كاتالوج 2026' : isEn ? 'Catalog 2026' : 'کاتالوگ ۱۴۰۵'}
        title={t('title')}
        description={t('description')}
        imageSrc="/images/3d/3d-factory-pallets.jpg"
      />

      <section className="container mx-auto px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={CATALOG_PATH}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 rounded-3xl bg-[#164E53] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0D9488]"
              >
                <Download className="h-4 w-4" />
                {t('downloadButton')}
              </a>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0F172A] transition-colors hover:border-teal-500/50"
              >
                {isAr ? 'تصفح عبر الإنترنت' : isEn ? 'Browse Online' : 'مشاهده آنلاین'}
                <ArrowRight className="h-4 w-4 flip-x" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0D9488]" /> {t('format')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#0D9488]" /> {t('range')}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-slate-200 aspect-[3/4] shadow-sm">
              <Image
                src="/images/3d/3d-hero-scene.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061216] via-[#061216]/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <span className="text-sm font-bold uppercase tracking-wider text-teal-200">PDF</span>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white">{t('cardTitle')}</h2>
                <p className="mt-3 text-sm leading-relaxed text-teal-100/75">{t('cardDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container mx-auto px-5 py-16 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0D9488]">
              <span className="h-px w-8 bg-[#0D9488]" />
              <span>{isAr ? 'محتوى الكاتالوج' : isEn ? "What's Inside" : 'محتوای کاتالوگ'}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#0F172A]">
              {isAr ? 'كل ما تحتاجه لاتخاذ قرارك' : isEn ? 'Everything you need to decide' : 'هر آنچه برای تصمیم‌گیری لازم دارید'}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map(({ icon: Icon, t: title, d }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-7 transition-all duration-200 hover:border-teal-500/50 hover:shadow-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#CCFBF1] text-[#164E53]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-black text-[#0F172A]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 py-16 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-[#0F172A] px-6 py-14 text-center lg:px-16">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-white/10">
            <FileText className="h-7 w-7 text-teal-200" />
          </span>
          <h2 className="mx-auto mt-6 max-w-xl text-3xl font-black text-white">{t('cardTitle')}</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">{t('note')}</p>
          <a
            href={CATALOG_PATH}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-3xl bg-[#0D9488] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-500"
          >
            <Download className="h-4 w-4" />
            {t('downloadButton')}
          </a>
          <p className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <CheckCircle className="h-3.5 w-3.5" /> {t('opensInNewTab')}
          </p>
        </div>
      </section>
    </div>
  );
}
