import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { siteConfig } from '@/config/site-config';

export async function Footer() {
  const t = await getTranslations('common');

  const quickLinks = [
    { key: 'nav.home',     href: '/'         },
    { key: 'nav.products', href: '/products' },
    { key: 'nav.blog',     href: '/blog'     },
    { key: 'nav.catalog',  href: '/catalog'  },
    { key: 'nav.about',    href: '/about'    },
    { key: 'nav.contact',  href: '/contact'  },
  ] as const;

  const productLinks = [
    { label: 'ظروف آشپزخانه و پذیرایی', href: '/products/category/kitchenware'         },
    { label: 'کلمن و محصولات برودتی',   href: '/products/category/cooling-storage'     },
    { label: 'گالن و مخازن صنعتی',      href: '/products/category/industrial-gallons'  },
    { label: 'بشکه‌های پلی‌اتیلن',       href: '/products/category/bulk-barrels'        },
    { label: 'لوازم بهداشتی و جانبی',    href: '/products/category/home-accessories'    },
  ];

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100/70">
      {/* decorative glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -start-16 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute -bottom-24 end-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      {/* top accent line */}
      <div className="h-1 w-full bg-brand-gradient" />

      <div className="container mx-auto relative pt-16 pb-8">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-16">

          {/* Col 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-3">
              <span aria-hidden className="grid h-10 w-10 place-items-center rounded-2xl text-white bg-brand-gradient shadow-glow transition-transform duration-300 group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7l9-4 9 4-9 4-9-4z" />
                  <path d="M3 7v10l9 4 9-4V7" />
                  <path d="M12 11v10" />
                </svg>
              </span>
              <span className="display text-lg text-white">{siteConfig.name}</span>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs">{t('footer.desc')}</p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              {['ISO 9001', 'ISIRI', 'UN'].map((c) => (
                <span key={c} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-bold text-brand-200">
                  {c}
                </span>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 text-xs font-bold text-brand-100 transition-colors hover:bg-white/10 hover:text-white">
                IG
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                 className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 text-xs font-bold text-brand-100 transition-colors hover:bg-white/10 hover:text-white">
                LN
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="display text-sm uppercase tracking-wider text-white mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ key, href }) => (
                <li key={href}>
                  <Link href={href} className="group inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white">
                    {t(key)}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 flip-x" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Products */}
          <div>
            <h3 className="display text-sm uppercase tracking-wider text-white mb-6">{t('footer.products')}</h3>
            <ul className="space-y-3">
              {productLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href as '/'} className="group inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white">
                    {label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 flip-x" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="display text-sm uppercase tracking-wider text-white mb-6">{t('footer.contactInfo')}</h3>
            <address className="not-italic space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-brand-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1.5">{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-brand-300">
                  <Phone className="h-4 w-4" />
                </span>
                <a href={`tel:${siteConfig.contact.phone}`} className="transition-colors hover:text-white" dir="ltr">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-brand-300">
                  <Mail className="h-4 w-4" />
                </span>
                <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-white break-all" dir="ltr">
                  {siteConfig.contact.email}
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px w-full bg-white/10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-100/50">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. {t('footer.rights')}.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="transition-colors hover:text-white">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
