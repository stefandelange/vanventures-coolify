import { CDN_URL } from "@/config/cdn";

export function cdnUrl(path: string): string {
  if (path.startsWith("/images/") || path.startsWith("/videos/")) {
    return `${CDN_URL}${path}`;
  }
  return path;
}
