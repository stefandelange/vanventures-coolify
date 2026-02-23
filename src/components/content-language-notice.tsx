'use client';

import { useTranslations } from 'next-intl';

type ContentLanguageNoticeProps = {
  isFallback?: boolean;
  requestedLocale: string;
};

export function ContentLanguageNotice({
  isFallback,
  requestedLocale,
}: ContentLanguageNoticeProps) {
  const t = useTranslations('common');

  if (!isFallback || requestedLocale === 'en') {
    return null;
  }

  return (
    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900 mb-6">
      <p>{t('contentAvailableInEnglishOnly')}</p>
    </div>
  );
}
