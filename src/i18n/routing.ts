import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always', // Always show locale in URL
  localeDetection: true, // Detect locale from browser Accept-Language header
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
