import { cache } from "react";
import { marked } from "marked";
import { postsSource, type PostSourceRecord } from "@/generated/posts-source";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryAspectRatio = {
  width: number;
  height: number;
};

export type PostSummary = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  categories: string[];
  heroImage: string;
  heroImageAlt: string;
  collectionSegments: string[];
  path: string;
  relativePath: string;
};

export type PostContentSegment =
  | { type: "html"; id: string; html: string }
  | {
      type: "gallery";
      id: string;
      images: GalleryImage[];
      columns?: number;
      aspectRatio?: GalleryAspectRatio;
    }
  | {
      type: "video";
      id: string;
      src: string;
      poster?: string;
      caption?: string;
    };

export type PostDetail = PostSummary & {
  content: PostContentSegment[];
  readingMinutes: number;
  isFallback?: boolean;
};

marked.use({ gfm: true, breaks: true });

function renderMarkdown(source: string): string {
  const result = marked.parse(source);
  if (typeof result === "string") {
    return result;
  }
  throw new Error("Async markdown parsing is not supported in this environment.");
}

function normaliseCategories(value: unknown): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseDate(value: unknown): string {
  if (!value) {
    throw new Error("Post is missing a date.");
  }
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return date.toISOString();
}

function parseVideoBlock(rawBlock: string, index: number): PostContentSegment {
  const lines = rawBlock
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Video block must include a video source.");
  }

  let src = "";
  let poster: string | undefined;
  let caption: string | undefined;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.startsWith("src=")) {
      src = line.slice("src=".length).trim();
    } else if (lowerLine.startsWith("poster=")) {
      poster = line.slice("poster=".length).trim();
    } else if (lowerLine.startsWith("caption=")) {
      caption = line.slice("caption=".length).trim();
    }
  }

  if (!src) {
    throw new Error("Video block must include a src attribute.");
  }

  return {
    type: "video",
    id: `video-${index}`,
    src,
    poster,
    caption,
  };
}

function parseGalleryBlock(rawBlock: string, index: number): PostContentSegment {
  const lines = rawBlock
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error("Gallery block must include at least one image.");
  }

  let columns: number | undefined;
  let aspectRatio: GalleryAspectRatio | undefined;
  const imageLines = lines.filter((line) => {
    const lowerLine = line.toLowerCase();

    if (lowerLine.startsWith("columns=")) {
      const rawValue = line.slice("columns=".length).trim();
      if (!rawValue) {
        throw new Error(`Gallery columns value is missing. Received line: "${line}".`);
      }

      const parsed = Number.parseInt(rawValue, 10);
      if (!Number.isInteger(parsed) || parsed < 1) {
        throw new Error(
          `Gallery columns value must be an integer greater than 0. Received value: "${rawValue}".`,
        );
      }

      columns = parsed;
      return false;
    }

    if (lowerLine.startsWith("ratio=")) {
      const rawValue = line.slice("ratio=".length).trim();
      if (!rawValue) {
        throw new Error(`Gallery ratio value is missing. Received line: "${line}".`);
      }

      const parts = rawValue.split(/[:/]/).map((value) => value.trim());
      if (parts.length !== 2) {
        throw new Error(
          `Gallery ratio must include exactly two numbers separated by ":" or "/". Received value: "${rawValue}".`,
        );
      }

      const width = Number.parseFloat(parts[0]);
      const height = Number.parseFloat(parts[1]);

      if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        throw new Error(
          `Gallery ratio parts must be positive numbers. Received value: "${rawValue}".`,
        );
      }

      aspectRatio = { width, height };
      return false;
    }

    return true;
  });

  if (imageLines.length === 0) {
    throw new Error("Gallery block must include at least one image.");
  }

  const images: GalleryImage[] = imageLines.map((line) => {
    const [srcPart] = line.split("|");
    const src = srcPart?.trim();

    if (!src) {
      throw new Error(
        `Gallery entry is missing an image source. Received line: "${line}".`,
      );
    }

    const derivedAlt = src.split("/").pop() || "Gallery image";

    return {
      src,
      alt: derivedAlt,
    };
  });

  return {
    type: "gallery",
    id: `gallery-${index}`,
    images,
    columns,
    aspectRatio,
  };
}

