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
          {/* Section 1 */}
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

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section2.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section2.paragraph1")}
              </p>
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section2.paragraph2") }}
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section3.title")}
            </h2>
            <div className="space-y-4 text-base">
              <div className="space-y-3">
                <p
                  className="leading-relaxed text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: t.raw("section3.itemA") }}
                />
                <p
                  className="leading-relaxed text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: t.raw("section3.itemB") }}
                />
                <p
                  className="leading-relaxed text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: t.raw("section3.itemC") }}
                />
                <p
                  className="leading-relaxed text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: t.raw("section3.itemD") }}
                />
                <p
                  className="leading-relaxed text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: t.raw("section3.itemE") }}
                />
                <p
                  className="leading-relaxed text-[var(--color-slate)]"
                  dangerouslySetInnerHTML={{ __html: t.raw("section3.itemF") }}
                />
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section4.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section4.intro")}
              </p>
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section4.necessary") }}
              />
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section4.optional") }}
              />
              <p
                className="leading-relaxed text-[var(--color-slate)]"
                dangerouslySetInnerHTML={{ __html: t.raw("section4.settings") }}
              />
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section5.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section5.googleFonts")}
              </p>
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section5.amazon")}
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section6.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section6.intro")}
              </p>
              <div className="space-y-3">
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right1")}
                </p>
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right2")}
                </p>
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right3")}
                </p>
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right4")}
                </p>
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right5")}
                </p>
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right6")}
                </p>
                <p className="leading-relaxed text-[var(--color-slate)]">
                  {t("section6.right7")}
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-charcoal)]">
              {t("section7.title")}
            </h2>
            <div className="space-y-4 text-base">
              <p className="leading-relaxed text-[var(--color-slate)]">
                {t("section7.paragraph1")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
