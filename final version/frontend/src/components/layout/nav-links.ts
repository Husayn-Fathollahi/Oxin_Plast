export const PUBLIC_NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  { key: 'catalog', href: '/catalog' },
  { key: 'blog', href: '/blog' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const;

export type PublicNavKey = (typeof PUBLIC_NAV_LINKS)[number]['key'];

export function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${href}/`);
}
