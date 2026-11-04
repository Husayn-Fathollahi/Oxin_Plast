/**
 * Root-level not-found page.
 *
 * Catches 404s before locale routing resolves. Renders its own <html>/<body>
 * because the root layout only returns children without a document shell.
 * globals.css is imported directly so Tailwind is included in this bundle.
 * Inline styles on <body> act as a guaranteed fallback if CSS ever fails to load.
 */
import { NotFoundView } from '@/components/common/not-found-view';
import '../styles/globals.css';

export default function RootNotFound() {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Suppress the favicon 500 error — no favicon.ico exists in /public yet */}
        <link rel="icon" href="data:," />
      </head>
      <body
        className="bg-sand-50 text-ink"
        style={{ margin: 0, padding: 0, minHeight: '100vh' }}
      >
        <NotFoundView locale="fa" />
      </body>
    </html>
  );
}

