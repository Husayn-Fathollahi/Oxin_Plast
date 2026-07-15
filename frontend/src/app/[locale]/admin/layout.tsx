import { rtlLocales } from '@/lib/i18n/locales';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = (rtlLocales as string[]).includes(locale);

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-100 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar locale={locale} isRtl={isRtl} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
