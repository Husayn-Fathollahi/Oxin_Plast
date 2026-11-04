import { getTranslations } from 'next-intl/server';
import { Shield, Award, Truck } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

/**
 * MainContent — Server Component.
 * Renders two sections that appear below the Hero:
 *   1. Features  — 3 glassmorphism cards with lucide icons
 *   2. Products  — 3 product cards with placeholder images from Unsplash
 *
 * Images use <img> intentionally (temporary placeholders).
 * Replace with next/image + add the hostname to next.config remotePatterns
 * once real product photos are available.
 */
export async function MainContent() {
  const t = await getTranslations('home');

  const features = [
    {
      icon: Shield,
      title: t('features.item1.title'),
      desc: t('features.item1.desc'),
    },
    {
      icon: Award,
      title: t('features.item2.title'),
      desc: t('features.item2.desc'),
    },
    {
      icon: Truck,
      title: t('features.item3.title'),
      desc: t('features.item3.desc'),
    },
  ];

  const products = [
    {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75&fit=crop',
      title: t('products.item1.title'),
      category: t('products.item1.category'),
      href: '/products/pipes',
    },
    {
      src: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=75&fit=crop',
      title: t('products.item2.title'),
      category: t('products.item2.category'),
      href: '/products/fittings',
    },
    {
      src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=75&fit=crop',
      title: t('products.item3.title'),
      category: t('products.item3.category'),
      href: '/products',
    },
  ];

  return (
    <>
      {/* ─── Features Section ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t('features.title')}
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:shadow-md"
              >
                {/* Icon badge */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
                  <Icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Products Section ─────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            {t('products.title')}
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {products.map(({ src, title, category, href }) => (
              <Link
                key={title}
                href={href as '/'}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Product image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Card body */}
                <div className="p-4">
                  <span className="text-xs font-medium text-brand-600">{category}</span>
                  <h3 className="mt-1 text-base font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* View all CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-6 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              {t('products.viewAll')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
