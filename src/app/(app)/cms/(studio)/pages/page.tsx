import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";

export const metadata: Metadata = { title: "Pages" };

/** Legacy `cms.pages.index`. */
export default async function CmsPagesPage() {
  const pages = await cmsApi.pages();
  return (
    <>
      <PageHeader title="Pages" subtitle="SEO settings and section blocks per page" action={<Link href="/cms/pages/new" className={buttonClass}>+ New page</Link>} />
      {pages.length ? (
        <ul className="grid gap-2 [&>*]:min-w-0 sm:grid-cols-2 xl:grid-cols-3">
          {pages.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-line">
              <span>
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-ink">{p.name}</span>
                  <Pill tone={p.status === "published" ? "success" : "neutral"}>{p.status}</Pill>
                </span>
                <span className="mt-1 block truncate text-xs text-ink-3">
                  /{p.slug} · {p.sections_count} sections{p.is_system ? " · 🔒 system" : ""}
                </span>
              </span>
              <span className="mt-auto flex gap-2">
                <Link href={`/cms/pages/${p.slug}`} className="flex-1 rounded-lg bg-brand px-3 py-1.5 text-center text-sm font-semibold text-primary-light hover:bg-brand-mid">Edit</Link>
                {/* the public page (legacy: url($slug === 'home' ? '/' : '/'.$slug)) */}
                <a href={p.slug === "home" ? "/" : `/${p.slug}`} target="_blank" rel="noreferrer" title="View the page" className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-primary-light">View ↗</a>
              </span>
            </li>
          ))}
        </ul>
      ) : <Empty>No pages yet.</Empty>}
    </>
  );
}
