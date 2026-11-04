import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/forms/contact-form';
import { siteConfig } from '@/config/site-config';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const title = t('meta.title');
  const description = t('meta.description');
  return {
    title,
    description,
    alternates: buildAlternates(locale, 'contact'),
    openGraph: {
      ...seoConfig.defaultOpenGraph,
      title,
      description,
      locale: locale === 'ar' ? 'ar_SA' : locale === 'en' ? 'en_US' : 'fa_IR',
    },
    twitter: { ...seoConfig.twitter, title, description },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'contact' });

  const infoItems = [
    { icon: Phone,  label: t('info.phone'),   value: siteConfig.contact.phone,   href: `tel:${siteConfig.contact.phone}`,   tint: 'bg-brand-gradient' },
    { icon: Mail,   label: t('info.email'),   value: siteConfig.contact.email,   href: `mailto:${siteConfig.contact.email}`, tint: 'bg-coral-gradient' },
    { icon: MapPin, label: t('info.address'), value: siteConfig.contact.address, href: null,                                tint: 'bg-brand-gradient' },
    { icon: Clock,  label: t('info.workingHours'), value: t('info.workingHoursValue'), href: null,                          tint: 'bg-coral-gradient' },
  ];

  return (
    <div className="overflow-clip">
      {/* Hero */}
      <section className="relative bg-mesh">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -start-16 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl animate-float-slow" />
          <div className="absolute top-10 -end-16 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl animate-float" />
        </div>
        <div className="container mx-auto relative py-20 lg:py-24 text-center">
          <div className="chip mx-auto animate-fade-up animate-fill-both">
            <MessageCircle className="h-3.5 w-3.5" />
            {isAr ? 'لنتحدث' : isEn ? "Let's Talk" : 'گفت‌وگو با ما'}
          </div>
          <h1 className="display text-display mt-6 animate-fade-up animate-fill-both animate-delay-100">
            {t('title')}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft animate-fade-up animate-fill-both animate-delay-200">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="container mx-auto -mt-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Info */}
          <aside className="flex flex-col gap-6 lg:col-span-2">
            <div className="card p-7">
              <h2 className="display text-xl text-ink mb-6">{t('info.title')}</h2>
              <ul className="space-y-5">
                {infoItems.map(({ icon: Icon, label, value, href, tint }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className={`icon-tile h-11 w-11 shrink-0 ${tint}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</p>
                      {href ? (
                        <a href={href} className="mt-1 block truncate text-sm font-semibold text-ink transition-colors hover:text-brand-700" dir={href.startsWith('tel') || href.startsWith('mailto') ? 'ltr' : undefined}>
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Promise card */}
            <div className="relative overflow-hidden rounded-4xl bg-brand-950 p-7 text-white">
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-12 -end-8 h-44 w-44 rounded-full bg-brand-500/25 blur-2xl" />
              </div>
              <div className="relative">
                <span className="icon-tile h-11 w-11 bg-white/10 text-brand-300"><Sparkles className="h-5 w-5" /></span>
                <h3 className="display text-lg mt-4 text-white">{t('promise.title')}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100/75">{t('promise.body')}</p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="card p-8 lg:col-span-3">
            <h2 className="display text-xl text-ink mb-1">{t('form.sectionTitle')}</h2>
            <p className="mb-6 text-sm text-ink-muted">{t('form.sectionSubtitle')}</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
