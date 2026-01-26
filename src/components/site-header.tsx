"use client";

import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { defaultHeaderConfig, useHeaderConfig } from "./site-header-context";
import { LanguageSwitcher } from "./language-switcher";

type NavigationItem = {
  id: string;
  labelKey: string;
  href?: string;
  children?: { id: string; labelKey: string; href: string; icon?: string }[];
};

const navigation: NavigationItem[] = [
  {
    id: "van-life",
    labelKey: "vanLife",
    href: "/van-life",
    children: [
      { id: "our-blog", labelKey: "ourBlog", href: "/van-life", icon: "📝" },
      { id: "map", labelKey: "map", href: "/van-life/map", icon: "🗺️" },
      {
        id: "austria",
        labelKey: "austria",
        href: "/van-life-countries/austria",
        icon: "🇦🇹",
      },
      {
        id: "belgium",
        labelKey: "belgium",
        href: "/van-life-countries/belgium",
        icon: "🇧🇪",
      },
      {
        id: "norway",
        labelKey: "norway",
        href: "/van-life-countries/norway",
        icon: "🇳🇴",
      },
      {
        id: "poland",
        labelKey: "poland",
        href: "/van-life-countries/poland",
        icon: "🇵🇱",
      },
      {
        id: "slovakia",
        labelKey: "slovakia",
        href: "/van-life-countries/slovakia",
        icon: "🇸🇰",
      },
    ],
  },
  {
    id: "road-trips",
    labelKey: "roadTrips",
    children: [
      {
        id: "canada-road-trip-2023",
        labelKey: "canadaRoadTrip2023",
        href: "/canada-road-trip-2023",
        icon: "🇨🇦",
      },
      {
        id: "denmark-road-trip-2024",
        labelKey: "denmarkRoadTrip2024",
        href: "/denmark-road-trip-september-2024",
        icon: "🇩🇰",
      },
    ],
  },
  { id: "about-us", labelKey: "aboutUs", href: "/about-us" },
  {
    id: "wilma",
    labelKey: "wilma",
    href: "/wilma",
    children: [
      { id: "base-vehicle", labelKey: "baseVehicle", href: "/wilma" },
      { id: "bike-carrier", labelKey: "bikeCarrier", href: "/wilma/bike-carrier" },
      { id: "electricity", labelKey: "electricity", href: "/wilma/electricity" },
      {
        id: "equipment-list",
        labelKey: "equipmentList",
        href: "/wilma/equipment-list",
      },
      { id: "gas", labelKey: "gas", href: "/wilma/gas" },
      { id: "internet", labelKey: "internet", href: "/wilma/internet" },
      { id: "outdoor", labelKey: "outdoor", href: "/wilma/outdoor" },
      { id: "toilet", labelKey: "toilet", href: "/wilma/toilet" },
    ],
  },
  { id: "sustainability", labelKey: "sustainability", href: "/sustainability" },
];

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getSectionId(id: string) {
  return `nav-section-${id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [desktopOpenDropdown, setDesktopOpenDropdown] = useState<string | null>(
    null
  );
  const { config: headerConfig } = useHeaderConfig();
  const previousPageStateRef = useRef<{
    bodyOverflow: string;
    bodyPosition: string;
    bodyTop: string;
    bodyWidth: string;
    htmlOverflow: string;
    scrollY: number;
  } | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function handleDesktopSubmenuItemClick(
    event: ReactMouseEvent<HTMLAnchorElement>
  ) {
    // Close dropdown after navigation
    setDesktopOpenDropdown(null);
    event.currentTarget.blur();
  }

  function toggleDesktopDropdown(id: string) {
    setDesktopOpenDropdown((current) => (current === id ? null : id));
  }

  function isActive(href?: string) {
    if (!href) {
      return false;
    }
    if (href === "/") {
      return pathname === href;
    }
    if (href === "/van-life") {
      return (
        pathname === href ||
        (pathname ? /^\/van-life\/\d{4}/.test(pathname) : false)
      );
    }
    if (href === "/wilma") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  }

  function toggleSection(id: string) {
    setOpenSection((current) => (current === id ? null : id));
  }

  function closeMobileMenu() {
    setMobileOpen(false);
    setOpenSection(null);
  }

  function restorePageState() {
    if (typeof document === "undefined") {
      return;
    }

    const previous = previousPageStateRef.current;
    if (!previous) {
      return;
    }

    document.documentElement.style.overflow = previous.htmlOverflow;
    document.body.style.overflow = previous.bodyOverflow;
    document.body.style.position = previous.bodyPosition;
    document.body.style.top = previous.bodyTop;
    document.body.style.width = previous.bodyWidth;

    if (typeof window !== "undefined") {
      window.scrollTo(0, previous.scrollY);
    }

    previousPageStateRef.current = null;
  }

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    if (mobileOpen) {
      const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;

      const state = {
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        bodyTop: document.body.style.top,
        bodyWidth: document.body.style.width,
        htmlOverflow: document.documentElement.style.overflow,
        scrollY: currentScrollY,
      };

      previousPageStateRef.current = state;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${state.scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        restorePageState();
      };
    }

    restorePageState();
    return undefined;
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        restorePageState();
      }
    };
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    if (!desktopOpenDropdown) {
      return undefined;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const currentDropdown =
        desktopOpenDropdown && dropdownRefs.current[desktopOpenDropdown];

      if (currentDropdown && !currentDropdown.contains(target)) {
        setDesktopOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [desktopOpenDropdown]);

  function navItemClass({
    href,
    active,
  }: { href?: string; active?: boolean } = {}) {
    const isCurrent = active ?? (href ? isActive(href) : false);
    return classNames(
      "text-[1.125rem] leading-tight transition hover:underline underline-offset-8",
      isCurrent && "underline"
    );
  }

  const headerWrapperClassName = classNames(
    "absolute inset-x-0 top-0 z-40 transition-colors duration-300",
    headerConfig.wrapperClassName ?? defaultHeaderConfig.wrapperClassName
  );

  return (
    <header className={headerWrapperClassName}>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight"
        >
          <Image
            src="/images/general/vanventures-logo-800.png"
            alt="VanVentures logo"
            width={100}
            height={100}
            className="h-[100px] w-[100px] object-contain"
            priority
          />
          <span className="sr-only">VanVentures</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <nav
            className="flex items-center gap-6 text-[1.125rem] font-normal"
            aria-label="Primary"
          >
            {navigation.map((item) => {
              const itemHasChildren = Boolean(item.children?.length);
              const itemActive =
                (item.href ? isActive(item.href) : false) ||
                (itemHasChildren
                  ? item.children!.some((child) => isActive(child.href))
                  : false);
              const dropdownOpen = desktopOpenDropdown === item.id;
              const label = t(item.labelKey);

              return (
                <div
                  key={item.id}
                  className="relative pb-4"
                  ref={(el) => {
                    dropdownRefs.current[item.id] = el;
                  }}
                >
                  <div className="flex items-center gap-2">
                    {item.href && !itemHasChildren ? (
                      <Link
                        href={item.href}
                        className={navItemClass({
                          href: item.href,
                          active: itemActive,
                        })}
                      >
                        {label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (itemHasChildren) {
                            toggleDesktopDropdown(item.id);
                          }
                        }}
                        className={classNames(
                          navItemClass({ active: itemActive }),
                          "cursor-pointer"
                        )}
                      >
                        {label}
                      </button>
                    )}
                  </div>
                  {item.children && dropdownOpen ? (
                    <div className="absolute left-0 top-full z-50 flex min-w-[13rem] flex-col gap-1 rounded-xl bg-[rgba(43,43,43,0.8)] p-3 text-sm text-white shadow-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={classNames(
                            "flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/10",
                            isActive(child.href) &&
                              "bg-white/10 text-[var(--color-mist)]"
                          )}
                          onClick={handleDesktopSubmenuItemClick}
                        >
                          {child.icon ? (
                            <span aria-hidden>{child.icon}</span>
                          ) : null}
                          <span>{t(child.labelKey)}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
          <LanguageSwitcher />
        </div>
        <button
          type="button"
          className="flex h-16 w-16 items-center justify-center text-white md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? t("closeNavigation") : t("openNavigation")}
        >
          <span className="text-[2.25rem] leading-none" aria-hidden>
            {mobileOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 flex min-h-[100dvh] flex-col bg-white text-sm text-[var(--color-charcoal)] md:hidden">
          <button
            type="button"
            className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center text-[var(--color-charcoal)] sm:right-8 sm:top-8"
            onClick={closeMobileMenu}
            aria-label={t("closeNavigation")}
          >
            <span className="text-[2.25rem] leading-none" aria-hidden>
              ✕
            </span>
          </button>
          <div className="flex-1 overflow-y-auto px-6 pb-12 pt-28 sm:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
              {navigation.map((item) => {
                const itemHasChildren = Boolean(item.children?.length);
                const sectionOpen = openSection === item.id;
                const label = t(item.labelKey);

                return (
                  <div
                    key={item.id}
                    className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    {itemHasChildren ? (
                      <>
                        <button
                          type="button"
                          className={classNames(
                            "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left font-medium text-[var(--color-charcoal)] transition hover:bg-slate-100",
                            sectionOpen && "bg-slate-100"
                          )}
                          onClick={() => toggleSection(item.id)}
                          aria-expanded={sectionOpen ? "true" : "false"}
                          aria-controls={getSectionId(item.id)}
                        >
                          <span>{label}</span>
                          <span className="shrink-0 text-base" aria-hidden>
                            {sectionOpen ? "−" : "+"}
                          </span>
                        </button>
                        <div
                          id={getSectionId(item.id)}
                          className={classNames(
                            "flex flex-col gap-2 pl-4 text-[var(--color-charcoal)] transition-[max-height,opacity] duration-200 ease-out",
                            sectionOpen
                              ? "mt-3 max-h-[28rem] opacity-100"
                              : "max-h-0 overflow-hidden opacity-0"
                          )}
                        >
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={classNames(
                                "flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100",
                                isActive(child.href) &&
                                  "bg-slate-100 text-[var(--color-charcoal)]"
                              )}
                              onClick={closeMobileMenu}
                            >
                              {child.icon ? (
                                <span aria-hidden className="text-base">
                                  {child.icon}
                                </span>
                              ) : null}
                              <span>{t(child.labelKey)}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : item.href ? (
                      <Link
                        href={item.href}
                        className={classNames(
                          "flex w-full items-center rounded-xl px-4 py-3 font-medium text-[var(--color-charcoal)] transition hover:bg-slate-100",
                          isActive(item.href) &&
                            "bg-slate-100 text-[var(--color-charcoal)]"
                        )}
                        onClick={closeMobileMenu}
                      >
                        {label}
                      </Link>
                    ) : null}
                  </div>
                );
              })}
              <div className="pt-4">
                <LanguageSwitcher variant="light" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
