'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { CheckCheck } from 'lucide-react';

interface Props {
  messageId: string;
  isRead: boolean;
}

export function MarkAsReadButton({ messageId, isRead }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(isRead);

  async function handleClick() {
    if (done) return;
    const res = await fetch(`/api/messages/${messageId}/read`, {
      method: 'PATCH',
    });
    if (res.ok) {
      setDone(true);
      startTransition(() => {
        router.refresh();
      });
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
        <CheckCheck className="h-3.5 w-3.5" />
        Read
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
    >
      <CheckCheck className="h-3.5 w-3.5" />
      {isPending ? 'Marking…' : 'Mark as Read'}
    </button>
  );
}
