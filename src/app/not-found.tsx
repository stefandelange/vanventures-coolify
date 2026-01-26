// Global 404 page (fallback when no locale is matched)
// Detects locale from middleware header and shows appropriate translations

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeaderConfigProvider } from "@/components/site-header-context";

const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/2023-09-14 14.09.42 Vancouver Island_3000px.jpg";

export default async function GlobalNotFound() {
  // Detect locale from middleware header
  const headersList = await headers();
  const locale = (headersList.get('x-locale') as 'en' | 'de') || 'en';

  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <HeaderConfigProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <div className="bg-[var(--color-background)] text-[var(--color-foreground)]">
              <section className="relative flex min-h-screen items-end overflow-hidden text-white">
                <Image
                  src={HERO_IMAGE_SRC}
                  alt={t("heroImageAlt")}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-28 pt-40 sm:px-8 lg:pt-48">
                  <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
                    {t("title")}
                  </h1>
                </div>
              </section>

              <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8 lg:px-0">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {t("heading")}
                </h2>
                <p className="mb-6 text-lg leading-7">
                  {t("description")}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-charcoal)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
                >
                  {t("backToHome")} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </main>
          <SiteFooter />
        </div>
      </HeaderConfigProvider>
    </NextIntlClientProvider>
  );
}
