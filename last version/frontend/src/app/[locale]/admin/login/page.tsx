'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) ?? 'fa';
  const isEn = locale === 'en';
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(`/${locale}/admin`);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? (isEn ? 'Login failed' : 'ورود ناموفق بود'));
      }
    } catch {
      setError(isEn ? 'Network error. Please try again.' : 'خطای شبکه. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    'w-full rounded-2xl border border-sand-200 bg-sand-50 ps-11 pe-4 py-3.5 text-sm text-ink ' +
    'placeholder-ink-muted/70 transition-all duration-200 ' +
    'focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400';

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-sand-50">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-brand-950 p-12 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -start-16 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 -end-16 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl animate-float" />
        </div>
        <div className="relative flex items-center gap-3">
          <span aria-hidden className="grid h-11 w-11 place-items-center rounded-2xl text-white bg-brand-gradient shadow-glow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" />
            </svg>
          </span>
          <span className="display text-lg">Oxin Plast</span>
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> {isEn ? 'Admin Console' : 'پنل مدیریت'}
          </span>
          <h2 className="display text-display-sm mt-4 text-white">
            {isEn ? <>Manage your<br /><span className="text-brand-300">platform with ease</span></>
                  : <>مدیریت آسان<br /><span className="text-brand-300">پلتفرم شما</span></>}
          </h2>
          <p className="mt-4 max-w-sm text-brand-100/70 leading-relaxed">
            {isEn ? 'Secure access to products, articles, and customer messages in one place.'
                  : 'دسترسی امن به محصولات، مقالات و پیام‌های مشتریان در یک مکان.'}
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-sm text-brand-100/60">
          <ShieldCheck className="h-4 w-4 text-brand-300" />
          {isEn ? 'Protected by encrypted authentication' : 'محافظت‌شده با احراز هویت رمزنگاری‌شده'}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-2xl text-white bg-brand-gradient shadow-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" />
              </svg>
            </span>
            <span className="display text-base text-ink">Plastic Company</span>
          </div>

          <div className="chip mb-5">
            <Lock className="h-3.5 w-3.5" /> {isEn ? 'Secure Login' : 'ورود امن'}
          </div>
          <h1 className="display text-3xl text-ink">{isEn ? 'Welcome back' : 'خوش آمدید'}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {isEn ? 'Sign in to access the admin dashboard.' : 'برای دسترسی به پنل مدیریت وارد شوید.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                {isEn ? 'Username' : 'نام کاربری'}
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input id="username" name="username" type="text" required autoComplete="username"
                       placeholder={isEn ? 'admin' : 'نام کاربری'} className={inputBase} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink-soft">
                {isEn ? 'Password' : 'رمز عبور'}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input id="password" name="password" type="password" required autoComplete="current-password"
                       placeholder="••••••••" className={inputBase} dir="ltr" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-coral-200 bg-coral-50 px-4 py-3 text-sm text-coral-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? (isEn ? 'Please wait...' : 'لطفاً صبر کنید...') : (isEn ? 'Sign In' : 'ورود')}
              {!loading && <ArrowRight className="h-4 w-4 flip-x" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
