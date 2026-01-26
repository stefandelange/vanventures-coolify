"use client";

import { useCallback, useEffect, useState } from "react";

const VIEWPORT_THRESHOLD = 1;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const yOffset = window.scrollY || window.pageYOffset;
      const threshold = window.innerHeight * VIEWPORT_THRESHOLD;
      const shouldShow = yOffset > threshold;
      setIsVisible(shouldShow);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to the top of the page"
      className={`cursor-pointer pointer-events-auto fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-lg transition-all duration-200 hover:border-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span aria-hidden>↑</span>
      <span>Top</span>
    </button>
  );
}
