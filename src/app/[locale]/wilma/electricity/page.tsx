import { PageHero } from "@/components/page-hero";
import { HeaderConfigurator } from "@/components/site-header-context";
import { Paragraph, Subtitle, Title } from "@/components/typography";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/wilma/beefy-power/13+BullTron+angeschlossen.jpeg";
const PAGE_PATH = "/wilma/electricity";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaElectricity" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaElectricity" });

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

export default async function ElectricityPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaElectricity" });
  return (
    <>
      <HeaderConfigurator wrapperClassName="bg-white/70 text-black" />
      <div className="bg-white">
        <PageHero
          imageSrc={HERO_IMAGE_SRC}
          imageAlt={t("heroImageAlt")}
          eyebrow="Wilma"
          title={t("title")}
          minHeight="min-h-[60vh]"
        />
        <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
          <div className="flex text-white flex-col gap-6">
            <Title as="h2">{t("main.title")}</Title>
            <Subtitle>{t("battery.title")}</Subtitle>{" "}
            <Paragraph>
              {t("battery.paragraph")}
            </Paragraph>
            <Subtitle>{t("charging.title")}</Subtitle>{" "}
            <Paragraph>
              {t("charging.paragraph1")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("charging.paragraph2")}
            </Paragraph>
            <br />
            <Paragraph>
              {t("charging.paragraph3")}
            </Paragraph>
            <div className="pt-2">
              <Link
                href={
                  "/van-life/2024-11-27-beefing-up-wilmas-power-getting-serious-about-electrical-gear"
                }
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-charcoal)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
              >
                {t("readFullPost")} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
