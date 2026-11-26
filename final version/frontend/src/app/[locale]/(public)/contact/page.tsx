import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArrowDown, Building2, Clock3, Factory, Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { seoConfig } from '@/config/seo-config';
import { buildAlternates } from '@/features/seo/utils/generate-metadata';
import { ContactForm } from '@/components/forms/contact-form';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const title = t('meta.title');
  const description = t('meta.description');
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale, 'contact'),
    openGraph: { ...seoConfig.defaultOpenGraph, title, description, locale: locale === 'en' ? 'en_US' : locale === 'ar' ? 'ar' : 'fa_IR' },
    twitter: { ...seoConfig.twitter, title, description },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const address = locale === 'fa' ? 'تهران، ایران' : locale === 'ar' ? 'طهران، إيران' : siteConfig.contact.address;

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-5 py-14 sm:py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3 text-xs font-bold text-teal-700">
                <span className="h-px w-8 bg-teal-600" />{t('eyebrow')}
              </div>
              <h1 className="text-3xl font-black leading-snug tracking-tight text-slate-900 sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-snug">{t('title')}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">{t('subtitle')}</p>
              <a href="#contact-form" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-800 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                {t('form.sectionTitle')} <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="border-s-2 border-teal-600 ps-5">
              <p className="text-sm font-bold text-slate-900">{t('promise.title')}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{t('promise.body')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-5 py-10 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-8">
          <section id="contact-form" className="scroll-mt-20 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-3 lg:order-2">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold text-teal-700"><span className="h-2 w-2 bg-teal-600" />{t('form.kicker')}</div>
              <h2 className="text-2xl font-black leading-snug tracking-tight text-slate-900">{t('form.sectionTitle')}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{t('form.sectionSubtitle')}</p>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8"><ContactForm /></div>
          </section>

          <aside className="space-y-5 lg:col-span-2 lg:order-1">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-6 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Building2 className="h-5 w-5" aria-hidden="true" /></span>
                <div><h2 className="text-lg font-extrabold text-slate-900">{t('sales.title')}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{t('sales.description')}</p></div>
              </div>
              <div className="space-y-5 border-t border-slate-200 pt-5">
                <ContactDetail icon={<Phone />} label={t('info.phone')}><a dir="ltr" className="inline-block font-semibold text-slate-900 transition-colors hover:text-teal-700" href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a></ContactDetail>
                <ContactDetail icon={<Mail />} label={t('info.email')}><a dir="ltr" className="inline-block break-all font-semibold text-slate-900 transition-colors hover:text-teal-700" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></ContactDetail>
                <ContactDetail icon={<Clock3 />} label={t('info.workingHours')}><span className="font-medium text-slate-700">{t('info.workingHoursValue')}</span></ContactDetail>
              </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><Factory className="h-5 w-5" aria-hidden="true" /></span>
                <div><h2 className="text-lg font-extrabold text-slate-900">{t('factory.title')}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{t('factory.description')}</p></div>
              </div>
              <ContactDetail icon={<MapPin />} label={t('info.address')}><span className="font-semibold text-slate-900">{address}</span></ContactDetail>
              <p className="mt-4 border-t border-slate-200 pt-4 text-xs leading-6 text-slate-600">{t('factory.note')}</p>
            </section>
            <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-teal-700 px-5 py-3 text-sm font-bold text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              <Phone className="h-4 w-4" aria-hidden="true" />{t('promise.cta')}
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ContactDetail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-teal-700 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">{icon}</span><div className="min-w-0"><p className="text-xs font-semibold text-slate-500">{label}</p><div className="mt-1 text-sm leading-6">{children}</div></div></div>;
}
