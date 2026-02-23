import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { Paragraph, Title } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/van-life/allgaeu/2024-12-30 13.37.12_Allgäu_4096.jpg";
const PAGE_PATH = "/wilma/internet";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaInternet" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaInternet" });

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

export default async function InternetPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaInternet" });

  const setupList = t.raw("setup.list") as string[];

  const images = [
    {
      src: "/images/wilma/internet/IMG_2550.jpeg",
      alt: t("images.wallboard"),
    },
    {
      src: "/images/wilma/internet/IMG_2551.jpeg",
      alt: t("images.routerWithMounts"),
    },
    {
      src: "/images/wilma/internet/IMG_2552.jpeg",
      alt: t("images.routerMounted"),
    },
    {
      src: "/images/wilma/internet/IMG_2554.jpeg",
      alt: t("images.switch"),
    },
    {
      src: "/images/wilma/internet/IMG_2553.jpeg",
      alt: t("images.switchesInstalled"),
    },
    {
      src: "/images/wilma/internet/IMG_2555.jpeg",
      alt: t("images.wiring"),
    },
    {
      src: "/images/wilma/internet/IMG_2613.jpeg",
      alt: t("images.poeInjector"),
    },
    {
      src: "/images/wilma/internet/IMG_2859.jpeg",
      alt: t("images.antennaMounted"),
    },
    {
      src: "/images/wilma/internet/IMG_2860.jpeg",
      alt: t("images.cables"),
    },
    {
      src: "/images/wilma/internet/IMG_2862.jpeg",
      alt: t("images.connectingAntenna"),
    },
    {
      src: "/images/wilma/internet/IMG_2863.jpeg",
      alt: t("images.everythingConnected"),
    },
    {
      src: "/images/wilma/internet/IMG_2870.jpeg",
      alt: t("images.running"),
    },
    {
      src: "/images/wilma/internet/IMG_2871.jpeg",
      alt: t("images.antennaAndStarlink"),
    },
    {
      src: "/images/wilma/internet/IMG_2872.jpeg",
      alt: t("images.antennaCloseup"),
    },
    {
      src: "/images/wilma/internet/Starlink+outlet.jpeg",
      alt: t("images.ethernetOutlet"),
    },
    {
      src: "/images/wilma/internet/Starlink+outlet+plugged+in.jpeg",
      alt: t("images.starlinkPluggedIn"),
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
          </div>
          <div>
            <Title as="h2" className="py-4">
              {t("setup.title")}
            </Title>
            <ul className="text-base leading-relaxed text-[var(--color-slate)] sm:text-lg list-disc list-inside my-4">
              {setupList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Title as="h2" className="py-4">
              {t("wiring.title")}
            </Title>
            <Gallery
              images={[
                {
                  src: "/images/wilma/internet/schematics.jpg",
                  alt: t("wiring.schematicAlt"),
                },
              ]}
              columns={1}
              imageHeightClass="h-[50vh]"
            />
            <br />
            <Paragraph>
              {t("wiring.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("wiring.paragraph2")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("wiring.paragraph3")}
            </Paragraph>
          </div>
          <div>
            <Title as="h2" className="py-4">
              {t("starlinkStats.title")}
            </Title>
            <Paragraph>
              {t("starlinkStats.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("starlinkStats.paragraph2")}
            </Paragraph>
            <Image
              src="/images/wilma/internet/Starlink+power+draw+2+laptops+33W.jpeg"
              alt={t("starlinkStats.powerDrawImageAlt")}
              width={600}
              height={400}
              className="my-4 rounded-xl"
            />
          </div>
          <div>
            <Title as="h2" className="py-4">
              {t("routerStats.title")}
            </Title>
            <Paragraph>
              {t("routerStats.paragraph")}
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
