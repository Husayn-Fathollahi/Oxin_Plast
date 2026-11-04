'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary — catches unhandled errors in the route tree.
 * Must be a Client Component (Next.js requirement).
 */
export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // TODO: send to error tracking service (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-3xl font-semibold text-gray-900">Something went wrong</h2>
      <p className="text-gray-500">{error.message ?? 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  );
}
