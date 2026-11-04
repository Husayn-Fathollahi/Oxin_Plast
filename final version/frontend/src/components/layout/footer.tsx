import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { siteConfig } from '@/config/site-config';
import { BrandLogo } from '@/components/layout/BrandLogo';

export async function Footer() {
  const t = await getTranslations('common');

  const quickLinks = [
    { key: 'nav.products', href: '/products' },
    { key: 'nav.catalog',  href: '/catalog'  },
    { key: 'nav.about',    href: '/about'    },
    { key: 'nav.contact',  href: '/contact'  },
  ] as const;

  const productLinks = [
    { key: 'footer.cat_pedalHome',    href: '/products' },
    { key: 'footer.cat_pedalHygiene', href: '/products' },
    { key: 'footer.cat_picnic',       href: '/products' },
    { key: 'footer.cat_custom',       href: '/products' },
  ] as const;

  return (
    <footer className="border-t border-slate-200 bg-white">

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="container mx-auto py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 — Brand */}
          <div className="space-y-5">
            <Link href="/" className="group inline-flex items-center gap-3">
              <BrandLogo />
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              {t('footer.desc')}
            </p>

            <p className="text-xs font-medium tracking-wide text-slate-400">
              {siteConfig.legalName}
            </p>

            {/* Certification badges — no colour, just crisp border */}
            <div className="flex flex-wrap gap-1.5">
              {['Food Grade PP', 'ISO 9001', 'ضمانت کیفیت'].map((badge) => (
                <span
                  key={badge}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-slate-900">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ key, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#1E5E63]"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 flip-x" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Product categories */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-slate-900">
              {t('footer.productCategories')}
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#1E5E63]"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 flip-x" />
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-slate-900">
              {t('footer.contactInfo')}
            </h3>
            <address className="not-italic space-y-3 text-sm text-slate-500">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  dir="ltr"
                  className="transition-colors hover:text-[#1E5E63]"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  dir="ltr"
                  className="break-all transition-colors hover:text-[#1E5E63]"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>{t('footer.workingHoursValue')}</span>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div className="border-t border-slate-100">
        <div className="container mx-auto py-5">
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {siteConfig.legalName}.{' '}
              {t('footer.rights')}.
            </p>
            <p className="tracking-widest">{t('footer.tagline')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
