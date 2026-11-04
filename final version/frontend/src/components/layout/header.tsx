'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  X,
  ChevronDown,
  ArrowUpRight,
  PhoneCall,
  FileText,
  Globe,
} from 'lucide-react';

type MenuItem = {
  id: string;
  label: string;
  href: string;
  sections?: {
    title: string;
    links: { label: string; href: string }[];
  }[];
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'products',
    label: 'محصولات',
    href: '/products',
    sections: [
      {
        title: 'دسته‌بندی‌های اصلی',
        links: [
          { label: 'سطل‌های پدالی و زباله', href: '/products/pedal-bins' },
          { label: 'ظروف آشپزخانه و نگهداری', href: '/products/kitchenware' },
          { label: 'سبد، فایل و نظم‌دهنده‌ها', href: '/products/baskets' },
          { label: 'محصولات صنعتی و فله', href: '/products/industrial' },
        ],
      },
      {
        title: 'دسترسی سریع',
        links: [
          { label: 'مشاهده کل کاتالوگ', href: '/products' },
          { label: 'جدیدترین تولیدات', href: '/products/new' },
          { label: 'استعلام قیمت عمده', href: '/contact' },
        ],
      },
    ],
  },
  {
    id: 'manufacturing',
    label: 'کارخانه و کیفیت',
    href: '/manufacturing',
    sections: [
      {
        title: 'فناوری تولید',
        links: [
          { label: 'تزریق پلاستیک پیشرفته', href: '/manufacturing/technology' },
          { label: 'کنترل کیفیت مواد اولیه', href: '/manufacturing/quality-control' },
          { label: 'آزمایشگاه و استانداردها', href: '/manufacturing/standards' },
        ],
      },
      {
        title: 'زیرساخت',
        links: [
          { label: 'انبارداری و لجستیک', href: '/manufacturing/logistics' },
          { label: 'بسته‌بندی و ارسال', href: '/manufacturing/packaging' },
        ],
      },
    ],
  },
  {
    id: 'agencies',
    label: 'نمایندگی‌ها',
    href: '/agencies',
    sections: [
      {
        title: 'فروش و همکاران',
        links: [
          { label: 'شرایط اخذ نمایندگی', href: '/agencies/apply' },
          { label: 'لیست عاملیت‌های فروش', href: '/agencies/list' },
          { label: 'ثبت سفارش عمده', href: '/contact' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'درباره ما',
    href: '/about',
    sections: [
      {
        title: 'سلمان پلاستیک',
        links: [
          { label: 'درباره کارخانه', href: '/about' },
          { label: 'گواهینامه‌ها و افتخارات', href: '/about/certificates' },
          { label: 'تماس با کارخانه', href: '/contact' },
        ],
      },
    ],
  },
];

export function HeaderComponent() {
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // تشخیص زبان فعلی از روی URL (فرض بر ساختار /fa/, /en/, /ar/)
  const currentLocale = useMemo(() => {
    if (!pathname) return 'fa';
    const segments = pathname.split('/');
    if (['fa', 'en', 'ar'].includes(segments[1])) {
      return segments[1];
    }
    return 'fa';
  }, [pathname]);

  // تابع تغییر زبان و انتقال به روت جدید
  const handleLanguageChange = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    if (['fa', 'en', 'ar'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const activeItem = useMemo(
    () => MENU_ITEMS.find((item) => item.id === activeMenu) ?? null,
    [activeMenu]
  );

  const overlayOpen = (!!activeMenu || searchOpen) && !mobileOpen;

  return (
    <>
      {/* Global blur overlay for desktop */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              setActiveMenu(null);
              setSearchOpen(false);
            }}
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <header
        dir={currentLocale === 'ar' ? 'rtl' : currentLocale === 'en' ? 'ltr' : 'rtl'}
        className={[
          'fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 font-sans',
          mobileOpen
            ? 'bg-white'
            : isScrolled
            ? 'border-b border-slate-200/80 bg-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-2xl'
            : 'border-b border-slate-200/60 bg-white/95 backdrop-blur-md',
        ].join(' ')}
      >
        {/* Top Navbar Row */}
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href={`/${currentLocale}`}
            onClick={() => {
              setMobileOpen(false);
              setActiveMenu(null);
            }}
            className="group flex shrink-0 items-center gap-3"
            aria-label="سلمان پلاستیک"
          >
            <div className="relative flex h-10 w-auto items-center overflow-hidden">
              <Image
                src="/images/logo/logo.webp"
                alt="سلمان پلاستیک"
                width={140}
                height={36}
                priority
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {MENU_ITEMS.map((item) => {
              const opened = activeMenu === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveMenu((prev) => (prev === item.id ? null : item.id));
                  }}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-medium transition-all duration-200',
                    opened
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                  ].join(' ')}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={[
                      'h-3.5 w-3.5 text-slate-400 transition-transform duration-300',
                      opened ? 'rotate-180 text-slate-950' : '',
                    ].join(' ')}
                  />
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions & Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => {
                setActiveMenu(null);
                setSearchOpen((prev) => !prev);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-950"
            >
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-[13px] font-medium">جستجو</span>
            </button>

            {/* Clean Inline Language Switcher (FA / EN / AR) */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-500">
              <Globe className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
              {(['fa', 'en', 'ar'] as const).map((lang, idx) => (
                <span key={lang} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    className={[
                      'transition-colors uppercase px-1.5 py-0.5 rounded cursor-pointer',
                      currentLocale === lang
                        ? 'text-[#164E53] font-bold bg-teal-50'
                        : 'text-slate-400 hover:text-slate-700',
                    ].join(' ')}
                  >
                    {lang}
                  </button>
                  {idx < 2 && <span className="text-slate-300 mx-0.5">/</span>}
                </span>
              ))}
            </div>

            {/* Quote CTA Button */}
            <Link
              href={`/${currentLocale}/contact`}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#164E53] px-5 text-[13px] font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#113C40]"
            >
              <PhoneCall className="h-4 w-4 text-teal-200" />
              استعلام قیمت عمده
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile compact language toggle */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              {(['fa', 'en', 'ar'] as const).map((lang, idx) => (
                <span key={lang} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    className={[
                      'transition-colors uppercase px-1',
                      currentLocale === lang
                        ? 'text-[#164E53] font-bold'
                        : 'text-slate-400',
                    ].join(' ')}
                  >
                    {lang}
                  </button>
                  {idx < 2 && <span className="text-slate-300 mx-0.5">/</span>}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileOpen((prev) => !prev);
                setActiveMenu(null);
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              <div className="flex h-4 w-5 flex-col justify-between">
                <span
                  className={[
                    'h-[2px] w-full rounded-full bg-slate-950 transition-all duration-300 ease-out',
                    mobileOpen ? 'translate-y-[7px] rotate-45' : '',
                  ].join(' ')}
                />
                <span
                  className={[
                    'h-[2px] w-full rounded-full bg-slate-950 transition-all duration-200',
                    mobileOpen ? 'opacity-0' : 'opacity-100',
                  ].join(' ')}
                />
                <span
                  className={[
                    'h-[2px] w-full rounded-full bg-slate-950 transition-all duration-300 ease-out',
                    mobileOpen ? '-translate-y-[7px] -rotate-45' : '',
                  ].join(' ')}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {activeItem && activeItem.sections && !mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-lg"
            >
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-8">
                    <div className="grid grid-cols-2 gap-8">
                      {activeItem.sections.map((section) => (
                        <div key={section.title}>
                          <h3 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-slate-400">
                            {section.title}
                          </h3>

                          <div className="space-y-1">
                            {section.links.map((link) => (
                              <Link
                                key={link.label}
                                href={`/${currentLocale}${link.href}`}
                                onClick={() => setActiveMenu(null)}
                                className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50"
                              >
                                <span className="text-[14px] font-medium text-slate-800 group-hover:text-slate-950">
                                  {link.label}
                                </span>
                                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-slate-900" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-4 border-r border-slate-100 pr-8">
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-[#164E53]">
                          سلمان پلاستیک
                        </span>
                        <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                          {activeItem.label}
                        </h3>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">
                          تولیدکننده پیشرو انواع ظروف و محصولات پلاستیکی خانگی و صنعتی با بالاترین استانداردهای کیفی.
                        </p>
                      </div>

                      <Link
                        href={`/${currentLocale}${activeItem.href}`}
                        onClick={() => setActiveMenu(null)}
                        className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-slate-800"
                      >
                        ورود به این بخش
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Search Panel */}
        <AnimatePresence>
          {searchOpen && !mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl shadow-lg"
            >
              <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xs">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="جستجو در محصولات، سطل‌های پدالی، سبدها و قطعات صنعتی..."
                    className="w-full border-0 bg-transparent text-[14px] text-slate-900 outline-none placeholder:text-slate-400 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Fullscreen Overlay Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 top-20 z-50 flex flex-col justify-between overflow-y-auto bg-white px-6 pb-8 pt-4 lg:hidden font-sans"
            >
              <div>
                <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3 pt-1">
                  <Search className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="جستجو در محصولات سلمان پلاستیک..."
                    className="w-full border-0 bg-transparent text-[16px] text-slate-900 outline-none placeholder:text-slate-400 font-sans"
                  />
                </div>

                <nav className="space-y-4">
                  {MENU_ITEMS.map((item, idx) => {
                    const isExpanded = mobileExpandedItem === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * idx, duration: 0.25 }}
                        className="border-b border-slate-100 pb-3"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedItem((prev) => (prev === item.id ? null : item.id))
                          }
                          className="flex w-full items-center justify-between text-right text-[18px] font-bold tracking-tight text-slate-950"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={[
                              'h-5 w-5 text-slate-400 transition-transform duration-300',
                              isExpanded ? 'rotate-180 text-slate-950' : '',
                            ].join(' ')}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && item.sections && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.24 }}
                              className="overflow-hidden pt-3"
                            >
                              <div className="space-y-4 pr-3">
                                {item.sections.map((section) => (
                                  <div key={section.title} className="space-y-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                      {section.title}
                                    </span>
                                    <div className="space-y-2 pr-1">
                                      {section.links.map((link) => (
                                        <Link
                                          key={link.label}
                                          href={`/${currentLocale}${link.href}`}
                                          onClick={() => setMobileOpen(false)}
                                          className="flex items-center justify-between text-[14px] font-medium text-slate-700 active:text-slate-950"
                                        >
                                          <span>{link.label}</span>
                                          <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-8 space-y-3 pt-4">
                <Link
                  href={`/${currentLocale}/contact`}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#164E53] text-[15px] font-bold text-white shadow-xs"
                >
                  <PhoneCall className="h-4 w-4 text-teal-200" />
                  استعلام قیمت عمده
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default HeaderComponent;
export { HeaderComponent as Header };
