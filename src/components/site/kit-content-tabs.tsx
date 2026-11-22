"use client";

import { useId, useRef, useState } from "react";
import { FOCUS_BUTTON } from "./kit-content-ui";
import { cx } from "./ui";

/**
 * Accessible tabs for the redesigned course-details page (not in legacy:
 * replaces the theme's Bootstrap `data-bs-toggle="tab"` markup with a small
 * client component, so it no longer depends on the theme's jQuery/Bootstrap
 * bundle). Arrow keys / Home / End move between tabs. Every panel is rendered
 * (inactive ones `hidden`), so all content stays in the HTML. Tailwind since the
 * migration's phase 2 (was `.bpc-tabs*` in site-ui-content.css).
 */
export function KitTabs({ tabs, panels, label }: { tabs: { label: string; icon?: React.ReactNode }[]; panels: React.ReactNode[]; label: string }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div className="flex gap-1 overflow-x-auto border-b border-line bg-cream p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-controls={`${base}-panel-${i}`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              "inline-flex min-h-12 flex-[1_0_auto] cursor-pointer items-center justify-center gap-2 rounded-[14px] border-0 px-5 font-sans text-[15px] leading-none font-bold max-md:px-3.5 max-md:text-[14px]",
              "[transition:background_.2s,color_.2s,box-shadow_.2s] hover:text-maroon",
              active === i ? "bg-white text-maroon shadow-sm" : "bg-transparent text-body",
              FOCUS_BUTTON,
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={i}
          className="p-9 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-maroon max-md:px-5 max-md:py-6"
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          hidden={active !== i}
          tabIndex={0}
        >
          {p}
        </div>
      ))}
    </div>
  );
}
