'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { CDN_URL } from "@/config/cdn";

type GalleryImage = {
  src: string;
  alt: string;
};

type GalleryAspectRatio = {
  width: number;
  height: number;
};

type GalleryProps = {
  images: GalleryImage[];
  imageHeightClass?: string;
  columns?: number;
  aspectRatio?: GalleryAspectRatio;
};

export function Gallery({
  images,
  imageHeightClass,
  columns,
  aspectRatio,
}: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const columnCount = Math.max(1, columns ?? 3);
  const defaultHeightClass = imageHeightClass ?? "h-56";
  const gridStyle = {
    "--gallery-columns": columnCount,
  } as CSSProperties;
  const desktopSize = `calc(100vw / ${columnCount})`;
  const aspectRatioStyle: CSSProperties | undefined = aspectRatio
    ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` }
    : undefined;

  const scrollLockedOffset = useRef(0);
  const preloadedImages = useRef<Set<string>>(new Set());
  const previousStylesRef = useRef({
    bodyOverflow: "",
    bodyPosition: "",
    bodyTop: "",
    bodyWidth: "",
    docOverflow: "",
  });

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setIsImageLoading(false);
  }, []);

  const handleActivateImage = useCallback(
    (index: number) => {
      if (images.length === 0) {
        return;
      }

      const normalizedIndex = (index + images.length) % images.length;

      if (activeIndex === normalizedIndex) {
        return;
      }

      setIsImageLoading(true);
      setActiveIndex(normalizedIndex);
    },
    [activeIndex, images.length],
  );

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }
      if (event.key === "ArrowRight") {
        handleActivateImage(activeIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        handleActivateImage(activeIndex - 1);
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    if (typeof window !== "undefined") {
      const { body, documentElement } = document;
      const bodyStyle = body.style;
      const docStyle = documentElement.style;

      previousStylesRef.current = {
        bodyOverflow: bodyStyle.overflow,
        bodyPosition: bodyStyle.position,
        bodyTop: bodyStyle.top,
        bodyWidth: bodyStyle.width,
        docOverflow: docStyle.overflow,
      };

      scrollLockedOffset.current = window.scrollY;
      bodyStyle.overflow = "hidden";
      bodyStyle.position = "fixed";
      bodyStyle.top = `-${scrollLockedOffset.current}px`;
      bodyStyle.width = "100%";
      docStyle.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keyup", handleKeyUp);

      if (typeof window !== "undefined") {
        const { body, documentElement } = document;
        const bodyStyle = body.style;
        const docStyle = documentElement.style;
        const previous = previousStylesRef.current;

        bodyStyle.overflow = previous.bodyOverflow;
        bodyStyle.position = previous.bodyPosition;
        bodyStyle.top = previous.bodyTop;
        bodyStyle.width = previous.bodyWidth;
        docStyle.overflow = previous.docOverflow;

        window.scrollTo(0, scrollLockedOffset.current);
      }
    };
  }, [activeIndex, closeLightbox, handleActivateImage]);

  useEffect(() => {
    if (activeIndex === null || typeof window === "undefined") {
      return;
    }

    const preload = (index: number) => {
      if (images.length === 0) {
        return;
      }

      const normalizedIndex = (index + images.length) % images.length;
      const image = images[normalizedIndex];

      if (!image || preloadedImages.current.has(image.src)) {
        return;
      }

      const preloadImage = new window.Image();
      preloadImage.src = image.src.startsWith("/") ? `${CDN_URL}${image.src}` : image.src;
      preloadedImages.current.add(image.src);
    };

    preload(activeIndex);
    preload(activeIndex + 1);
    preload(activeIndex - 1);
  }, [activeIndex, images]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div
        className="grid gap-4 grid-cols-1 sm:[grid-template-columns:repeat(var(--gallery-columns),minmax(0,1fr))]"
        style={gridStyle}
      >
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => handleActivateImage(index)}
            className="group relative block cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          >
            <div
              className={`relative w-full${aspectRatioStyle ? "" : ` ${defaultHeightClass}`}`}
              style={aspectRatioStyle}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes={`(max-width: 640px) 100vw, ${desktopSize}`}
              />
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-50 flex min-h-[100dvh] w-full items-center justify-center bg-black/95 px-3 py-6 backdrop-blur-sm sm:px-8 sm:py-8">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-[100] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/15 text-3xl font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/30 hover:text-white sm:right-6 sm:top-6 sm:h-14 sm:w-14 sm:text-5xl"
            aria-label="Close gallery"
          >
            &times;
          </button>

          <div className="relative flex h-full w-full max-w-[min(1800px,95vw)] flex-col items-center gap-6 sm:gap-8">
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="relative h-full w-full max-h-[100dvh] overflow-hidden bg-black">
                <Image
                  key={images[activeIndex].src}
                  src={images[activeIndex].src}
                  alt={images[activeIndex].alt}
                  fill
                  className={`object-contain transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
                  sizes="100vw"
                  priority
                  loading="eager"
                  onLoadingComplete={() => setIsImageLoading(false)}
                />

                {isImageLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/70">
              <button
                type="button"
                onClick={() =>
                  handleActivateImage(
                    (activeIndex - 1 + images.length) % images.length,
                  )
                }
                className="cursor-pointer rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
              >
                ← Prev
              </button>
              <span>
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleActivateImage((activeIndex + 1) % images.length)
                }
                className="cursor-pointer rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
