import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/2023-09-14 18.36.48 Vancouver Island_3000px.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletter" });

  return createPageMetadata({
    locale,
    path: "/newsletter",
    title: t("title"),
    description: t("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: '/newsletter' },
      { locale: 'de', path: '/newsletter' },
    ],
  });
}

type NewsletterPageProps = {
  params: PageProps["params"];
  searchParams?: Promise<{
    result?: string | string[];
  }>;
};

export default async function NewsletterPage({
  params,
  searchParams,
}: NewsletterPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletter" });

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const resultParam = resolvedSearchParams?.result;
  const normalizedResult =
    typeof resultParam === "string" ? resultParam.toLowerCase() : undefined;

  const isSuccess = normalizedResult === "success";
  const message = isSuccess ? t("successMessage") : t("errorMessage");

  return (
    <div className="bg-white text-[var(--color-charcoal)]">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow=""
        title={t("title")}
      />
      <section className="bg-white">
        <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center sm:px-8">
          <p
            className={`text-lg leading-relaxed ${
              isSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>
      </section>
    </div>
  );
}
