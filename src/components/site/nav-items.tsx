"use client";

import { usePathname } from "next/navigation";

type Item = { label: string; url: string; target: string };

/** Which menu item the path belongs to: "/" only matches itself, others by prefix. not in legacy */
function isActive(url: string, path: string) {
  if (!url.startsWith("/")) return false;
  const base = url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return base === "/" ? path === "/" : path === base || path.startsWith(`${base}/`);
}

/** The header menu's items; `active` marks the current page. Plain links: full page loads re-run the theme's scripts. */
export function NavList({ items, path }: { items: Item[]; path?: string }) {
  return items.map((it, i) => {
    const active = path !== undefined && isActive(it.url, path);
    return (
      <li key={i} className={active ? "active" : undefined}>
        <a href={it.url} target={it.target} aria-current={active ? "page" : undefined}>{it.label}</a>
      </li>
    );
  });
}

/** NavList with the current path (must sit inside <Suspense>, see AGENTS.md). */
export function NavItems({ items }: { items: Item[] }) {
  return <NavList items={items} path={usePathname()} />;
}
