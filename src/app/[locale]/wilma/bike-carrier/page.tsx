import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { Paragraph } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/wilma/Wilma-Denmark-Beach.jpeg";
const PAGE_PATH = "/wilma/bike-carrier";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaBikeCarrier" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaBikeCarrier" });

  return createPageMetadata({
    locale,
    path: PAGE_PATH,
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: PAGE_PATH },
      { locale: 'de', path: PAGE_PATH },
    ],
  });
}

export default async function BikeCarrierPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaBikeCarrier" });

  const images = [
    {
      src: "/images/wilma/bike-carrier/Wilma-bike-carrier-no-bikes.jpeg",
      alt: t("images.noBikes"),
    },
    {
      src: "/images/wilma/bike-carrier/Wilma-bike-carrier-with-bikes.jpeg",
      alt: t("images.withBikes"),
    },
  ];

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow="Wilma"
        title={t("title")}
        minHeight="min-h-[60vh]"
      />
      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
        <div className="grid gap-6  sm:grid-cols-2 sm:gap-8 text-white">
          <div>
            <Paragraph>
              {t.rich("content.paragraph1", {
                link: (chunks) => (
                  <a
                    href="http://pushcomponents.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </Paragraph>
            <br />
            <Paragraph>{t("content.paragraph2")}</Paragraph>
          </div>
        </div>
        <div>
          <Gallery images={images} imageHeightClass="h-[50vh]" />
        </div>
      </section>
    </div>
  );
}
