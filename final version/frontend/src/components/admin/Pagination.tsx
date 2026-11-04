import { Link } from '@/lib/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** Extra query params to preserve (e.g. { search: 'ali' }) */
  extraParams?: Record<string, string>;
}

function buildHref(basePath: string, page: number, extra?: Record<string, string>) {
  const params = new URLSearchParams(extra);
  params.set('page', String(page));
  return `${basePath}?${params.toString()}`;
}

export function Pagination({ currentPage, totalPages, basePath, extraParams }: Props) {
  if (totalPages <= 1) return null;

  const prev = currentPage - 1;
  const next = currentPage + 1;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(basePath, prev, extraParams)}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-300">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      )}

      {/* Page indicator */}
      <span className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-800">{currentPage}</span> of{' '}
        <span className="font-semibold text-gray-800">{totalPages}</span>
      </span>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(basePath, next, extraParams)}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-300">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}
