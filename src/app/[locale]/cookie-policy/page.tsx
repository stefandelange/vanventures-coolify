import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/2023-09-14 18.36.48 Vancouver Island_3000px.jpg";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiePolicy" });

  return createPageMetadata({
    locale,
    path: "/cookie-policy",
    title: t("title"),
    description: t("section2.paragraph2"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: "en", path: "/cookie-policy" },
      { locale: "de", path: "/cookie-richtlinie" },
    ],
  });
}

export default async function CookiePolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiePolicy" });

  return (
    <div className="bg-white text-[var(--color-charcoal)]">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="space-y-12 rounded-xl border border-[var(--color-mist)]/60 bg-white/90 p-6 shadow-sm sm:p-10">
          {/* Last Updated */}
          <p className="text-sm font-medium text-[var(--color-slate)]">
            {t("lastUpdated")}
          </p>

          {/* Section 1 - What are Cookies? */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section1.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section1.paragraph1")}
              </p>
            </div>
          </div>

          {/* Section 2 - Our Use of Cookies */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section2.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section2.paragraph1") }}
              />
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section2.paragraph2")}
              </p>
            </div>
          </div>

          {/* Section 3 - Third-Party Services */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section3.title")}
            </h2>
            <p className="leading-relaxed text-[var(--color-slate)]">
              {t("section3.intro")}
            </p>

            {/* Hosting */}
            <div className="space-y-4 pl-4 border-l-2 border-[var(--color-mist)]">
              <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
                {t("section3.hosting.title")}
              </h3>
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section3.hosting.paragraph1")}
              </p>
            </div>

            {/* CDN */}
            <div className="space-y-4 pl-4 border-l-2 border-[var(--color-mist)]">
              <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
                {t("section3.cdn.title")}
              </h3>
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section3.cdn.paragraph1")}
              </p>
            </div>

            <p
              className="leading-relaxed text-[var(--color-slate)] [&_a]:text-[var(--color-forest)] [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: t.raw("section3.moreInfo") }}
            />
          </div>

          {/* Section 4 - Your Rights */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section4.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section4.paragraph1")}
              </p>
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section4.paragraph2")}
              </p>
              <div
                className="leading-relaxed text-[var(--color-slate)] [&_a]:text-[var(--color-forest)] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: t.raw("section4.contact") }}
              />
            </div>
          </div>

          {/* Section 5 - Changes */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section5.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section5.paragraph1")}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-[var(--color-mist)] pt-8">
            <p
              className="leading-relaxed text-[var(--color-slate)] text-sm"
              dangerouslySetInnerHTML={{ __html: t.raw("summary") }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
