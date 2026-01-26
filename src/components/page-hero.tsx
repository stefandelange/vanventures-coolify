import Image from "next/image";
import type { ReactNode } from "react";

type PageHeroProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  minHeight?: string;
  className?: string;
};

const DEFAULT_HEIGHT = "min-h-[26rem] sm:min-h-[32rem] lg:min-h-[36rem]";

export function PageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  children,
  minHeight,
  className = "object-cover"
}: PageHeroProps) {
  const formattedSrc = encodeURI(imageSrc);

  return (
    <section
      className={[
        "relative isolate flex items-end overflow-hidden",
        DEFAULT_HEIGHT,
        minHeight,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-0">
        <Image
          src={formattedSrc}
          alt={imageAlt}
          fill
          className={className}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-6 py-20 text-white sm:px-8 sm:py-28">
        <div className="space-y-4">
          {eyebrow ? (
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">{eyebrow}</p>
          ) : null}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {children ? (
            <div className="max-w-3xl text-base leading-relaxed text-white/85">{children}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