function parseContent(rawContent: string): PostContentSegment[] {
  const segments: PostContentSegment[] = [];

  // Find all gallery and video blocks with their positions
  const blocks: Array<{ type: 'gallery' | 'video'; index: number; length: number; content: string }> = [];

  const galleryRegex = /:::gallery([\s\S]*?):::/g;
  const videoRegex = /:::video([\s\S]*?):::/g;

  let match: RegExpExecArray | null;

  while ((match = galleryRegex.exec(rawContent)) !== null) {
    blocks.push({
      type: 'gallery',
      index: match.index,
      length: match[0].length,
      content: match[1],
    });
  }

  while ((match = videoRegex.exec(rawContent)) !== null) {
    blocks.push({
      type: 'video',
      index: match.index,
      length: match[0].length,
      content: match[1],
    });
  }

  // Sort blocks by position
  blocks.sort((a, b) => a.index - b.index);

  let lastIndex = 0;
  let galleryCount = 0;
  let videoCount = 0;

  for (const block of blocks) {
    const precedingContent = rawContent.slice(lastIndex, block.index);

    if (precedingContent.trim().length > 0) {
      segments.push({
        type: "html",
        id: `html-${block.index}`,
        html: renderMarkdown(precedingContent),
      });
    }

    if (block.type === 'gallery') {
      segments.push(parseGalleryBlock(block.content, galleryCount));
      galleryCount += 1;
    } else if (block.type === 'video') {
      segments.push(parseVideoBlock(block.content, videoCount));
      videoCount += 1;
    }

    lastIndex = block.index + block.length;
  }

  const remainingContent = rawContent.slice(lastIndex);
  if (remainingContent.trim().length > 0) {
    segments.push({
      type: "html",
      id: `html-final`,
      html: renderMarkdown(remainingContent),
    });
  }

  // If we never pushed an HTML block (content was only whitespace and galleries),
  // ensure we at least return an empty paragraph to avoid layout jumps.
  if (segments.length === 0) {
    segments.push({
      type: "html",
      id: "html-empty",
      html: "",
    });
  }

  return segments;
}

function calculateReadingMinutes(rawContent: string): number {
  const cleanedContent = rawContent
    .replace(/:::gallery[\s\S]*?:::/g, " ")
    .replace(/:::video[\s\S]*?:::/g, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");

  const html = renderMarkdown(cleanedContent);
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return 1;
  }

  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}

function mapToSummary(record: PostSourceRecord): PostSummary {
  const { data: frontMatter, slug: fileSlug, locale } = record;

  const title = String(frontMatter.title || "").trim();
  if (!title) {
    throw new Error("Post is missing a title.");
  }

  const frontMatterSlug = String(frontMatter.slug || "").trim();
  const slug = frontMatterSlug || fileSlug;
  if (!slug) {
    throw new Error(`Post "${title}" is missing a slug.`);
  }

  const excerpt = String(frontMatter.excerpt || "").trim();
  if (!excerpt) {
    throw new Error(`Post "${title}" is missing an excerpt.`);
  }

  const author = String(frontMatter.author || "").trim();
  if (!author) {
    throw new Error(`Post "${title}" is missing an author.`);
  }

  const heroImage = String(frontMatter.heroImage || "").trim();
  const heroImageAlt = String(frontMatter.heroImageAlt || "").trim();
  if (!heroImage || !heroImageAlt) {
    throw new Error(`Post "${title}" must include heroImage and heroImageAlt.`);
  }

  const collectionSegments = [...(record.collectionSegments ?? [])];
  const pathSegments = [...collectionSegments];
  if (pathSegments[0] === "road-trips") {
    pathSegments.shift();
  }

  return {
    slug,
    locale,
    title,
    excerpt,
    date: parseDate(frontMatter.date),
    author,
    categories: normaliseCategories(frontMatter.categories),
    heroImage,
    heroImageAlt,
    collectionSegments,
    path: `/${[...pathSegments, slug].join("/")}`,
    relativePath: record.relativePath,
  };
}

const loadAllPostFiles = cache(async () => {
  const posts = postsSource
    .filter((entry) => {
      // Only include posts with status: published
      const frontMatter = entry.data as Record<string, unknown>;
      const status = String(frontMatter.status || "").trim().toLowerCase();
      return status === "published";
    })
    .map((entry) => {
      const summary = mapToSummary(entry);
      return {
        summary,
        content: entry.content,
        readingMinutes: calculateReadingMinutes(entry.content),
      };
    });

  return posts.sort(
    (a, b) =>
      new Date(b.summary.date).getTime() -
      new Date(a.summary.date).getTime(),
  );
});

