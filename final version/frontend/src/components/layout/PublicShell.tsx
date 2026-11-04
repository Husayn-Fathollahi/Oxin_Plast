import { GlassSidebar } from '@/components/layout/GlassSidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Footer } from '@/components/layout/footer';
import { FloatingWhatsAppButton } from '@/components/common/FloatingWhatsAppButton';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-[#F8FAFC]">
      <MobileHeader />
      <GlassSidebar />
      <div className="lg:ps-[4.75rem]">
        <main className="min-h-[70svh]">{children}</main>
        <Footer />
      </div>
      <FloatingWhatsAppButton />
    </div>
  );
}
