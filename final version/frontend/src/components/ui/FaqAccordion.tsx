'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map(({ q, a }, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-6 p-6 text-start"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span
              className={`display text-base transition-colors duration-200 ${
                open === i ? 'text-[#0D9488]' : 'text-ink'
              }`}
            >
              {q}
            </span>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600 transition-transform duration-300 ${
                open === i ? 'rotate-45' : 'rotate-0'
              }`}
            >
              <Plus className="h-4 w-4" />
            </span>
          </button>

          {/* CSS grid-rows trick: 0fr → 1fr animates height smoothly */}
          <div
            className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mx-6 h-px bg-slate-100" />
              <p className="px-6 pb-6 pt-4 text-sm leading-relaxed text-ink-muted">{a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
