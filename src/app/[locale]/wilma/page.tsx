import { PageHero } from "@/components/page-hero";
import { Paragraph } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/wilma/Wilma-Denmark-Beach.jpeg";
const PAGE_PATH = "/wilma";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilma" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilma" });

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

export default async function WilmaPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilma" });

  const facts = t.raw("facts") as string[];

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
              {t("paragraph1")}
            </Paragraph>
            <Paragraph>
              {t("paragraph2")}
            </Paragraph>
          </div>
          <div>
            <Paragraph>{t("paragraph3")}</Paragraph>
            <Paragraph>{t("paragraph4")}</Paragraph>
            <ul className="list-disc list-inside mt-4 space-y-2 text-[var(--color-slate)] text-base leading-relaxed sm:text-lg">
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
