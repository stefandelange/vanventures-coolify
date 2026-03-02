import { unstable_cache } from "next/cache";
import bunnyImageLoader from "./bunny-image-loader";

// Static placeholder for client components (gallery thumbnails etc.)
// 1x1 slate-100 (#f1f5f9) pixel
export const STATIC_BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=";

async function fetchBlurDataURL(src: string): Promise<string> {
  const url = bunnyImageLoader({ src, width: 20, quality: 30 });
  try {
    const res = await fetch(url);
    if (!res.ok) return STATIC_BLUR_PLACEHOLDER;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${contentType};base64,${base64}`;
  } catch {
    return STATIC_BLUR_PLACEHOLDER;
  }
}

// Cached forever — images are immutable on the CDN
export const getBlurDataURL = unstable_cache(
  fetchBlurDataURL,
  ["blur-data-url"],
  { revalidate: false },
);
