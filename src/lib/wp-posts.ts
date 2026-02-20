import { unstable_cache } from "next/cache";
import type { PostSummary } from "./posts";

const WP_API = process.env.WORDPRESS_API_URL;

type WpCategory = {
  name: string;
};

type WpPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  acf: {
    raw_content?: string;
    hero_image?: string;
    hero_image_alt?: string;
    translation_slug?: string;
  };
  _embedded?: {
    "wp:term"?: WpCategory[][];
    author?: { name: string }[];
  };
};

export type WpRawPostRecord = {
  summary: PostSummary;
  rawContent: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

// Detect locale from Polylang URL structure:
// default language has no prefix (e.g. /slug/), secondary languages have a prefix (e.g. /en/slug/)
function detectLocale(link: string, defaultLocale = "de"): string {
  try {
    const pathname = new URL(link).pathname;
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    if (firstSegment === "en") return "en";
    if (firstSegment === "de") return "de";
  } catch {
    // ignore
  }
  return defaultLocale;
}

export const loadWpPosts = unstable_cache(
  async (): Promise<WpRawPostRecord[]> => {
  if (!WP_API) return [];

  const url = `${WP_API}/wp/v2/posts?per_page=100&status=publish&_embed=wp:term,author`;

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 3600 } });
  } catch {
    console.error("[wp-posts] Failed to fetch WordPress posts");
    return [];
  }

  if (!response.ok) {
    console.error(`[wp-posts] WordPress API returned ${response.status}`);
    return [];
  }

  const posts: WpPost[] = await response.json();
  const records: WpRawPostRecord[] = [];

  for (const post of posts) {
    const title = stripHtml(post.title.rendered);
    const heroImage = post.acf?.hero_image?.trim() ?? "";
    const heroImageAlt = post.acf?.hero_image_alt?.trim() ?? "";

    if (!heroImage || !heroImageAlt) {
      console.warn(`[wp-posts] Skipping post "${title}" — missing hero_image or hero_image_alt`);
      continue;
    }

    const locale = detectLocale(post.link);
    const datePrefix = post.date.substring(0, 10);
    const translationSlug = post.acf?.translation_slug?.trim() || post.slug;
    const slug = `${datePrefix}-${translationSlug}`;
    const categories = post._embedded?.["wp:term"]?.[0]?.map((cat) => cat.name) ?? [];
    const author = post._embedded?.author?.[0]?.name ?? "";
    const rawContent = post.acf?.raw_content ?? "";
    const excerpt = stripHtml(post.excerpt.rendered);

    const summary: PostSummary = {
      slug,
      locale,
      title,
      excerpt,
      date: new Date(post.date).toISOString(),
      author,
      categories,
      heroImage,
      heroImageAlt,
      collectionSegments: ["van-life"],
      path: `/van-life/${slug}`,
      relativePath: `wp/${post.id}`,
    };

    records.push({ summary, rawContent });
  }

  return records;
  },
  ["wp-posts"],
  { tags: ["wp-posts"] },
);
