import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { formatPostDate, getPostsByCollection } from "@/lib/posts";
import { PageHero } from "@/components/page-hero";
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

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={tMeta("heroImageAlt")}
        eyebrow=""
        title={t("title")}
      />

      <section className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:px-8">
        {featured && (
          <Link href={featured.path}>
            <article className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:shadow-xl sm:grid-cols-[1.1fr,0.9fr] sm:p-8">
              <div className="relative h-64 overflow-hidden rounded-2xl sm:h-auto sm:aspect-[4/3]">
                <Image
                  src={featured.heroImage}
                  alt={featured.heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 900px, 480px"
                  priority
                />
              </div>
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-charcoal)]">
                  {featured.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-[var(--color-charcoal)] px-3 py-1 text-white"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <span className="text-3xl font-semibold tracking-tight text-slate-900 transition hover:text-[var(--color-clay)]">
                  {featured.title}
                </span>
                <p className="text-base leading-relaxed text-slate-600">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>{formatPostDate(featured.date, locale)}</span>
                  <span aria-hidden>•</span>
                  <span>{t("byAuthor")} {featured.author}</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                    {t("continueReading")}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {t("browseAllPosts")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {(featured ? rest : posts).map((post) => (
              <Link href={post.path} key={post.slug}>
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
