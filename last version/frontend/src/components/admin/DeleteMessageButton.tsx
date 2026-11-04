'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { Trash2 } from 'lucide-react';

interface Props {
  messageId: string;
  /** If true, redirects to list after deletion. Otherwise refreshes in place. */
  redirectAfterDelete?: boolean;
}

export function DeleteMessageButton({ messageId, redirectAfterDelete = false }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this message? This action cannot be undone.');
    if (!confirmed) return;

    setError(null);
    const res = await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });

    if (res.ok) {
      startTransition(() => {
        if (redirectAfterDelete) {
          router.push('/dashboard/messages');
        } else {
          router.refresh();
        }
      });
    } else {
      setError('Failed to delete. Please try again.');
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {isPending ? 'Deleting…' : 'Delete'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
