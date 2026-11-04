'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, BookOpen, MessageSquare } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({ id, label, required, error, icon, children }: FieldProps) {
  return (
    <div className="group flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-bold text-ink-soft"
      >
        <span className="text-ink-muted transition-colors group-focus-within:text-brand-500">
          {icon}
        </span>
        {label}
        {required && <span className="text-coral-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-coral-600">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full rounded-2xl border bg-sand-50 px-4 py-3 text-sm text-ink placeholder-ink-muted/70 ' +
  'transition-all duration-200 ' +
  'focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400 ';

export function ContactForm() {
  const t = useTranslations('contact');
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'server', string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) newErrors.name = t('validation.nameRequired');
    if (!form.phone.trim()) newErrors.phone = t('validation.phoneRequired');
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      newErrors.email = t('validation.emailInvalid');
    if (!form.message.trim()) newErrors.message = t('validation.messageRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setErrors({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _hp: '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Spread server field errors (name/email/message/phone) back into form
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
        }
        setStatus('error');
        return;
      }
      setStatus('success');
      setForm(initialState);
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <CheckCircle className="h-8 w-8 text-brand-500" />
        </div>
        <div>
          <h3 className="display text-lg text-ink">{t('form.successTitle')}</h3>
          <p className="mt-1 text-sm text-ink-muted">{t('form.successMessage')}</p>
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 rounded-full border border-sand-300 px-5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand-50"
        >
          {t('form.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot — hidden from humans, filled by bots */}
      <input
        type="text"
        name="_hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      {/* Row: Name + Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label={t('form.name')}
          required
          error={errors.name}
          icon={<User className="h-3.5 w-3.5" />}
        >
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder={t('form.namePlaceholder')}
            className={inputBase + (errors.name ? 'border-coral-400 bg-coral-50' : 'border-sand-200')}
          />
        </Field>

        <Field
          id="email"
          label={t('form.email')}
          error={errors.email}
          icon={<Mail className="h-3.5 w-3.5" />}
        >
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder={t('form.emailPlaceholder')}
            className={inputBase + (errors.email ? 'border-coral-400 bg-coral-50' : 'border-sand-200')}
          />
        </Field>
      </div>

      {/* Row: Phone + Subject */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label={t('form.phone')}
          required
          error={errors.phone}
          icon={<Phone className="h-3.5 w-3.5" />}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder={t('form.phonePlaceholder')}
            className={inputBase + (errors.phone ? 'border-coral-400 bg-coral-50' : 'border-sand-200')}
          />
        </Field>

        <Field
          id="subject"
          label={t('form.subject')}
          icon={<BookOpen className="h-3.5 w-3.5" />}
        >
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder={t('form.subjectPlaceholder')}
            className={inputBase + 'border-sand-200'}
          />
        </Field>
      </div>

      {/* Message */}
      <Field
        id="message"
        label={t('form.message')}
        required
        error={errors.message}
        icon={<MessageSquare className="h-3.5 w-3.5" />}
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder={t('form.messagePlaceholder')}
          className={
            inputBase +
            'resize-none leading-relaxed ' +
            (errors.message ? 'border-coral-400 bg-coral-50' : 'border-sand-200')
          }
        />
        <p className="text-right text-xs text-ink-muted">{form.message.length} / 1000</p>
      </Field>

      {/* Error banner — only shown for server/network errors without field-level detail */}
      {status === 'error' && !errors.name && !errors.email && !errors.message && !errors.phone && (
        <div className="flex items-center gap-2 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errors.server ?? t('form.errorMessage')}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('form.sending')}
          </>
        ) : (
          <>
            <Send className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            {t('form.submit')}
          </>
        )}
      </button>
    </form>
  );
}
