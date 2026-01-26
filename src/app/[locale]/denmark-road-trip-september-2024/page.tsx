import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { formatPostDate, getPostsByCollection } from "@/lib/posts";
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
              <Link key={post.slug} href={post.path}>
                <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-56 w-full">
                    <Image
                      src={post.heroImage}
                      alt={post.heroImageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-charcoal)]">
                      {post.categories.map((category) => (
                        <span
                          key={`${post.slug}-${category}`}
                          className="rounded-full bg-[var(--color-charcoal)] px-3 py-1 text-white"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <span className="text-xl font-semibold text-slate-900 transition hover:text-[var(--color-clay)]">
                      {post.title}
                    </span>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      <span>{formatPostDate(post.date, locale)}</span>
                      <span aria-hidden>•</span>
                      <span>{post.author}</span>
                    </div>
                  </div>
                </article>
              </Link>
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
