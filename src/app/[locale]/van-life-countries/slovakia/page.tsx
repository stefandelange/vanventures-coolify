import { PageHero } from "@/components/page-hero";
import {
  Accordion,
  type AccordionSections,
} from "@/components/accordion";
import { getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/van-life/tatra-national-park/2025-07-12 18.07.40_Tatra National Park_4096.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vanLifeCountries.slovakia" });
  const tCommon = await getTranslations({ locale, namespace: "vanLifeCountries.common" });

  const countryName = t("name");
  const countryFlag = t("flag");

  return createPageMetadata({
    locale,
    path: `/van-life-countries/${countryName.toLowerCase()}`,
    title: `${countryFlag} ${countryName}`,
    description: tCommon("descriptionTemplate", { country: countryName }),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: "en", path: `/van-life-countries/${countryName.toLowerCase()}` },
      { locale: "de", path: `/van-life-countries/${countryName.toLowerCase()}` },
    ],
  });
}

export default async function SlovakiaPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vanLifeCountries.slovakia" });
  const tCommon = await getTranslations({ locale, namespace: "vanLifeCountries.common" });
  const tGlobal = await getTranslations({ locale, namespace: "common" });

  const countryName = t("name");
  const countryFlag = t("flag");

  const posts = await getPostsByCategory(
    `${countryFlag.toLowerCase()} ${countryName.toLowerCase()}`,
    locale
  );

  // Build route metadata from translations
  const routeMetadata = [
    t("routeMetadata.dates"),
    t("routeMetadata.timeSpent"),
    t("routeMetadata.distance"),
    t("routeMetadata.avgSpeed"),
    t("routeMetadata.maxElevation"),
    t("routeMetadata.overnights"),
  ];

  // Build accordion sections from translations
  const countryGuideSections: AccordionSections = {
    [t("guide.camping.title")]: {
      [t("guide.camping.freeCamping.title")]: t("guide.camping.freeCamping.content"),
      [t("guide.camping.paidCampsites.title")]: t("guide.camping.paidCampsites.content"),
      [t("guide.camping.infrastructure.title")]: t("guide.camping.infrastructure.content"),
    },
    [t("guide.connectivity.title")]: {
      [t("guide.connectivity.mobileInternet.title")]: t("guide.connectivity.mobileInternet.content"),
      [t("guide.connectivity.simCard.title")]: t("guide.connectivity.simCard.content"),
      [t("guide.connectivity.wifi.title")]: t("guide.connectivity.wifi.content"),
    },
    [t("guide.costs.title")]: {
      [t("guide.costs.groceries.title")]: t("guide.costs.groceries.content"),
      [t("guide.costs.fuel.title")]: t("guide.costs.fuel.content"),
      [t("guide.costs.camping.title")]: t("guide.costs.camping.content"),
      [t("guide.costs.laundry.title")]: t("guide.costs.laundry.content"),
    },
    [t("guide.logistics.title")]: {
      [t("guide.logistics.roads.title")]: t("guide.logistics.roads.content"),
      [t("guide.logistics.tolls.title")]: t("guide.logistics.tolls.content"),
      [t("guide.logistics.borders.title")]: t("guide.logistics.borders.content"),
      [t("guide.logistics.police.title")]: t("guide.logistics.police.content"),
    },
    [t("guide.dailyLife.title")]: {
      [t("guide.dailyLife.water.title")]: t("guide.dailyLife.water.content"),
      [t("guide.dailyLife.dumps.title")]: t("guide.dailyLife.dumps.content"),
      [t("guide.dailyLife.shopping.title")]: t("guide.dailyLife.shopping.content"),
      [t("guide.dailyLife.laundromats.title")]: t("guide.dailyLife.laundromats.content"),
    },
    [t("guide.climate.title")]: {
      [t("guide.climate.bestTime.title")]: t("guide.climate.bestTime.content"),
      [t("guide.climate.extremes.title")]: t("guide.climate.extremes.content"),
      [t("guide.climate.bugs.title")]: t("guide.climate.bugs.content"),
    },
    [t("guide.culture.title")]: {
      [t("guide.culture.safety.title")]: t("guide.culture.safety.content"),
      [t("guide.culture.attitudes.title")]: t("guide.culture.attitudes.content"),
      [t("guide.culture.noise.title")]: t("guide.culture.noise.content"),
      [t("guide.culture.highlights.title")]: t("guide.culture.highlights.content"),
      [t("guide.culture.language.title")]: t("guide.culture.language.content"),
    },
    [t("guide.tips.title")]: {
      [t("guide.tips.gems.title")]: t("guide.tips.gems.content"),
      [t("guide.tips.apps.title")]: t("guide.tips.apps.content"),
      [t("guide.tips.etiquette.title")]: t("guide.tips.etiquette.content"),
    },
  };

  return (
    <main className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow={tCommon("eyebrow")}
        title={`${countryFlag} ${countryName}`}
        minHeight="h-[100vh]"
      />
      <section className="bg-[var(--color-charcoal)] text-white px-6 py-8 lg:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              {tCommon("sections.ourRoute")}
            </h2>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-xl">
                <iframe
                  src="https://share.trackiwi.com/gQ5U4A22nnZ"
                  width="100%"
                  height="500"
                ></iframe>
              </div>
              <div className="space-y-4 rounded-xl bg-white p-6 text-slate-800 shadow-xl lg:p-8">
                <h3 className="text-xl font-semibold">{tCommon("sections.tripStats")}</h3>
                <ul className="space-y-3 text-base leading-relaxed">
                  {routeMetadata.map((label) => (
                    <li key={label}>
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl space-y-12 px-6 py-8 lg:px-0">
        <div className="space-y-6 pb-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl text-slate-900">
            {tCommon("sections.blogPostsAbout", { country: countryName })}
          </h2>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={tGlobal("readMore")}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[var(--color-charcoal)] text-white space-y-12 px-6 py-8 lg:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6 pb-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              {tCommon("sections.whatYouNeedToKnow", { country: countryName })}
            </h2>
          </div>
          <div className="bg-white p-8 rounded-xl">
            <Accordion sections={countryGuideSections} />
          </div>
        </div>
      </section>
    </main>
  );
}
