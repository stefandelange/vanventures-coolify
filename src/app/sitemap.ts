import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { locales } from '@/i18n/config';

const SITE_URL = 'https://vanventures.blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = [
    '/',
    '/van-life',
    '/about-us',
    '/sustainability',
    '/wilma',
    '/privacy-policy',
    '/imprint',
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: page === '/' ? 1.0 : 0.8,
      });
    }
  }

  // Blog posts - only include if translation exists in that locale
  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      // Only add if post exists in this locale (not fallback)
      if (post.locale === locale) {
        entries.push({
          url: `${SITE_URL}/${locale}${post.path}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}
