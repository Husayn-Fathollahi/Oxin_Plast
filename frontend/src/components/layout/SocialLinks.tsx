import {
  Camera,
  Send,
  MessageCircle,
  MessagesSquare,
  MessageSquare,
  Contact,
  type LucideIcon,
} from 'lucide-react';
import { siteConfig } from '@/config/site-config';

interface SocialItem {
  key: string;
  href: string | null;
  Icon: LucideIcon;
  label: string;
}

// Bale and LinkedIn are intentionally null (unconfirmed / not provided) and render disabled.
// lucide-react 1.17.0 has no brand icons, so recognizable generic icons are used.
const items: SocialItem[] = [
  { key: 'instagram', href: siteConfig.social.instagram, Icon: Camera, label: 'Instagram' },
  { key: 'telegram', href: siteConfig.social.telegram, Icon: Send, label: 'Telegram' },
  { key: 'rubika', href: siteConfig.social.rubika, Icon: MessagesSquare, label: 'Rubika' },
  { key: 'whatsapp', href: siteConfig.social.whatsapp, Icon: MessageCircle, label: 'WhatsApp' },
  { key: 'bale', href: siteConfig.social.bale, Icon: MessageSquare, label: 'Bale' },
  { key: 'linkedin', href: siteConfig.social.linkedin, Icon: Contact, label: 'LinkedIn' },
];

export function SocialLinks({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const base = 'grid h-10 w-10 place-items-center rounded-full border transition-colors';
  const enabledCls =
    tone === 'dark'
      ? 'bg-white/5 border-white/10 text-brand-100 hover:bg-white/10 hover:text-white'
      : 'bg-sand-100 border-sand-200 text-ink-soft hover:bg-brand-50 hover:text-brand-700';
  const disabledCls =
    tone === 'dark'
      ? 'bg-white/5 border-white/10 text-brand-100/30 cursor-not-allowed'
      : 'bg-sand-100 border-sand-200 text-ink-muted/40 cursor-not-allowed';

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map(({ key, href, Icon, label }) =>
        href ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={`${base} ${enabledCls}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        ) : (
          <span
            key={key}
            aria-label={`${label} (coming soon)`}
            title={`${label} — coming soon`}
            aria-disabled="true"
            className={`${base} ${disabledCls}`}
          >
            <Icon className="h-4 w-4" />
          </span>
        ),
      )}
    </div>
  );
}
