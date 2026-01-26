import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/van-life/matind/2025-09-20 16.38.53_Matind_4096.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vanLifeMap" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.vanLifeMap" });

  return createPageMetadata({
    locale,
    path: "/van-life/map",
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: '/van-life/map' },
      { locale: 'de', path: '/van-life/map' },
    ],
  });
}

export default async function VanLifeMapPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vanLifeMap" });

  return (
    <div className="bg-white text-[var(--color-charcoal)]">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow=""
        title={t("title")}
      />
      <section className="mx-auto max-w-5xl space-y-10 px-6 py-16 sm:px-8 sm:py-20">
        <div className="space-y-4">
          <iframe
            src="https://api.vanventures.blog/map"
            title={t("iframeTitle")}
            className="h-[80vh] w-full overflow-hidden rounded-xl border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
