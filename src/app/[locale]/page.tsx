import Image from "next/image";
import { Link } from "@/i18n/routing";
import { formatPostDate, getPostsByCollection } from "@/lib/posts";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const HOME_HERO_IMAGE_SRC = "/images/general/Wilma-at-Danish-beach.jpeg";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return createPageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
    heroImage: {
      src: HOME_HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: 'en', path: "/" },
      { locale: 'de', path: "/" },
    ],
  });
}

const roadTripBlogs = [
  {
    key: "canada",
    href: "/canada-road-trip-2023",
    flag: "🇨🇦",
    image:
      "/images/road-trips/canada-2023/2023-09-25 17.31.40 Lake Louise_3000px.jpg",
  },
  {
    key: "denmark",
    href: "/denmark-road-trip-september-2024",
    flag: "🇩🇰",
    image: "/images/road-trips/denmark-2024/IMG_20240921_152800.jpeg",
  },
];

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const allPosts = await getPostsByCollection(locale, "van-life");
  const posts = allPosts.slice(0, 3);
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.home" });

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-foreground)]">
      <section className="relative flex min-h-screen items-end overflow-hidden text-white">
        <Image
          src={HOME_HERO_IMAGE_SRC}
          alt={tMeta("heroImageAlt")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-28 pt-40 sm:px-8 lg:pt-48">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
        </div>
      </section>

      <section className="bg-[var(--color-charcoal)] text-white">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-[0.9fr,1.1fr] sm:px-8 sm:py-20">
          <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-full border-4 border-[var(--color-mist)] sm:w-full sm:max-w-xs">
            <Image
              src="/images/general/Stefan+und+Kathrin+in+Kanada+Banff.jpeg"
              alt={t("about.imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 240px, 320px"
            />
          </div>
          <div className="space-y-5 sm:py-8">
            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="text-lg leading-relaxed text-white/80">
              {t("about.paragraph1")}
            </p>
            <p className="text-lg leading-relaxed text-white/80">
              {t("about.paragraph2")}
            </p>
            <p className="text-lg leading-relaxed text-white/80">
              {t("about.paragraph3")}
            </p>
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-mist)] transition hover:text-white"
            >
              {t("about.linkText")} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-medium tracking-tight text-[var(--color-charcoal)] sm:text-4xl">
              {t("vanLifeBlog.title")}
            </h2>
            <Link
              href="/van-life"
              className="text-sm font-medium text-[var(--color-slate)] transition hover:text-[var(--color-clay)]"
            >
              {t("vanLifeBlog.browseAll")} →
            </Link>
          </div>
          {posts ? (
            posts.map((post) => (
              <div
                key={post.slug}
                className="mt-10 grid gap-10 lg:grid-cols-[1.15fr,0.85fr]"
              >
                <Link href={post.path}>
                  <article className="overflow-hidden rounded-3xl border border-[var(--color-mist)]/40 bg-[var(--color-mist)]/15 shadow-sm">
                    <div className="relative h-72 w-full sm:h-80">
                      <Image
                        src={post.heroImage}
                        alt={post.heroImageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 560px"
                        priority
                      />
                    </div>
                    <div className="flex flex-col gap-4 p-6 text-[var(--color-charcoal)] sm:p-8">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-slate)]/70">
                        {post.categories.map((category) => (
                          <span
                            key={`${post.slug}-${category}`}
                            className="rounded-full bg-[var(--color-charcoal)] px-3 py-1 text-white"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <span className="text-3xl font-medium leading-snug tracking-tight transition hover:text-[var(--color-clay)] sm:text-[2.15rem]">
                        {post.title}
                      </span>
                      <p className="text-base leading-relaxed text-[var(--color-slate)]">
                        {post.excerpt}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-slate)]/80">
                        <span>{formatPostDate(post.date, locale)}</span>
                        <span aria-hidden>•</span>
                        <span>{post.author}</span>
                      </div>
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-charcoal)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black">
                          {tCommon("readMore")} <span aria-hidden>→</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))
          ) : (
            <p className="mt-10 text-sm text-[var(--color-slate)]">
              {t("vanLifeBlog.noPosts")}
            </p>
          )}
        </div>
      </section>

      <section className="bg-[var(--color-slate)] text-white">
        <div className="mx-auto max-w-5xl space-y-10 px-6 py-16 sm:px-8 sm:py-20">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {t("map.title")}
          </h2>
          <div className="space-y-4">
            <iframe
              src={`https://api.vanventures.blog/map?locale=${locale}`}
              title={t("map.mapTitle")}
              className="h-[80vh] w-full overflow-hidden rounded-xl border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              {t("roadTrips.title")}
            </h2>
            <p className="mt-2 text-base">
              {t("roadTrips.subtitle")}
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {roadTripBlogs.map((trip) => (
              <article
                key={trip.href}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg"
              >
                <div className="absolute inset-0">
                  <Image
                    src={trip.image}
                    alt=""
                    fill
                    className="object-top transition duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative flex h-full flex-col gap-4 p-8">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white">
                    <span aria-hidden className="text-base">
                      {trip.flag}
                    </span>
                    {t("roadTrips.label")}
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight text-white">
                    {t(`roadTrips.${trip.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-white">
                    {t(`roadTrips.${trip.key}.description`)}
                  </p>
                  <div className="mt-auto pt-4">
                    <Link
                      href={trip.href}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mist)] px-5 py-3 text-sm font-medium text-[var(--color-charcoal)] transition hover:bg-white"
                    >
                      {t("roadTrips.buttonText")} <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
