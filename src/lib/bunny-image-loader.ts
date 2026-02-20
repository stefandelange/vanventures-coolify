import { CDN_URL } from "@/config/cdn";

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
  // Bunny CDN Optimizer uses query parameters
  const searchParams = new URLSearchParams({
    width: String(width),
    quality: String(quality ?? 75),
  });

  const resizeHost = CDN_URL;
  const isAbsolute = /^https?:\/\//i.test(src);

  if (isAbsolute) {
    const url = new URL(src);
    url.search = searchParams.toString();
    return url.toString();
  }

  // Properly encode the path to handle spaces and special characters
  const normalizedPath = normalizeSrc(src);
  const url = new URL(normalizedPath, resizeHost);
  url.search = searchParams.toString();
  return url.toString();
}
