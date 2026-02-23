import type { Metadata } from "next";
import { getPostsByCollection } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { PageHero } from "@/components/page-hero";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const PAGE_PATH = "/denmark-road-trip-september-2024";
const HERO_IMAGE_SRC = "/images/road-trips/denmark-2024/IMG_20240921_152800.jpeg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "denmarkRoadTrip2024" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.denmarkRoadTrip2024" });

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

export default async function RoadTripDenmarkIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "denmarkRoadTrip2024" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const posts = await getPostsByCollection(
    locale,
    "road-trips",
    "denmark-road-trip-september-2024",
    { order: "asc" }
  );

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow=""
        title={t("title")}
      />

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
