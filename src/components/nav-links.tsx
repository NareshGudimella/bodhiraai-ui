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
    <nav aria-label="Main" className="flex flex-col gap-0.5 px-3 pb-6 pt-2">
      {items.map((item, i) => [
        item.group && item.group !== items[i - 1]?.group && (
          <p key={`g-${item.group}`} className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-primary-light/65 first:mt-1">
            {item.group}
          </p>
        ),
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === active ? "page" : undefined}
          className="group relative flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-primary-light/85 transition-colors hover:bg-brand-lift hover:text-white aria-[current=page]:bg-brand-lift aria-[current=page]:font-semibold aria-[current=page]:text-white aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-1.5 aria-[current=page]:before:-left-3 aria-[current=page]:before:w-1 aria-[current=page]:before:rounded-r aria-[current=page]:before:bg-primary focus-visible:outline-primary"
        >
          {item.icon && <span aria-hidden className="w-5 shrink-0 text-center text-base leading-none">{item.icon}</span>}
          {item.label}
        </Link>,
      ])}
    </nav>
  );
}

/** Top-bar trail: section / current page (/ New, Edit or Details below it). Render inside <Suspense>. */
export function Breadcrumbs({ items, section }: { items: NavItem[]; section: string }) {
  const path = usePathname();
  const search = useSearchParams();
  const href = activeHref(items, path, search);
  const item = items.find((i) => i.href === href);
  const rest = item ? path.slice(item.href.split("?")[0].length).split("/").filter(Boolean) : [];
  const last = rest.at(-1);
  const tail = last ? (/^\d+$/.test(last) ? "Details" : last.replace(/[-_]/g, " ")) : undefined;
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm text-ink-3">
        <li className="hidden shrink-0 sm:block">{section}</li>
        {item && (
          <>
            <li aria-hidden className="hidden sm:block">/</li>
            <li className="min-w-0 truncate">
              {tail ? <Link href={item.href} className="hover:text-ink hover:underline">{item.label}</Link> : <span aria-current="page" className="font-semibold text-ink">{item.label}</span>}
            </li>
          </>
        )}
        {tail && (
          <>
            <li aria-hidden>/</li>
            <li aria-current="page" className="truncate font-semibold capitalize text-ink">{tail}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
