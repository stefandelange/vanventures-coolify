import Image from "next/image";
import { Link } from "@/i18n/routing";
import { type PostSummary, formatPostDate } from "@/lib/posts";

type Props = {
  post: PostSummary;
  locale: string;
  readMoreLabel: string;
  priority?: boolean;
};

export function PostCard({ post, locale, readMoreLabel, priority }: Props) {
  return (
    <Link href={post.path}>
      <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="relative h-56 w-full">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={priority}
          />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex flex-wrap gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-charcoal)]">
            {post.categories.map((cat) => (
              <span
                key={`${post.slug}-${cat}`}
                className="rounded-full bg-[var(--color-charcoal)] px-3 py-1 text-white"
              >
                {cat}
              </span>
            ))}
          </div>
          <span className="text-xl font-medium leading-snug tracking-tight text-[var(--color-charcoal)] transition hover:text-[var(--color-clay)]">
            {post.title}
          </span>
          <p className="text-sm leading-relaxed text-[var(--color-slate)]">{post.excerpt}</p>
          <div className="mt-auto flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[var(--color-slate)]/80">
            <span>{formatPostDate(post.date, locale)}</span>
            <span aria-hidden>•</span>
            <span>{post.author}</span>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-charcoal)] px-5 py-3 text-sm font-medium text-white transition hover:bg-black">
              {readMoreLabel} <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
