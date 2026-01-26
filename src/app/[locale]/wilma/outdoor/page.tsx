import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { Paragraph, Title } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/van-life/waasmunster/2025-06-08 19.21.39_Waasmunster_4096.jpg";
const PAGE_PATH = "/wilma/outdoor";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale} = await params;
  const t = await getTranslations({ locale, namespace: "wilmaOutdoor" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaOutdoor" });

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

export default async function OutdoorPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaOutdoor" });

  const images = [
    {
      src: "/images/wilma/toolboard/toolboard_mounts.jpeg",
      alt: t("images.mounts"),
    },
    {
      src: "/images/wilma/toolboard/toolboard.jpeg",
      alt: t("images.toolboard"),
    },
  ];

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow=""
        title={t("title")}
        minHeight="min-h-[90vh]"
        className="object-cover"
      />
      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
        <div className="grid gap-6  sm:grid-cols-1 sm:gap-8 text-white">
          <div>
            <Title as="h2" className="py-4">
              {t("toolboard.title")}
            </Title>
            <Paragraph>
              {t("toolboard.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("toolboard.paragraph2")}
            </Paragraph>
          </div>
          <div>
            <Gallery images={images} imageHeightClass="h-[50vh]" columns={2} />
          </div>
        </div>
      </section>
    </div>
  );
}
