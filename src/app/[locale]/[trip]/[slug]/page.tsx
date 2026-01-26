import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { Video } from "@/components/video";
import {
  formatPostDate,
  getPostBySlugAndLocale,
  getPostsByCollection,
  type PostContentSegment,
} from "@/lib/posts";
import { getTranslations } from "next-intl/server";

type RoadTripPostParams = {
  locale: string;
  trip: string;
  slug: string;
};

type RoadTripPostProps = {
  params: Promise<RoadTripPostParams>;
};

export async function generateStaticParams() {
  const posts = await getPostsByCollection("en", "road-trips");
  return posts
    .filter((post) => post.collectionSegments.length >= 2)
    .map((post) => ({
      trip: post.collectionSegments[1],
      slug: post.slug,
    }));
}

export async function generateMetadata({
  params,
}: RoadTripPostProps): Promise<Metadata> {
  try {
    const { locale, trip, slug } = await params;
    const post = await getPostBySlugAndLocale(slug, locale, "road-trips", trip);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        url: `https://vanventures.blog${post.path}`,
        publishedTime: post.date,
        authors: [post.author],
        tags: post.categories,
        images: [
          {
            url: post.heroImage,
            alt: post.heroImageAlt,
          },
        ],
      },
    };
  } catch {
    return {};
  }
}

function renderContent(segments: PostContentSegment[]) {
  return segments.map((segment) => {
    if (segment.type === "gallery") {
      return (
        <Gallery
          key={segment.id}
          images={segment.images}
          columns={segment.columns}
          aspectRatio={segment.aspectRatio}
        />
      );
    }

    if (segment.type === "video") {
      return (
        <Video
          key={segment.id}
          src={segment.src}
          poster={segment.poster}
          caption={segment.caption}
        />
      );
    }

    if (segment.type === "html" && segment.html) {
      return (
        <div
          key={segment.id}
          className="rich-text"
          dangerouslySetInnerHTML={{ __html: segment.html }}
        />
      );
    }

    return null;
  });
}

export default async function RoadTripPostPage(props: RoadTripPostProps) {
  const { locale, trip, slug } = await props.params;

  let post;
  try {
    post = await getPostBySlugAndLocale(slug, locale, "road-trips", trip);
  } catch {
    return notFound();
  }

  const t = await getTranslations({ locale, namespace: "common" });

  const siblingPosts = await getPostsByCollection(locale, "road-trips", trip);
  const currentIndex = siblingPosts.findIndex((entry) => entry.slug === slug);
  const previousPost =
    currentIndex >= 0 ? siblingPosts[currentIndex + 1] ?? null : null;
  const nextPost =
    currentIndex > 0 ? siblingPosts[currentIndex - 1] ?? null : null;

  const tripSegments = post.collectionSegments.slice(1);
  const tripCollectionPath =
    tripSegments.length > 0 ? `/${tripSegments.join("/")}` : "/";
  const readingTimeLabel =
    post.readingMinutes === 1 ? `1 ${t("minute")}` : `${post.readingMinutes} ${t("minutes")}`;

  return (
    <article className="bg-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-8 px-6 py-16 sm:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            {post.categories.map((category) => (
              <span
                key={`${post.slug}-${category}`}
                className="rounded-full bg-[var(--color-charcoal)] px-4 py-1 text-white"
              >
                {category}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <span>{formatPostDate(post.date, locale)}</span>
            <span aria-hidden>•</span>
            <span>{t("byAuthor")} {post.author}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16 sm:px-0">
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-slate-500">
          <Link
            href={tripCollectionPath}
            className="rounded-full border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:border-slate-600 hover:text-slate-900"
          >
            ← {t("backToTripOverview")}
          </Link>
          <span className="hidden sm:inline" aria-hidden>
            •
          </span>
          <span>{t("readingTimePrefix")}{readingTimeLabel}</span>
        </div>
        {renderContent(post.content)}
        {(previousPost || nextPost) && (
          <nav className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {previousPost ? (
              <Link
                href={previousPost.path}
                aria-label={`Previous post: ${previousPost.title}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-600 hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
              >
                <span aria-hidden>←</span>
                <span className="text-center">{previousPost.title}</span>
              </Link>
            ) : null}
            {nextPost ? (
              <Link
                href={nextPost.path}
                aria-label={`Next post: ${nextPost.title}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-600 hover:bg-slate-50 hover:text-slate-900 sm:ml-auto sm:w-auto"
              >
                <span className="text-center">{nextPost.title}</span>
                <span aria-hidden>→</span>
              </Link>
            ) : null}
          </nav>
        )}
      </section>
    </article>
  );
}
