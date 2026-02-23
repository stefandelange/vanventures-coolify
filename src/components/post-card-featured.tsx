import Image from "next/image";
import { Link } from "@/i18n/routing";
import { type PostSummary, formatPostDate } from "@/lib/posts";

type Props = {
  post: PostSummary;
  locale: string;
  readMoreLabel: string;
  priority?: boolean;
};

export function PostCardFeatured({ post, locale, readMoreLabel, priority }: Props) {
  return (
    <Link href={post.path}>
      <article className="overflow-hidden rounded-xl border border-[var(--color-mist)]/40 bg-[var(--color-mist)]/15">
        <div className="relative h-72 w-full sm:h-80">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority={priority}
          />
        </div>
        <div className="flex flex-col gap-4 p-6 text-[var(--color-charcoal)] sm:p-8">
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-slate)]/70">
            {post.categories.map((cat) => (
              <span
                key={`${post.slug}-${cat}`}
                className="rounded-full bg-[var(--color-charcoal)] px-3 py-1 text-white"
              >
                {cat}
              </span>
            ))}
          </div>
          <span className="text-3xl font-medium leading-snug tracking-tight transition hover:text-[var(--color-clay)] sm:text-[2.15rem]">
            {post.title}
          </span>
          <p className="text-base leading-relaxed text-[var(--color-slate)]">{post.excerpt}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-slate)]/80">
            <span>{formatPostDate(post.date, locale)}</span>
            <span aria-hidden>•</span>
            <span>{post.author}</span>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-charcoal)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black">
              {readMoreLabel} <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
