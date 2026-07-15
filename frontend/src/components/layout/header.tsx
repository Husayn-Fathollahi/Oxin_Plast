import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Nav } from './nav';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitcher } from './LanguageSwitcher';

/**
 * Floating glass header on a light canvas.
 * Logo mark + wordmark, primary nav, language switcher, and a quote CTA.
 */
export async function Header() {
  const t = await getTranslations('common');

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-sand-50/80 backdrop-blur-xl border-b border-sand-200/70">
        <div className="container mx-auto flex h-[72px] items-center justify-between gap-6">

          {/* Logo mark + wordmark */}
          <Link href="/" className="group flex items-center gap-3">
            <BrandLogo />
          </Link>

          <Nav quoteLabel={t('nav.contact')} />

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/contact" className="btn-primary hidden lg:inline-flex px-5 py-2.5 text-xs">
              {t('contact.submit')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


