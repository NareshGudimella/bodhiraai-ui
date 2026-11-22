"use client";

import { usePathname } from "next/navigation";

type Item = { label: string; url: string; target: string };

/** Which menu item the path belongs to: "/" only matches itself, others by prefix. not in legacy */
function isActive(url: string, path: string) {
  if (!url.startsWith("/")) return false;
  const base = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return base === "/" ? path === "/" : path === base || path.startsWith(`${base}/`);
}

/**
 * Link styles per menu: `bar` is the header's pill menu (desktop), `side` the mobile side
 * menu's list (legacy meanmenu look: main.css `.mobile-side-menu .mean-nav`).
 */
const STYLES = {
  bar: {
    li: "",
    a: [
      "block rounded-full px-3 py-2 font-sans text-[14.5px] leading-[1.2] font-medium whitespace-nowrap text-[rgba(255,244,230,.86)]",
      "transition-[background-color,color] duration-200 hover:bg-[rgba(255,255,255,.08)] hover:text-white",
      "aria-[current=page]:bg-gold-bright aria-[current=page]:font-semibold aria-[current=page]:text-maroon-deep",
      "max-2xl:px-[9px] max-2xl:text-[13.5px] max-[1101px]:px-[7px] max-[1101px]:text-[13px]",
      "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright",
    ].join(" "),
  },
  side: {
    li: "relative block not-last:mb-6 not-last:border-b not-last:border-legacy-border not-last:pb-5",
    a: [
      "inline text-[18px] leading-[18px] font-semibold text-legacy-heading",
      "aria-[current=page]:text-maroon aria-[current=page]:before:mr-2.5 aria-[current=page]:before:mb-[3px] aria-[current=page]:before:inline-block aria-[current=page]:before:h-1.5 aria-[current=page]:before:w-1.5 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-gold aria-[current=page]:before:content-['']",
      "focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon",
    ].join(" "),
  },
} as const;

/** The header menu's items; `active` marks the current page. Plain links: full page loads. */
export function NavList({ items, path, variant }: { items: Item[]; path?: string; variant: keyof typeof STYLES }) {
  const s = STYLES[variant];
  return items.map((it, i) => {
    const active = path !== undefined && isActive(it.url, path);
    return (
      <li key={i} className={s.li || undefined}>
        <a href={it.url} target={it.target} rel={it.target === "_blank" ? "noopener noreferrer" : undefined} aria-current={active ? "page" : undefined} className={s.a}>
          {it.label}
          {it.target === "_blank" && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      </li>
    );
  });
}

/** NavList with the current path (must sit inside <Suspense>, see AGENTS.md). */
export function NavItems({ items, variant }: { items: Item[]; variant: keyof typeof STYLES }) {
  return <NavList items={items} path={usePathname()} variant={variant} />;
}
