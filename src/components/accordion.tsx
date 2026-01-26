'use client';

import { useState } from "react";

type AccordionSectionContent = Record<string, string>;

export type AccordionSections = Record<string, AccordionSectionContent>;

type AccordionProps = {
  sections: AccordionSections;
  defaultOpenKey?: string | null;
};

function PlusIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5 text-slate-500"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" d="M10 4.167v11.666M4.167 10h11.666" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      aria-hidden
      className="h-5 w-5 text-slate-500"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" d="M4.167 10h11.666" />
    </svg>
  );
}

export function Accordion({ sections, defaultOpenKey = null }: AccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(defaultOpenKey);
  const entries = Object.entries(sections);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-slate-200 border-y border-slate-200">
      {entries.map(([title, items], index) => {
        const isOpen = openKey === title;
        const panelId = `accordion-panel-${index}`;

        return (
          <div key={title} className="bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-6 px-4 py-5 text-left transition hover:bg-slate-50 sm:px-6 cursor-pointer"
              aria-controls={panelId}
              aria-expanded={isOpen}
              onClick={() => setOpenKey(isOpen ? null : title)}
            >
              <span className="text-lg font-semibold text-slate-900 sm:text-xl">
                {title}
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300">
                {isOpen ? <MinusIcon /> : <PlusIcon />}
              </span>
            </button>

            {isOpen ? (
              <div id={panelId} className="px-4 pb-6 sm:px-6">
                <ul className="list-disc space-y-4 pl-5">
                  {Object.entries(items).map(([heading, body]) => (
                    <li key={heading} className="text-base text-slate-700 sm:text-lg">
                      <span className="font-semibold text-slate-900">{heading}:</span>{" "}
                      <span>{body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
