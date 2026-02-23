import type { Metadata } from "next";
import { getPostsByCollection } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { Paragraph, Title } from "@/components/typography";
import { Gallery } from "@/components/gallery";
import { getTranslations } from "next-intl/server";

const PAGE_PATH = "/canada-road-trip-2023";
const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/2023-09-23 16.20.46 Jasper_3000px.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "canadaRoadTrip2023" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.canadaRoadTrip2023" });

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

const RV_IMAGE_SRC = "/images/road-trips/canada-2023/Fraserway RV C-Small.jpeg";
const ROUTE_IMAGE_SRC = "/images/road-trips/canada-2023/Full-Route.png";

export default async function RoadTripCanadaIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "canadaRoadTrip2023" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const posts = await getPostsByCollection(
    locale,
    "road-trips",
    "canada-road-trip-2023",
    { order: "asc" }
  );

  const rv = [
    {
      src: RV_IMAGE_SRC,
      alt: t("rvImageAlt"),
    },
  ];

  const route = [
    {
      src: ROUTE_IMAGE_SRC,
      alt: t("routeImageAlt"),
    },
  ];

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow=""
        title={t("title")}
      />

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <Title as="h2">{t("introTitle")}</Title>
      </div>
      <section className="mx-auto grid sm:grid-cols-2 max-w-7xl gap-16 px-6 py-12 sm:px-8">
        <div>
          <Paragraph>
            {t("intro.paragraph1")}
            <br />
            <br />
            {t("intro.paragraph2")}
            <br />
            <br />
            {t("intro.paragraph3")}
            <br />
            <br />
            {t("intro.paragraph4")}
            <br />
            <br />
            {t("intro.paragraph5")}
            <br />
            <br />
            {t("intro.paragraph6", { swearword: t("intro.swearword") })}
            <br />
            <br />
            {t("intro.paragraph7")}
          </Paragraph>
        </div>
        <Gallery
          images={rv}
          columns={1}
          aspectRatio={{ width: 3, height: 4 }}
        />
      </section>

      <section className="mx-auto grid grid-cols-1 max-w-7xl gap-16 px-6 py-12 sm:px-8">
        <Title as="h2">{t("routeTitle")}</Title>
        <Gallery
          images={route}
          columns={1}
          aspectRatio={{ width: 3, height: 2 }}
        />
      </section>

      <section className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:px-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {t("browseAllPosts")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                locale={locale}
                readMoreLabel={tCommon("readMore")}
              />
            ))}
          </div>
          {posts.length === 0 && (
            <p className="text-sm text-slate-500">
              {t("noPosts")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
