import { prisma } from '@/lib/prisma';
import { Link } from '@/lib/i18n/navigation';
import { DeleteMessageButton } from '@/components/admin/DeleteMessageButton';
import { Pagination } from '@/components/admin/Pagination';

// Always fetch fresh data — never serve a cached version
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search: searchParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const search = searchParam?.trim() || undefined;
  const skip = (page - 1) * PAGE_SIZE;

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : undefined;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        readStatus: true,
        createdAt: true,
      },
    }),
    prisma.message.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginationExtra = search ? { search } : undefined;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
          {search && (
            <p className="mt-0.5 text-sm text-gray-500">
              Showing results for:{' '}
              <span className="font-medium text-gray-700">&ldquo;{search}&rdquo;</span>
            </p>
          )}
        </div>
        {total > 0 && (
          <span className="text-sm text-gray-500">{total} total</span>
        )}
      </div>

      {/* Search form */}
      <form method="GET" className="mb-5">
        <div className="flex gap-2">
          <input
            type="search"
            name="search"
            defaultValue={search ?? ''}
            placeholder="Search by name or email…"
            className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Search
          </button>
          {search && (
            <Link
              href="/admin/messages"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {messages.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <p className="text-gray-400">
            {search ? `No messages found for "${search}".` : 'No messages yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={msg.readStatus ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    <Link
                      href={`/admin/messages/${msg.id}`}
                      className={`hover:text-blue-600 hover:underline ${msg.readStatus ? 'font-normal' : 'font-semibold'}`}
                    >
                      {msg.name}
                    </Link>
                    {!msg.readStatus && (
                      <span className="ms-2 inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        New
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {msg.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(msg.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {msg.readStatus ? (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Read
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        New
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <DeleteMessageButton messageId={msg.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/admin/messages"
            extraParams={paginationExtra}
          />
        </div>
      )}
    </div>
  );
}
