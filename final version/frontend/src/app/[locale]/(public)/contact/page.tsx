import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Building2, Clock3, Factory, Mail, MapPin, Phone } from 'lucide-react';
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
    title,
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
    <main className="min-h-screen bg-[#0A1519] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#0A1519]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgba(20,112,101,.28),transparent_50%),linear-gradient(135deg,#0A1519_25%,#10272B_100%)]" />
        <div aria-hidden="true" className="absolute inset-y-0 end-0 hidden w-1/3 border-s border-white/5 lg:block" />
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.18em] text-teal-300">
              <span className="h-px w-10 bg-teal-400" />{t('eyebrow')}
            </div>
            <h1 className="display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">{t('title')}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <aside className="space-y-5 lg:col-span-2">
            <section className="rounded-2xl border border-white/10 bg-[#101F23] p-6 sm:p-7">
              <div className="mb-6 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300"><Building2 className="h-5 w-5" /></span>
                <div><h2 className="text-lg font-extrabold">{t('sales.title')}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{t('sales.description')}</p></div>
              </div>
              <div className="space-y-4 border-t border-white/10 pt-5">
                <ContactDetail icon={<Phone />} label={t('info.phone')}><a dir="ltr" className="inline-block font-semibold text-white transition-colors hover:text-teal-300" href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a></ContactDetail>
                <ContactDetail icon={<Mail />} label={t('info.email')}><a className="break-all font-semibold text-white transition-colors hover:text-teal-300" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></ContactDetail>
                <ContactDetail icon={<Clock3 />} label={t('info.workingHours')}><span className="font-medium text-slate-200">{t('info.workingHoursValue')}</span></ContactDetail>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#101F23] p-6 sm:p-7">
              <div className="mb-5 flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300"><Factory className="h-5 w-5" /></span>
                <div><h2 className="text-lg font-extrabold">{t('factory.title')}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{t('factory.description')}</p></div>
              </div>
              <ContactDetail icon={<MapPin />} label={t('info.address')}><span className="font-semibold text-white">{address}</span></ContactDetail>
              <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-slate-400">{t('factory.note')}</p>
            </section>
          </aside>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F7F6] text-slate-900 shadow-2xl shadow-black/20 lg:col-span-3">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#16776F]"><span className="h-2 w-2 bg-[#16776F]" />{t('form.kicker')}</div>
              <h2 className="text-2xl font-black tracking-tight">{t('form.sectionTitle')}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{t('form.sectionSubtitle')}</p>
            </div>
            <div className="px-6 py-6 sm:px-8 sm:py-8"><ContactForm /></div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-teal-300/20 bg-[#10312F] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div><p className="font-extrabold text-white">{t('promise.title')}</p><p className="mt-1 text-sm leading-6 text-teal-50/75">{t('promise.body')}</p></div>
          <a href={`tel:${siteConfig.contact.phone}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-teal-400 px-5 py-3 text-sm font-extrabold text-[#08201F] transition-colors hover:bg-teal-300"><Phone className="h-4 w-4" />{t('promise.cta')}</a>
        </div>
      </section>
    </main>
  );
}

function ContactDetail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-teal-300 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">{icon}</span><div className="min-w-0"><p className="text-xs font-semibold text-slate-400">{label}</p><div className="mt-1 text-sm leading-6">{children}</div></div></div>;
}
