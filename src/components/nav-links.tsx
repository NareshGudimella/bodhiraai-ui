"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

/** `group` starts a labelled section in the sidebar (desktop) when it changes. */
export type NavItem = { label: string; href: string; icon?: string; group?: string };

/**
 * Sidebar links; the deepest matching item is highlighted. Render inside <Suspense>.
 * An item whose href carries a query (CMS "Success Stories") is active only on
 * exactly that URL; a plain item on the same path yields to it when the page
 * has one of that query's parameters (legacy cms layout: `fullUrlIs` / `! query('category')`).
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const path = usePathname();
  const search = useSearchParams();
  const active = activeHref(items, path, search);
  return <NavList items={items} active={active} />;
}

/** The href of the item to highlight for the current URL, if any. */
export function activeHref(items: NavItem[], path: string, search: URLSearchParams): string | undefined {
  const split = (href: string) => {
    const [p, q = ""] = href.split("?");
    return { path: p, query: new URLSearchParams(q) };
  };
  const sorted = (a: URLSearchParams) => [...a].sort().map(([k, v]) => `${k}=${v}`).join("&");
  const exact = items.find((i) => {
    const h = split(i.href);
    return [...h.query].length > 0 && h.path === path && sorted(h.query) === sorted(search);
  });
  if (exact) return exact.href;
  return items
    .filter((i) => {
      const h = split(i.href);
      if ([...h.query].length > 0) return false;
      if (path !== h.path && !path.startsWith(`${h.path}/`)) return false;
      // Yield to a sibling that owns a query parameter present on this page.
      const owned = items.some((o) => {
        const oh = split(o.href);
        return oh.path === h.path && [...oh.query].some(([k]) => search.has(k));
      });
      return !owned;
    })
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/** The same links without the current-page highlight (Suspense fallback / static shell). */
export function NavList({ items, active }: { items: NavItem[]; active?: string }) {
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
      {items.map((item, i) => [
        item.group && item.group !== items[i - 1]?.group && (
          <p key={`g-${item.group}`} className="mt-3 hidden px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-primary-light/50 first:mt-0 md:block">
            {item.group}
          </p>
        ),
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === active ? "page" : undefined}
          className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-brand-lift aria-[current=page]:bg-brand-lift aria-[current=page]:font-semibold aria-[current=page]:text-primary"
        >
          {item.icon && <span aria-hidden>{item.icon}</span>}
          {item.label}
        </Link>,
      ])}
    </nav>
  );
}
