import type { Metadata } from "next";
import { WorldTravelMapClient } from "@/components/world-travel-map-client";
import { getTranslations } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "navigation" });
  return {
    title: `${tNav("scratchMap")} | VanVentures`,
    description:
      "An interactive scratch map of all the countries and US states Stefan and Kathrin have visited.",
  };
}

export default async function WorldTravelMapPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "scratchMapPage" });
  const tNav = await getTranslations({ locale, namespace: "navigation" });

  const legendItems = [
    { color: "#22c55e", border: "#15803d", label: tNav("kathrinAndStefan") },
    { color: "#a855f7", border: "#7e22ce", label: "Kathrin" },
    { color: "#3b82f6", border: "#1d4ed8", label: "Stefan" },
  ];

  return (
    <main className="bg-[var(--color-charcoal)] text-white">
      <div className="space-y-6 px-6 pb-8 pt-36 sm:px-12 sm:pt-44 lg:px-20">
        <h1 className="mx-auto max-w-5xl text-3xl font-medium tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <WorldTravelMapClient
          legendTitle={t("legend")}
          legendItems={legendItems}
        />
      </div>
    </main>
  );
}
