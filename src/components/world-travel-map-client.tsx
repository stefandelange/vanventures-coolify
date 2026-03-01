"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const WorldTravelMap = dynamic(() => import("@/components/world-travel-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-slate-400">
      Loading map…
    </div>
  ),
});

type LegendItem = { color: string; border: string; label: string };

type Props = {
  legendTitle: string;
  legendItems: LegendItem[];
};

export function WorldTravelMapClient({ legendTitle, legendItems }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  function toggleFullscreen() {
    setFullscreen((prev) => !prev);
    setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
  }

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 bg-slate-100"
          : "relative z-0 h-[80vh] w-full overflow-hidden rounded-xl"
      }
    >
      <WorldTravelMap />

      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-4 top-4 z-[1000] flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {fullscreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="10" y1="14" x2="3" y2="21" />
            <line x1="21" y1="3" x2="14" y2="10" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>

      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {legendTitle}
        </p>
        <ul className="flex flex-col gap-2">
          {legendItems.map(({ color, border, label }) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 flex-shrink-0 rounded-sm"
                style={{
                  backgroundColor: color,
                  border: `2px solid ${border}`,
                  opacity: 0.85,
                }}
              />
              <span className="text-sm text-slate-700">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
