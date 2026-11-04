/**
 * Typed navigation utilities for next-intl v3.
 *
 * Import `Link`, `usePathname`, `useRouter`, and `redirect` from HERE
 * instead of `next/link` or `next/navigation` to get automatic locale-prefix
 * handling (e.g. /fa/products instead of /products).
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
