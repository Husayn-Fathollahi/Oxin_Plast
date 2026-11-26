import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, messageCount] = await Promise.all([
    getTranslations({ locale, namespace: 'admin.dashboard' }),
    prisma.message.count(),
  ]);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">{t('title')}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label={t('cards.products')} value={0} />
        <StatCard label={t('cards.messages')} value={messageCount} />
        <StatCard label={t('cards.visits')} value={0} />
      </div>
    </div>
  );
}
