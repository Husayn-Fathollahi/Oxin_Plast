import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { seoConfig } from '@/config/seo-config';
import { siteConfig } from '@/config/site-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Link } from '@/lib/i18n/navigation';
import {
  Download, FileText, BookOpen, CheckCircle, Layers, Ruler, ShieldCheck, ArrowRight,
} from 'lucide-react';

const CATALOG_PATH = siteConfig.catalogUrl;

interface CatalogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CatalogPageProps): Promise<Metadata> {
  const { locale } = await params;
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
      locale: locale === 'en' ? 'en_US' : 'fa_IR',
    },
    twitter: { ...seoConfig.twitter, title, description },
  };
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const t = await getTranslations('catalog');

  const highlights = [
    { icon: Layers,      t: isEn ? 'Full Product Range' : 'طیف کامل محصولات', d: isEn ? 'Every line, size and variant in one place.' : 'تمام خطوط، اندازه‌ها و انواع در یک فایل.' },
    { icon: Ruler,       t: isEn ? 'Technical Specs'    : 'مشخصات فنی',        d: isEn ? 'Dimensions, capacities and material grades.' : 'ابعاد، ظرفیت و گرید مواد اولیه.' },
    { icon: ShieldCheck, t: isEn ? 'Certifications'     : 'گواهینامه‌ها',      d: isEn ? 'ISO, ISIRI and UN approval details.' : 'جزئیات تأییدیه ISO، ISIRI و UN.' },
  ];

  return (
    <div className="overflow-clip">
      {/* Hero */}
      <section className="relative bg-mesh">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -start-16 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl animate-float-slow" />
          <div className="absolute top-20 -end-16 h-72 w-72 rounded-full bg-gold-200/30 blur-3xl animate-float" />
        </div>

        <div className="container mx-auto relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Copy */}
            <div className="lg:col-span-6">
              <div className="chip animate-fade-up animate-fill-both">
                <BookOpen className="h-3.5 w-3.5" />
                {isEn ? 'Product Catalog 2026' : 'کاتالوگ محصولات ۱۴۰۵'}
              </div>
              <h1 className="display text-display mt-6 animate-fade-up animate-fill-both animate-delay-100">
                {t('title')}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft animate-fade-up animate-fill-both animate-delay-200">
                {t('description')}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up animate-fill-both animate-delay-300">
                <a href={CATALOG_PATH} target="_blank" rel="noopener noreferrer" download className="btn-primary">
                  <Download className="h-4 w-4" />
                  {t('downloadButton')}
                </a>
                <Link href="/products" className="btn-ghost">
                  {isEn ? 'Browse Online' : 'مشاهده آنلاین'}
                  <ArrowRight className="h-4 w-4 flip-x" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-muted">
                <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-brand-500" /> {t('format')}</span>
                <span className="inline-flex items-center gap-2"><Layers className="h-4 w-4 text-brand-500" /> {t('range')}</span>
              </div>
            </div>

            {/* Catalog cover mockup */}
            <div className="lg:col-span-6 animate-scale-in animate-fill-both animate-delay-200">
              <div className="relative mx-auto max-w-sm">
                <div className="relative rounded-4xl overflow-hidden shadow-lift rotate-2 bg-brand-950 aspect-[3/4]">
                  <div aria-hidden className="absolute inset-0">
                    <div className="absolute -top-10 -end-6 h-48 w-48 rounded-full bg-brand-500/30 blur-2xl" />
                    <div className="absolute bottom-0 -start-6 h-48 w-48 rounded-full bg-sky-500/20 blur-2xl" />
                  </div>
                  <div className="relative h-full flex flex-col justify-between p-8 text-white">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                        <BookOpen className="h-5 w-5 text-brand-300" />
                      </span>
                      <span className="display text-sm uppercase tracking-wider">PDF</span>
                    </div>
                    <div>
                      <div className="h-px w-14 bg-brand-400 mb-5" />
                      <h2 className="display text-3xl leading-tight text-white">{t('cardTitle')}</h2>
                      <p className="mt-3 text-sm text-brand-100/70 leading-relaxed">{t('cardDescription')}</p>
                    </div>
                  </div>
                </div>
                {/* floating badge */}
                <div className="absolute -bottom-5 -start-4 card p-4 flex items-center gap-3 animate-float">
                  <div className="pe-2">
                    <div className="text-[11px] text-ink-muted">{t('format')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="container mx-auto py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow justify-center"><span className="dash" /> {isEn ? "What's Inside" : 'محتوای کاتالوگ'} <span className="dash" /></span>
          <h2 className="display text-display-sm mt-4">
            {isEn ? <>Everything you need to <span className="text-gradient">decide</span></>
                  : <>هر آنچه برای <span className="text-gradient">تصمیم‌گیری</span> لازم دارید</>}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map(({ icon: Icon, t: title, d }, i) => (
            <div key={title} className="card p-8">
              <span className={`icon-tile h-12 w-12 ${i % 2 === 0 ? 'bg-brand-gradient' : 'bg-coral-gradient'}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="display text-xl mt-5 text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Download CTA */}
      <section className="container mx-auto pb-24">
        <div className="relative overflow-hidden rounded-5xl bg-brand-950 px-6 py-14 lg:px-16 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 start-1/4 h-60 w-60 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -bottom-20 end-1/4 h-60 w-60 rounded-full bg-sky-500/15 blur-3xl" />
          </div>
          <div className="relative">
            <span className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-white/10">
              <FileText className="h-8 w-8 text-brand-300" />
            </span>
            <h2 className="display text-display-sm mt-6 text-white max-w-xl mx-auto">{t('cardTitle')}</h2>
            <p className="mt-4 text-brand-100/70 max-w-lg mx-auto">{t('note')}</p>
            <a href={CATALOG_PATH} target="_blank" rel="noopener noreferrer" download
               className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand-700 shadow-lift transition-transform hover:-translate-y-1">
              <Download className="h-4 w-4" />
              {t('downloadButton')}
            </a>
            <p className="mt-4 text-xs text-brand-100/50 inline-flex items-center justify-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" /> {t('opensInNewTab')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
