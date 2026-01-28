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
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });
  const tMeta = await getTranslations({ locale, namespace: "metadata.privacyPolicy" });

  return createPageMetadata({
    locale,
    path: "/privacy-policy",
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: t("heroImageAlt"),
    },
    alternateLocales: [
      { locale: "en", path: "/privacy-policy" },
      { locale: "de", path: "/datenschutzerklaerung" },
    ],
  });
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPolicy" });

  return (
    <div className="bg-white text-[var(--color-charcoal)]">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={t("heroImageAlt")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="space-y-12 rounded-3xl border border-[var(--color-mist)]/60 bg-white/90 p-6 shadow-sm sm:p-10">
          {/* Last Updated */}
          <p className="text-sm font-medium text-[var(--color-slate)]">
            {t("lastUpdated")}
          </p>

          {/* Section 1 - Controller */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section1.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section1.controller") }}
              />
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section1.contact") }}
              />
            </div>
          </div>

          {/* Section 2 - General Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section2.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section2.paragraph1")}
              </p>
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section2.paragraph2")}
              </p>
            </div>
          </div>

          {/* Section 3 - Data Collection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section3.title")}
            </h2>

            {/* Hosting */}
            <div className="space-y-4 pl-4 border-l-2 border-[var(--color-mist)]">
              <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
                {t("section3.hosting.title")}
              </h3>
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.intro") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)] space-y-2"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.provider") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.dataProcessed") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.legalBasis") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.storageDuration") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.dpa") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.serverLocation") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)] [&_a]:text-[var(--color-forest)] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.hosting.moreInfo") }}
              />
            </div>

            {/* CDN */}
            <div className="space-y-4 pl-4 border-l-2 border-[var(--color-mist)]">
              <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">
                {t("section3.cdn.title")}
              </h3>
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.intro") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)] space-y-2"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.provider") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.dataProcessed") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.legalBasis") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.storageDuration") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.dpa") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)] [&_a]:text-[var(--color-forest)] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: t.raw("section3.cdn.moreInfo") }}
              />
            </div>
          </div>

          {/* Section 4 - Your Rights */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section4.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section4.intro")}
              </p>
              <div
                className="leading-relaxed text-[var(--color-slate)] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-2"
                dangerouslySetInnerHTML={{ __html: t.raw("section4.rights") }}
              />
              <div
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section4.complaint") }}
              />
            </div>
          </div>

          {/* Section 5 - Contact */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section5.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section5.paragraph1")}
              </p>
              <p
                className="leading-relaxed text-[var(--color-slate)] [&_a]:text-[var(--color-forest)] [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: t.raw("section5.email") }}
              />
            </div>
          </div>

          {/* Note */}
          <div className="border-t border-[var(--color-mist)] pt-8">
            <p
              className="leading-relaxed text-[var(--color-slate)] text-sm"
              dangerouslySetInnerHTML={{ __html: t.raw("note") }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
