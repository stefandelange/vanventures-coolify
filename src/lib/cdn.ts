const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export function cdnUrl(path: string): string {
  if (CDN_URL && (path.startsWith("/images/") || path.startsWith("/videos/"))) {
    return `${CDN_URL}${path}`;
  }
  return path;
}
