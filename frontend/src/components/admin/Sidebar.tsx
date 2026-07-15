'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { LayoutDashboard, Package, MessageSquare, Newspaper } from 'lucide-react';
import { LogoutButton } from './LogoutButton';

interface SidebarProps {
  locale: string;
  isRtl: boolean;
}

export function Sidebar({ locale, isRtl }: SidebarProps) {
  const t = useTranslations('admin.sidebar');
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/products', label: t('products'), icon: Package },
    { href: '/admin/messages', label: t('messages'), icon: MessageSquare },
    { href: '/admin/blog', label: t('blog'), icon: Newspaper },
  ];

  return (
    <aside
      className={`flex h-full w-56 flex-col bg-gray-900 text-gray-100 ${
        isRtl ? 'border-l border-gray-700' : 'border-r border-gray-700'
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex h-14 items-center px-4 text-lg font-semibold tracking-wide">
        Admin
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isRtl ? 'flex-row-reverse text-right' : ''
              } ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700 px-2 py-3">
        <LogoutButton isRtl={isRtl} />
      </div>
    </aside>
  );
}
