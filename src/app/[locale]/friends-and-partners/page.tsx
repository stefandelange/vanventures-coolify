import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

const HERO_IMAGE_SRC = "/images/road-trips/canada-2023/2023-09-14 18.36.48 Vancouver Island_3000px.jpg";

type Partner = {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  bgColor?: string;
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "friendsAndPartners" });
  const tMeta = await getTranslations({
    locale,
    namespace: "metadata.friendsAndPartners",
  });

  return createPageMetadata({
    locale,
    path: "/friends-and-partners",
    title: t("title"),
    description: tMeta("description"),
    heroImage: {
      src: HERO_IMAGE_SRC,
      alt: tMeta("heroImageAlt"),
    },
    alternateLocales: [
      { locale: "en", path: "/friends-and-partners" },
      { locale: "de", path: "/friends-and-partners" },
    ],
  });
}

export default async function FriendsAndPartnersPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "friendsAndPartners" });
  const tMeta = await getTranslations({
    locale,
    namespace: "metadata.friendsAndPartners",
  });

  const partners = t.raw("partners") as Partner[];

  return (
    <div className="bg-white">
      <PageHero
        imageSrc={HERO_IMAGE_SRC}
        imageAlt={tMeta("heroImageAlt")}
        eyebrow=""
        title={t("title")}
        minHeight="min-h-[60vh]"
      />
      <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10">
        <p className="text-lg leading-relaxed text-slate-600">{t("intro")}</p>

        <div className="flex flex-col">
          {partners.map((partner, index) => {
            const isEven = index % 2 === 0;
            const isFirst = index === 0;

            return (
              <div
                key={partner.id}
                className={`flex flex-col gap-8 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } md:items-start ${isFirst ? "" : "mt-24"}`}
              >
                {/* Text - always second on mobile */}
                <div className="order-2 flex-1 space-y-4 md:order-none">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {partner.name}
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600">
                    {partner.description}
                  </p>
                  <Link
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-slate)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-charcoal)]"
                  >
                    {t("visitWebsite")}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                {/* Image - always first on mobile */}
                <div className="order-1 flex-1 md:order-none">
                  <div
                    className="overflow-hidden rounded-xl p-6"
                    style={{ backgroundColor: partner.bgColor || "#ffffff" }}
                  >
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
