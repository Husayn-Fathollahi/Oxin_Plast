/**
 * Root layout — intentionally minimal.
 *
 * next-intl requires <html lang> and <body> to live inside [locale]/layout.tsx
 * so that locale and text-direction attributes are set correctly per locale.
 * Next.js 15 + React 19 allow the root layout to return children directly;
 * the actual <html> and <body> tags are rendered by the locale layout below.
 *
 * Global styles are imported here (not only in [locale]/layout.tsx) so that the
 * root-level not-found.tsx — which renders its own <html>/<body> for locale-less
 * 404s — also receives the Tailwind/design-system stylesheet.
 */
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}


