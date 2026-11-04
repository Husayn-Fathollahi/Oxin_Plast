'use client';

import { useParams, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton({ isRtl }: { isRtl?: boolean }) {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'fa';
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white ${
        isRtl ? 'flex-row-reverse' : ''
      }`}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span>Logout</span>
    </button>
  );
}
