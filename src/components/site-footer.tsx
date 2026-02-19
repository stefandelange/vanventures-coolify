import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { NewsletterForm } from "./newsletter-form";

const currentYear = new Date().getFullYear();

type FooterLink = {
  labelKey: string;
  href: string;
  icon?: string;
};

type FooterColumn = {
  titleKey: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    titleKey: "vanLifeCountries",
    links: [
      { labelKey: "ourBlog", href: "/van-life", icon: "📝" },
      { labelKey: "map", href: "/van-life/map", icon: "🗺️" },
      { labelKey: "austria", href: "/van-life-countries/austria", icon: "🇦🇹" },
      { labelKey: "belgium", href: "/van-life-countries/belgium", icon: "🇧🇪" },
      { labelKey: "norway", href: "/van-life-countries/norway", icon: "🇳🇴" },
      { labelKey: "poland", href: "/van-life-countries/poland", icon: "🇵🇱" },
      {
        labelKey: "slovakia",
        href: "/van-life-countries/slovakia",
        icon: "🇸🇰",
      },
    ],
  },
  {
    titleKey: "roadTrips",
    links: [
      {
        labelKey: "canadaRoadTrip2023",
        href: "/canada-road-trip-2023",
        icon: "🇨🇦",
      },
      {
        labelKey: "denmarkRoadTrip2024",
        href: "/denmark-road-trip-september-2024",
        icon: "🇩🇰",
      },
    ],
  },
  {
    titleKey: "vanVentures",
    links: [
      { labelKey: "equipmentList", href: "/wilma/equipment-list" },
      { labelKey: "sustainability", href: "/sustainability" },
      { labelKey: "friendsAndPartners", href: "/friends-and-partners" },
      { labelKey: "aboutUs", href: "/about-us" },
      {
        labelKey: "polarsteps",
        href: "https://www.polarsteps.com/VanVenturesBlog",
        icon: "↗",
      },
    ],
  },
  {
    titleKey: "wilma",
    links: [
      { labelKey: "baseVehicle", href: "/wilma" },
      { labelKey: "bikeCarrier", href: "/wilma/bike-carrier" },
      { labelKey: "electricity", href: "/wilma/electricity" },
      { labelKey: "gas", href: "/wilma/gas" },
      { labelKey: "internet", href: "/wilma/internet" },
      { labelKey: "outdoor", href: "/wilma/outdoor" },
      { labelKey: "toilet", href: "/wilma/toilet" },
    ],
  },
];

export function SiteFooter() {
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("navigation");

  return (
    <footer className="relative overflow-hidden text-white">
      <Image
        src="/images/road-trips/canada-2023/2023-10-01 15.59.04 Banff_3000px.jpg"
        alt="Image of Helmcken Falls in Wells Gray Provincial Park, Canada"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[rgba(43,43,43,0.78)] backdrop-blur-[2px]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 sm:px-8 sm:py-20">
        <div className="max-w-lg space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-mist)]">
            Vanventures.blog
          </p>
          <p className="text-2xl font-medium tracking-tight sm:text-3xl">
            {tFooter("tagline")}
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="w-full rounded-2xl bg-white/60 p-6 backdrop-blur sm:p-8 text-[var(--color-charcoal)] space-y-3">
            <h3 className="text-xl font-medium tracking-tight text-[var(--color-charcoal)] sm:text-2xl">
              {tFooter("socialMediaTitle")}
            </h3>
            <p className="text-sm">{tFooter("socialMediaText")}</p>
            <p className="text-xl italic">{tFooter("socialMediaQuote")}</p>
          </div>
          <NewsletterForm />
        </div>
        <div className="grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.titleKey} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                {column.titleKey === "wilma"
                  ? tNav("wilma")
                  : tFooter(column.titleKey)}
              </p>
              <ul className="space-y-2 text-white/80">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition hover:text-[var(--color-mist)]"
                    >
                      {link.icon ? <span aria-hidden>{link.icon} </span> : null}
                      {tNav(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div>{tFooter("copyright", { year: currentYear })}</div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:hello@vanventures.blog"
              className="hover:text-[var(--color-mist)]"
            >
              hello@vanventures.blog
            </a>
            <Link href="/imprint" className="hover:text-[var(--color-mist)]">
              {tFooter("imprint")}
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-[var(--color-mist)]"
            >
              {tFooter("privacyPolicy")}
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-[var(--color-mist)]"
            >
              {tFooter("cookiePolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
