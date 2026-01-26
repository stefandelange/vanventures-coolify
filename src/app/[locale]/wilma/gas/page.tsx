import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { Paragraph, Title } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/van-life/somaroy/2025-09-13 10.40.37_Somaroy_4096.jpg";
const PAGE_PATH = "/wilma/gas";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaGas" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaGas" });

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

export default async function GasPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaGas" });

  const images = [
    {
      src: "/images/wilma/gas/gast bottles.jpeg",
      alt: t("images.gasBottles"),
    },
    {
      src: "/images/wilma/gas/hose.jpeg",
      alt: t("images.hose"),
    },
    {
      src: "/images/wilma/gas/external nozzle.jpeg",
      alt: t("images.externalNozzle"),
    },
    {
      src: "/images/wilma/gas/external nozzle cover removed.jpeg",
      alt: t("images.externalNozzleCoverRemoved"),
    },
    {
      src: "/images/wilma/gas/nozzle adapters.jpeg",
      alt: t("images.nozzleAdapters"),
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
        className="object-top object-cover"
      />
      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
        <div className="grid gap-6  sm:grid-cols-1 sm:gap-8 text-white">
          <div>
            <Title as="h2" className="py-4">
              {t("background.title")}
            </Title>
            <Paragraph>
              {t("background.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("background.paragraph2")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("background.paragraph3")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("background.paragraph4")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("background.paragraph5")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("background.paragraph6")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("background.paragraph7")}
            </Paragraph>
          </div>
          <div>
            <Title as="h2" className="py-4">
              {t("solution.title")}
            </Title>
            <Paragraph>
              {t("solution.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("solution.paragraph2")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("solution.paragraph3")}
            </Paragraph>
            <br />
            <Paragraph>
              {t.rich("solution.paragraph4", {
                link: (chunks) => (
                  <a
                    href="https://www.wohnmobil-elektronik.de/"
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
            <Paragraph>
              {t("solution.paragraph5")}
            </Paragraph>
          </div>
          <div>
            <Title as="h2" className="py-4">
              {t("findingStations.title")}
            </Title>
            <Paragraph>
              {t.rich("findingStations.paragraph", {
                link: (chunks) => (
                  <a
                    href="https://www.mylpg.eu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
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
