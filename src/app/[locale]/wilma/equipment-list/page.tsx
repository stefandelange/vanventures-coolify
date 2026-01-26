import { PageHero } from "@/components/page-hero";
import { Paragraph, Subtitle, Title } from "@/components/typography";
import { HeaderConfigurator } from "@/components/site-header-context";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/road-trips/denmark-2024/IMG_20240915_093705.jpeg";
const PAGE_PATH = "/wilma/equipment-list";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaEquipmentList" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.wilmaEquipmentList" });

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

export default async function EquipmentListPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wilmaEquipmentList" });

  const equipment = t.raw("items") as Record<string, Array<{ name: string; url: string }>>;

  const categoryKeys = ["electronics", "kitchen", "other", "outdoor", "security"];

  return (
    <>
      <HeaderConfigurator wrapperClassName="bg-white/70 text-black" />
      <div className="bg-white">
        <PageHero
          imageSrc={HERO_IMAGE_SRC}
          imageAlt={t("heroImageAlt")}
          eyebrow="Wilma"
          title={t("title")}
          minHeight="min-h-[80vh]"
          className="object-[100%_30%] object-cover"
        />
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Title>{t("equipment.title")}</Title>
          <Paragraph className="mb-8">
            {t("intro")}
          </Paragraph>

          <div className="space-y-10">
            {categoryKeys.map((categoryKey) => {
              const items = equipment[categoryKey];
              if (!items) return null;

              return (
                <div key={categoryKey} className="space-y-4">
                  <Subtitle>{t(`categories.${categoryKey}` as `categories.${string}`)}</Subtitle>
                  <ul className="ml-5 list-disc space-y-2 text-base text-slate-700">
                    {items.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.url}
                          className="font-medium transition hover:text-[var(--color-clay)]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.url.includes("amzn")
                            ? item.name + "*"
                            : item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <Paragraph className="mt-10 text-sm text-slate-500">
            {t("note")}
          </Paragraph>
        </section>
      </div>
    </>
  );
}
