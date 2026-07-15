/**
 * This file is intentionally kept for compatibility but is not the active
 * 404 handler. Next.js App Router only recognises not-found.tsx files placed
 * directly inside a non-route-group segment. The real 404 handlers are:
 *   - src/app/not-found.tsx           (root fallback)
 *   - src/app/[locale]/not-found.tsx  (locale-aware handler)
 *
 * Calling notFound() here re-throws the NEXT_NOT_FOUND signal so it bubbles
 * up to the nearest real not-found boundary.
 */
import { notFound } from 'next/navigation';

export default function PublicGroupNotFound() {
  notFound();
}
