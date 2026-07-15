import type { Metadata } from 'next';
import { Inter, Vazirmatn, Playfair_Display, Sora } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';
import { rtlLocales } from '@/lib/i18n/locales';
import '../../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
});
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'اکسین پلاست',
    template: '%s | اکسین پلاست',
  },
  description: 'تولیدکننده قطعات پلاستیکی صنعتی — محصولات با کیفیت از ۱۳۶۹.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://plasticcompany.ir'),
  icons: {
    icon: '/image/logo/icon.png',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isRtl = (rtlLocales as string[]).includes(locale);

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${vazirmatn.variable} ${sora.variable} ${playfair.variable}`}
    >
      <body className="antialiased bg-sand-50 text-ink">
        <NextTopLoader
          color="#0FBF88"
          height={3}
          showSpinner={false}
          shadow="0 0 12px #0FBF88"
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

