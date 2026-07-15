import { notFound } from 'next/navigation';
import { ArrowRight, Mail, User, Phone, Calendar, MessageSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Link } from '@/lib/i18n/navigation';
import { MarkAsReadButton } from '@/components/admin/MarkAsReadButton';
import { DeleteMessageButton } from '@/components/admin/DeleteMessageButton';

export const dynamic = 'force-dynamic';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;

  const msg = await prisma.message.findUnique({ where: { id } });

  if (!msg) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        href="/admin/messages"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        Back to Messages
      </Link>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{msg.name}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{msg.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {msg.readStatus ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Read
              </span>
            ) : (
              <MarkAsReadButton messageId={msg.id} isRead={msg.readStatus} />
            )}
            <DeleteMessageButton messageId={msg.id} redirectAfterDelete />
          </div>
        </div>

        {/* Details */}
        <dl className="divide-y divide-gray-50 px-6 py-2">
          <Detail icon={<User className="h-4 w-4" />} label="Name">
            {msg.name}
          </Detail>
          <Detail icon={<Mail className="h-4 w-4" />} label="Email">
            <a
              href={`mailto:${msg.email}`}
              className="text-blue-600 hover:underline"
            >
              {msg.email}
            </a>
          </Detail>
          {msg.phone && (
            <Detail icon={<Phone className="h-4 w-4" />} label="Phone">
              <a href={`tel:${msg.phone}`} className="text-blue-600 hover:underline">
                {msg.phone}
              </a>
            </Detail>
          )}
          <Detail icon={<Calendar className="h-4 w-4" />} label="Received">
            {formatDate(msg.createdAt)}
          </Detail>
        </dl>

        {/* Message body */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <MessageSquare className="h-4 w-4" />
            Message
          </div>
          <div className="mt-3 rounded-xl bg-gray-50 px-5 py-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {msg.message}
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-medium text-gray-400">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-gray-700">{children}</dd>
      </div>
    </div>
  );
}