function matchesCollection(summary: PostSummary, collectionSegments: string[]) {
  if (collectionSegments.length === 0) {
    return true;
  }
  return collectionSegments.every(
    (segment, index) => summary.collectionSegments[index] === segment,
  );
}

function normaliseCategory(category: string): string {
  return category.trim().toLowerCase();
}

export const getAllPosts = cache(async (locale?: string): Promise<PostSummary[]> => {
  const posts = await loadAllPostFiles();

  if (!locale) {
    return posts.map((post) => post.summary);
  }

  // Filter by locale, with fallback to English if no posts exist in requested locale
  const localePosts = posts.filter((post) => post.summary.locale === locale);
  if (localePosts.length > 0) {
    return localePosts.map((post) => post.summary);
  }

  // Fallback to English
  return posts.filter((post) => post.summary.locale === 'en').map((post) => post.summary);
});

export type GetPostsByCollectionOptions = {
  order?: "asc" | "desc";
};

export const getPostsByCollection = cache(
  async (
    locale: string,
    ...collectionSegmentsOrOptions: (string | GetPostsByCollectionOptions)[]
  ): Promise<PostSummary[]> => {
    let options: GetPostsByCollectionOptions = { order: "desc" };
    const collectionSegments: string[] = [];

    for (const entry of collectionSegmentsOrOptions) {
      if (typeof entry === "string") {
        collectionSegments.push(entry);
        continue;
      }

      if (entry && typeof entry === "object") {
        options = { ...options, ...entry };
      }
    }

    const posts = await loadAllPostFiles();
    const summaries = posts
      .map((post) => post.summary)
      .filter((summary) =>
        matchesCollection(summary, collectionSegments) &&
        summary.locale === locale
      );

    if (options.order === "asc") {
      return [...summaries].reverse();
    }

    return summaries;
  },
);

export const getPostBySlugAndLocale = cache(
  async (
    slug: string,
    locale: string,
    ...collectionSegments: string[]
  ): Promise<PostDetail> => {
    const posts = await loadAllPostFiles();

    // Try to find post in requested locale
    let post = posts.find(
      (entry) =>
        entry.summary.slug === slug &&
        entry.summary.locale === locale &&
        matchesCollection(entry.summary, collectionSegments),
    );

    // Fallback to English if not found and locale is not English
    let isFallback = false;
    if (!post && locale !== 'en') {
      post = posts.find(
        (entry) =>
          entry.summary.slug === slug &&
          entry.summary.locale === 'en' &&
          matchesCollection(entry.summary, collectionSegments),
      );
      isFallback = !!post;
    }

    if (!post) {
      const collectionHint =
        collectionSegments.length > 0
          ? ` within collection "${collectionSegments.join("/")}"`
          : "";
      throw new Error(`Post with slug "${slug}" was not found${collectionHint}.`);
    }

    return {
      ...post.summary,
      content: parseContent(post.content),
      readingMinutes: post.readingMinutes,
      isFallback,
    };
  },
);

// Keep the old function for backwards compatibility during migration
export const getPostBySlug = cache(
  async (
    slug: string,
    ...collectionSegments: string[]
  ): Promise<PostDetail> => {
    return getPostBySlugAndLocale(slug, 'en', ...collectionSegments);
  },
);

export const getPostsByCategory = cache(
  async (
    category: string,
    locale: string,
    ...collectionSegments: string[]
  ): Promise<PostSummary[]> => {
    const trimmedCategory = category?.trim();
    if (!trimmedCategory) {
      throw new Error("Category must be a non-empty string.");
    }
    const target = normaliseCategory(trimmedCategory);
    const posts = await loadAllPostFiles();
    return posts
      .map((post) => post.summary)
      .filter(
        (summary) =>
          matchesCollection(summary, collectionSegments) &&
          summary.locale === locale &&
          summary.categories.some(
            (entry) => normaliseCategory(entry) === target,
          ),
      );
  },
);

export function formatPostDate(dateIso: string, locale: string = 'en'): string {
  const localeString = locale === 'de' ? 'de-DE' : 'en-GB';
  return new Intl.DateTimeFormat(localeString, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateIso));
}
