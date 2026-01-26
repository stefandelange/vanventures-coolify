import type { Metadata } from "next";

const SITE_URL = "https://vanventures.blog";

const BASE_METADATA: Metadata = {
  title: "VanVentures – Van Life Stories & Guides",
  description:
    "VanVentures is our travel journal capturing van life adventures, detailed route ideas, and practical touring tips across Europe.",
  openGraph: {
    type: "website",
    siteName: "VanVentures",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@vanventuresblog",
  },
};

function toAbsoluteUrl(path: string): string {
  if (!path) {
    return SITE_URL;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return encodeURI(path);
  }
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return encodeURI(`${SITE_URL}${formattedPath}`);
}

type HeroImageConfig = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type CreatePageMetadataOptions = {
  locale: string;
  path: string;
  title: string;
  description: string;
  heroImage: HeroImageConfig;
  alternateLocales?: { locale: string; path: string }[];
  openGraph?: Partial<NonNullable<Metadata["openGraph"]>>;
  twitter?: Partial<NonNullable<Metadata["twitter"]>>;
  overrides?: Partial<Metadata>;
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  heroImage,
  alternateLocales = [],
  openGraph,
  twitter,
  overrides,
}: CreatePageMetadataOptions): Metadata {
  const absoluteHeroUrl = toAbsoluteUrl(heroImage.src);
  const defaultOgImage = {
    url: absoluteHeroUrl,
    width: heroImage.width ?? 1600,
    height: heroImage.height ?? 900,
    alt: heroImage.alt,
  };

  // Build hreflang alternates
  const alternates: Metadata['alternates'] = {
    canonical: toAbsoluteUrl(`/${locale}${path}`),
  };

  if (alternateLocales.length > 0) {
    alternates.languages = alternateLocales.reduce((acc, alt) => {
      acc[alt.locale] = toAbsoluteUrl(`/${alt.locale}${alt.path}`);
      return acc;
    }, {} as Record<string, string>);
  }

  const mergedOpenGraph = {
    ...(BASE_METADATA.openGraph ?? {}),
    url: toAbsoluteUrl(`/${locale}${path}`),
    locale: locale === 'de' ? 'de_DE' : 'en_GB',
    title,
    description,
    images: openGraph?.images ?? [defaultOgImage],
    ...openGraph,
  };

  const mergedTwitter = {
    ...(BASE_METADATA.twitter ?? {}),
    title,
    description,
    images: twitter?.images ?? [absoluteHeroUrl],
    ...twitter,
  };

  return {
    ...BASE_METADATA,
    ...overrides,
    title,
    description,
    alternates,
    openGraph: mergedOpenGraph,
    twitter: mergedTwitter,
  };
}
