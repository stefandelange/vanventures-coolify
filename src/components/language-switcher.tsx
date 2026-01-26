'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeFlags, type Locale } from '@/i18n/config';

type LanguageSwitcherProps = {
  variant?: 'dark' | 'light';
};

export function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const intlLocale = useLocale();
  const currentLocale = (params.locale as Locale) ?? (intlLocale as Locale) ?? locales[0];
  const localeOptions = [
    { locale: 'de' as Locale, label: 'Deutsch' },
    { locale: 'en' as Locale, label: 'English' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const triggerBaseClass =
    'flex items-center gap-2 transition cursor-pointer';
  const triggerClass =
    variant === 'light'
      ? `${triggerBaseClass} w-full justify-between rounded-xl px-4 py-3 text-left font-medium text-[var(--color-charcoal)] hover:bg-slate-100 ${
          isOpen ? 'bg-slate-100' : ''
        }`
      : `${triggerBaseClass} text-[1.125rem] leading-tight font-normal text-white ${
          isOpen ? '' : ''
        }`;

  const panelClass =
    variant === 'light'
      ? 'flex flex-col gap-2 pl-4 text-[var(--color-charcoal)] transition-[max-height,opacity] duration-200 ease-out'
      : 'absolute right-0 top-full z-50 mt-2 flex min-w-[13rem] flex-col gap-1 rounded-xl bg-[rgba(43,43,43,0.8)] p-3 text-sm text-white shadow-xl';

  const itemBaseClass =
    'flex items-center gap-2 rounded-lg px-3 py-2 transition cursor-pointer';
  const itemClass = (locale: Locale) =>
    variant === 'light'
      ? `${itemBaseClass} hover:bg-slate-100 ${
          currentLocale === locale ? 'bg-slate-100 text-[var(--color-charcoal)]' : ''
        }`
      : `${itemBaseClass} ${
          currentLocale === locale ? 'text-[var(--color-mist)]' : ''
        }`;

  return (
    <div className="relative pb-4" ref={wrapperRef}>
      <button
        type="button"
        className={triggerClass}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>{localeFlags[currentLocale]}</span>
          <span className={variant === 'light' ? 'uppercase' : 'text-[1.125rem] leading-tight font-normal uppercase'}>
            {currentLocale}
          </span>
        </span>
        {variant === 'light' ? (
          <span className="shrink-0 text-base" aria-hidden>
            {isOpen ? '−' : '+'}
          </span>
        ) : null}
      </button>
      {variant === 'light' ? (
        <div
          className={`${panelClass} ${
            isOpen
              ? 'mt-3 max-h-[28rem] opacity-100'
              : 'max-h-0 overflow-hidden opacity-0'
          }`}
          role="listbox"
        >
          {localeOptions.map(({ locale, label }) => (
            <button
              key={locale}
              type="button"
              onClick={() => handleLocaleChange(locale)}
              className={itemClass(locale)}
              aria-label={`Switch to ${label}`}
              aria-current={currentLocale === locale ? 'true' : undefined}
            >
              <span aria-hidden>{localeFlags[locale]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      ) : isOpen ? (
        <div className={panelClass} role="listbox">
          {localeOptions.map(({ locale, label }) => (
            <button
              key={locale}
              type="button"
              onClick={() => handleLocaleChange(locale)}
              className={itemClass(locale)}
              aria-label={`Switch to ${label}`}
              aria-current={currentLocale === locale ? 'true' : undefined}
            >
              <span aria-hidden>{localeFlags[locale]}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
