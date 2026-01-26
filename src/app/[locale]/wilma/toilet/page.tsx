import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { Paragraph, Title } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/van-life/oostende/2025-06-15 19.53.23_Oostende_4096.jpg";
const PAGE_PATH = "/wilma/toilet";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaToilet" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaToilet" });

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

export default async function ToiletPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaToilet" });

  const images = [
    {
      src: "/images/wilma/toilet/cables.jpeg",
      alt: t("images.cables"),
    },
    {
      src: "/images/wilma/toilet/toilet_base.jpeg",
      alt: t("images.toiletBase"),
    },
    {
      src: "/images/wilma/toilet/old_toilet.jpeg",
      alt: t("images.oldToilet"),
    },
    {
      src: "/images/wilma/toilet/toilet_base_prepared.jpeg",
      alt: t("images.toiletBasePrepared"),
    },
    {
      src: "/images/wilma/toilet/toilet_installed.jpeg",
      alt: t("images.toiletInstalled"),
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
              {t("bioTioo.title")}
            </Title>
            <Paragraph>
              {t("bioTioo.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t.rich("bioTioo.paragraph2", {
                link: (chunks) => (
                  <a
                    href="https://biotioo.com/"
                    className="underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </Paragraph>
            <br />
            <Paragraph>
              {t("bioTioo.paragraph3")}
            </Paragraph>
            <br />
          </div>
          <div>
            <Gallery images={images} imageHeightClass="h-[50vh]" />
          </div>
        </div>
      </section>
    </div>
  );
}
