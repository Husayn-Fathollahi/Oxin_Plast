import Image from 'next/image';
import { siteConfig } from '@/config/site-config';

export function BrandLogo() {
  return (
    <Image
      src="/images/logo/logo.webp"
      alt={siteConfig.name}
      height={36}
      width={180}
      priority
      className="h-9 w-auto object-contain"
    />
  );
}
