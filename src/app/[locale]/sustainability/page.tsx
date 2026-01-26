import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { Paragraph, Title } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/Whistler FS1_3000px.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sustainability" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.sustainability" });

  return createPageMetadata({
    locale,
    path: "/sustainability",
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: tMeta("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: '/sustainability' },
      { locale: 'de', path: '/sustainability' },
    ],
  });
}

export default async function SustainabilityPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sustainability" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.sustainability" });

  const images = [
    {
      src: "/images/sustainability/duschbrocken1.jpeg",
      alt: t("bathroom.imageAlt"),
    },
    {
      src: "/images/sustainability/duschbrocken2.jpeg",
      alt: t("bathroom.imageAlt"),
    },
    {
      src: "/images/sustainability/duschbrocken3.jpeg",
      alt: t("bathroom.imageAlt"),
    },
    {
      src: "/images/sustainability/duschbrocken4.jpeg",
      alt: t("bathroom.imageAlt"),
    },
    {
      src: "/images/sustainability/duschbrocken5.jpeg",
      alt: t("bathroom.imageAlt"),
    },
  ];

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={tMeta("heroImageAlt")}
        eyebrow=""
        title={t("title")}
        minHeight="min-h-[90vh]"
        className="object-top object-cover"
      />
      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
        <div className="grid gap-6  sm:grid-cols-1 sm:gap-8 text-white">
          <div>
            <Title as="h2" className="py-4">
              {t("background.title")}
            </Title>
            <Paragraph>
              {t("background.intro")}
            </Paragraph>
            <ul className="text-base leading-relaxed text-[var(--color-slate)] sm:text-lg list-disc list-inside my-4">
              <li>
                {t("background.reason1")}
              </li>
              <li>
                {t("background.reason2")}
              </li>
            </ul>
            <Paragraph>
              {t("background.closing")}
            </Paragraph>
            <Title as="h2" className="py-4">
              {t("bathroom.title")}
            </Title>
            <Paragraph>
              {t("bathroom.duschbrocken")}
            </Paragraph>
            <Paragraph>
              {t("bathroom.discountPrefix")}{" "}
              <a
                href="http://empfehlung.duschbrocken.de/lPwl6KFLWEyB"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {t("bathroom.discountLinkText")}
              </a>{" "}
              {t("bathroom.discountSuffix")}
            </Paragraph>
          </div>
        </div>
        <div>
          <Gallery images={images} imageHeightClass="h-[50vh]" />
        </div>
      </section>
    </div>
  );
}
