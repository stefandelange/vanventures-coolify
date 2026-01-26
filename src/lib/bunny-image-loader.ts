const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const SITE_URL = "https://vanventures.blog";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

export default function bunnyImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (process.env.NODE_ENV === "development") {
    const searchParams = new URLSearchParams({
      width: String(width),
      quality: String(quality ?? 75),
    });
    return `${src}?${searchParams.toString()}`;
  }

  // Bunny CDN Optimizer uses query parameters
  const searchParams = new URLSearchParams({
    width: String(width),
    quality: String(quality ?? 75),
  });

  const resizeHost = CDN_URL ?? SITE_URL;
  const isAbsolute = /^https?:\/\//i.test(src);

  if (isAbsolute) {
    const url = new URL(src);
    url.search = searchParams.toString();
    return url.toString();
  }

  const normalizedPath = normalizeSrc(src);
  return `${resizeHost}/${normalizedPath}?${searchParams.toString()}`;
}
