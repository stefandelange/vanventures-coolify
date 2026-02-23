import type { Metadata } from "next";
import { getPostsByCollection } from "@/lib/posts";
import { PageHero } from "@/components/page-hero";
import { PostCardFeatured } from "@/components/post-card-featured";
import { PostCard } from "@/components/post-card";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const PAGE_PATH = "/van-life";
const HERO_IMAGE_SRC = "/images/van-life/somaroy/2025-09-13 10.43.21_Somaroy_4096.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "metadata.vanLife" });

  return createPageMetadata({
    locale,
    path: PAGE_PATH,
    title: tMeta("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: tMeta("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: PAGE_PATH },
      { locale: 'de', path: PAGE_PATH },
    ],
  });
}

export default async function VanLifeIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const posts = await getPostsByCollection(locale, "van-life");
  const [featured, ...rest] = posts;
  const t = await getTranslations({ locale, namespace: "vanLifePage" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.vanLife" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={tMeta("heroImageAlt")}
        eyebrow=""
        title={t("title")}
      />

      <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:px-8">
        {featured && (
          <PostCardFeatured
            post={featured}
            locale={locale}
            readMoreLabel={tCommon("readMore")}
            priority
          />
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {t("browseAllPosts")}
          </h2>
          {posts.length === 0 ? (
            <p className="text-sm text-slate-500">{t("noPosts")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {(featured ? rest : posts).map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  locale={locale}
                  readMoreLabel={tCommon("readMore")}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
