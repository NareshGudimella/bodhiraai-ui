"use client";

import { useId, useRef, useState } from "react";

/**
 * Accessible tabs for the redesigned course-details page (not in legacy:
 * replaces the theme's Bootstrap `data-bs-toggle="tab"` markup with a small
 * client component, so it no longer depends on the theme's jQuery/Bootstrap
 * bundle). Arrow keys / Home / End move between tabs. Every panel is rendered
 * (inactive ones `hidden`), so all content stays in the HTML.
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
    <div className="bpc-tabs">
      <div className="bpc-tabs__list" role="tablist" aria-label={label}>
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
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} className="bpc-tabs__panel" role="tabpanel" id={`${base}-panel-${i}`} aria-labelledby={`${base}-tab-${i}`} hidden={active !== i} tabIndex={0}>
          {p}
        </div>
      ))}
    </div>
  );
}
