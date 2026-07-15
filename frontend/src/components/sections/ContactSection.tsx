'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, MapPin, Phone, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/config/site-config';

const fieldClass = [
  'w-full rounded-2xl border border-sand-200 bg-sand-50 px-4 py-3.5 text-sm text-ink',
  'placeholder:text-ink-muted/70 outline-none',
  'transition-all duration-200',
  'focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100',
].join(' ');

const labelClass = 'block mb-2 text-xs font-bold uppercase tracking-wider text-ink-soft';

export function ContactSection() {
  const t = useTranslations('common');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return; // prevent duplicate submissions

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string | null)?.trim() ?? '';
    const message = (formData.get('message') as string | null)?.trim() ?? '';

    if (!name || !message) return; // rely on browser required validation

    setStatus('sending');
    setServerError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: (formData.get('email') as string | null)?.trim() ?? '',
          phone: '',
          message,
          _hp: formData.get('_hp') ?? '',
        }),
      });

      if (res.ok) {
        setStatus('success');
        formRef.current?.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(data?.errors?.server ?? t('error'));
        setStatus('error');
      }
    } catch {
      setServerError(t('error'));
      setStatus('error');
    }
  }

  return (
    <section className="container mx-auto py-20">
      <div className="card overflow-hidden grid lg:grid-cols-5">

        {/* Left info panel */}
        <div className="relative overflow-hidden lg:col-span-2 bg-brand-950 p-8 lg:p-10 text-brand-100/80">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -end-10 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -start-10 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />
          </div>
          <div className="relative">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
              <span className="inline-block h-px w-10 bg-brand-400" /> {t('contact.title')}
            </span>
            <h2 className="display text-display-xs mt-4 text-white">{t('contact.title')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-100/70">{t('contact.successSub')}</p>

            <div className="mt-10 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-brand-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1.5">{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-brand-300">
                  <Phone className="h-4 w-4" />
                </span>
                <a href={`tel:${siteConfig.contact.phone}`} className="transition-colors hover:text-white" dir="ltr">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 border border-white/10 text-brand-300">
                  <Mail className="h-4 w-4" />
                </span>
                <a href={`mailto:${siteConfig.contact.email}`} className="transition-colors hover:text-white break-all" dir="ltr">
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lg:col-span-3 p-8 lg:p-10">
          {status === 'success' ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50">
                <CheckCircle className="h-8 w-8 text-brand-500" />
              </span>
              <p className="display text-xl text-ink mt-6">{t('contact.success')}</p>
              <p className="text-ink-muted text-sm mt-2">{t('contact.successSub')}</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Honeypot — hidden from humans, filled by bots */}
              <input
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none' }}
              />

              <div>
                <label htmlFor="cs-name" className={labelClass}>{t('contact.name')}</label>
                <input id="cs-name" type="text" name="name" required
                       placeholder={t('contact.namePlaceholder')} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="cs-email" className={labelClass}>{t('contact.email')}</label>
                <input id="cs-email" type="email" name="email"
                       placeholder={t('contact.emailPlaceholder')} className={fieldClass} dir="ltr" />
              </div>
              <div>
                <label htmlFor="cs-message" className={labelClass}>{t('contact.message')}</label>
                <textarea id="cs-message" name="message" required rows={5}
                          placeholder={t('contact.messagePlaceholder')}
                          className={`${fieldClass} resize-none`} />
              </div>

              {/* Server / network error banner */}
              {status === 'error' && (
                <div className="flex items-center gap-2 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {serverError}
                </div>
              )}

              <button type="submit" disabled={status === 'sending'}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {status === 'sending' ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('loading')}
                  </>
                ) : (
                  <>
                    {t('contact.submit')}
                    <ArrowRight className="h-4 w-4 flip-x" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
