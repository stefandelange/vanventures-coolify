import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/general/ice_cream.jpeg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.aboutUs" });

  return createPageMetadata({
    locale,
    path: "/about-us",
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: tMeta("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: '/about-us' },
      { locale: 'de', path: '/about-us' },
    ],
  });
}

export default async function AboutUsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.aboutUs" });

  const travellers = [
    {
      key: "kathrin",
      paragraphs: ["paragraph1", "paragraph2", "paragraph3"],
      imageSrc: "/images/general/Kathrin_Canada.jpg",
    },
    {
      key: "stefan",
      paragraphs: ["paragraph1", "paragraph2", "paragraph3", "paragraph4"],
      imageSrc: "/images/general/Stefan_Canada.jpeg",
    },
  ];
  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={tMeta("heroImageAlt")}
        eyebrow=""
        title={t("title")}
        minHeight="min-h-[60vh]"
      />
      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-[3fr_2fr] sm:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {t("headline")}
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">
              {t("intro.paragraph1")}
            </p>
            <p className="text-lg leading-relaxed text-slate-600">
              {t("intro.paragraph2")}
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/images/general/Kathrin-Stefan-Jasper.jpeg"
              alt={t("heroImageAlt")}
              fill
              className="object-cover object-top-left"
              sizes="(max-width: 768px) 80vw, 400px"
              priority
            />
          </div>
        </div>
        <div className="grid gap-6  sm:grid-cols-2 sm:gap-8 text-white">
          {travellers.map((traveller) => (
            <div
              key={traveller.key}
              className="space-y-3 rounded-xl bg-[var(--color-slate)] p-8"
            >
              <h2 className="text-xl font-semibold">{t(`${traveller.key}.title`)}</h2>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={traveller.imageSrc}
                  alt={t(`${traveller.key}.imageAlt`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 400px"
                  priority
                />
              </div>

              {traveller.paragraphs.map((paragraphKey) => (
                <p className="text-base leading-relaxed" key={paragraphKey}>
                  {t(`${traveller.key}.${paragraphKey}`)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
