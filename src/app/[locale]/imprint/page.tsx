import { PageHero } from "@/components/page-hero";
import { Paragraph, Subtitle, Title } from "@/components/typography";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/2023-09-14 18.36.48 Vancouver Island_3000px.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprint" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.imprint" });

  return createPageMetadata({
    locale,
    path: "/imprint",
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: '/imprint' },
      { locale: 'de', path: '/imprint' },
    ],
  });
}

export default async function ImprintPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imprint" });

  const sections = [
    {
      key: "section1",
      paragraphs: ["paragraph1", "paragraph2"],
    },
    {
      key: "section2",
      paragraphs: ["paragraph1", "paragraph2"],
    },
    {
      key: "section3",
      paragraphs: ["paragraph1", "paragraph2", "paragraph3"],
    },
    {
      key: "section4",
      paragraphs: ["paragraph1"],
    },
  ];
  return (
    <div className="bg-white text-[var(--color-charcoal)]">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="space-y-12 rounded-3xl border border-[var(--color-mist)]/60 bg-white/90 p-6 shadow-sm sm:p-10">
          <div className="space-y-6">
            <Title as="h2" className="text-2xl">
              {t("responsibilityTitle")}
            </Title>
            <div className="space-y-2">
              <Paragraph>Stefan de Lange</Paragraph>
              <Paragraph>c/o Block Services</Paragraph>
              <Paragraph>Stuttgarter Str. 106</Paragraph>
              <Paragraph>70736 Fellbach</Paragraph>
              <Paragraph>
                E-Mail:{" "}
                <a
                  href="mailto:hello@vanventures.blog"
                  className="font-medium text-[var(--color-clay)] underline-offset-4 hover:underline"
                >
                  hello@vanventures.blog
                </a>
              </Paragraph>
            </div>
          </div>

          <div className="space-y-6">
            <Title as="h2" className="text-2xl">
              {t("disclaimerTitle")}
            </Title>
            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.key} className="space-y-3">
                  <Subtitle
                    as="h3"
                    className="text-lg font-semibold text-[var(--color-charcoal)]"
                  >
                    {t(`sections.${section.key}.title`)}
                  </Subtitle>
                  <div className="space-y-3">
                    {section.paragraphs.map((paragraphKey) => (
                      <Paragraph key={paragraphKey}>
                        {t(`sections.${section.key}.${paragraphKey}`)}
                      </Paragraph>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <a
              href="https://www.juraforum.de/impressum-generator/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-clay)] underline-offset-4 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("sourceLink")}
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
