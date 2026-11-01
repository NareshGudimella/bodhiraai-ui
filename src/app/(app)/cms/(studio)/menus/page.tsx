import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { Card, Empty, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { deleteMenuItem, reorderMenu } from "@/lib/cms-actions";
import { cmsApi, type MenuItem } from "@/lib/cms-api";
import { ItemForm } from "./item-form";

export const metadata: Metadata = { title: "Menus" };

const small = "rounded-lg border border-line px-2 py-1 text-xs hover:bg-primary-light disabled:opacity-40";

/** Legacy `cms.menus.index`: one menu's items (top level, with children), the add form. */
export default async function CmsMenusPage({ searchParams }: PageProps<"/cms/menus">) {
  const q = (await searchParams).menu;
  const { menus, active, items } = await cmsApi.menus(typeof q === "string" ? q : "");
  const ids = items.map((i) => i.id);
  const move = (i: number, by: number) => {
    const next = [...ids];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    return reorderMenu.bind(null, active!.key, next);
  };
  const row = (item: MenuItem, child = false) => (
    <span className={`flex flex-wrap items-center justify-between gap-2 ${child ? "pl-5" : ""}`}>
      <span className="min-w-0">
        <span className="block truncate font-medium text-ink">{child ? "↳ " : ""}{item.label}</span>
        <span className="block truncate text-xs text-ink-3">{item.url}{item.target === "_blank" ? " · new tab" : ""}</span>
      </span>
      <span className="flex items-center gap-1.5">
        {!item.is_active && <Pill>hidden</Pill>}
        <ConfirmButton action={deleteMenuItem.bind(null, item.id)} message="Remove this item?" className={`${small} text-danger`}>Remove</ConfirmButton>
      </span>
    </span>
  );
  return (
    <>
      <PageHeader title="Menus" subtitle="Header and footer navigation" />
      <nav aria-label="Menus" className="mb-4 flex flex-wrap gap-2">
        {menus.map((m) => (
          <Link
            key={m.key}
            href={`/cms/menus?menu=${m.key}`}
            aria-current={active?.key === m.key ? "page" : undefined}
            className="rounded-full px-3 py-1 text-sm ring-1 ring-line aria-[current=page]:bg-brand aria-[current=page]:text-white"
          >
            {m.name}
          </Link>
        ))}
      </nav>
      {active ? (
        <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <SectionTitle>{active.name}</SectionTitle>
            {items.length ? (
              <ul className="space-y-2 text-sm">
                {items.map((item, i) => (
                  <li key={item.id} className="space-y-2 rounded-2xl bg-card p-3 ring-1 ring-line">
                    <span className="flex items-start gap-2">
                      <span className="flex flex-col gap-1">
                        <form action={move(i, -1)}><button className={small} disabled={i === 0} aria-label={`Move ${item.label} up`}>↑</button></form>
                        <form action={move(i, 1)}><button className={small} disabled={i === items.length - 1} aria-label={`Move ${item.label} down`}>↓</button></form>
                      </span>
                      <span className="min-w-0 flex-1 space-y-2">
                        {row(item)}
                        {(item.children ?? []).map((c) => <span key={c.id} className="block">{row(c, true)}</span>)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : <Empty>No items in this menu yet.</Empty>}
          </section>
          <section>
            <SectionTitle>Add item</SectionTitle>
            <Card><ItemForm menuKey={active.key} parents={items.map((i) => ({ id: i.id, label: i.label }))} /></Card>
          </section>
        </div>
      ) : <Empty>No menus.</Empty>}
    </>
  );
}
