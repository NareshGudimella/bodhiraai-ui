import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/confirm-button";
import { Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { deleteResource, toggleResource } from "@/lib/cms-actions";
import { cmsApi, RESOURCE_SLUGS, type ResourceField, type Row } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";

export const metadata: Metadata = { title: "Web Studio" };

const cell = (f: ResourceField, row: Row) => {
  const v = row[f.name];
  if (f.type === "boolean") return v ? <Pill tone="success">Yes</Pill> : <Pill>No</Pill>;
  if (f.type === "image" && typeof v === "string") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={mediaUrl(v) ?? v} alt="" className="size-10 rounded object-cover ring-1 ring-line" />;
  }
  return <span className="line-clamp-2">{v === null || v === undefined ? "—" : String(v)}</span>;
};

/** Legacy `cms.resource.index`: a table of the schema's column fields. */
export default async function ResourceIndexPage({ params }: PageProps<"/cms/[resource]">) {
  const { resource } = await params;
  if (!RESOURCE_SLUGS.includes(resource as (typeof RESOURCE_SLUGS)[number])) notFound();
  const { rows, fields, labels, toggleable } = await cmsApi.resource(resource);
  const cols = fields.filter((f) => f.col);
  return (
    <>
      <PageHeader
        title={labels[1]}
        action={<Link href={`/cms/${resource}/new`} className={buttonClass}>+ New {labels[0].toLowerCase()}</Link>}
      />
      {rows.length ? (
        <div className="overflow-x-auto rounded-2xl bg-card ring-1 ring-line">
          <table className="w-full min-w-xl text-sm">
            <thead className="bg-primary-light/60 text-left text-[11px] uppercase tracking-wide text-ink-3">
              <tr>
                {cols.map((f) => <th key={f.name} className="px-4 py-3">{f.label}</th>)}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line align-top">
                  {cols.map((f) => <td key={f.name} className="max-w-xs px-4 py-3">{cell(f, row)}</td>)}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2 text-xs">
                      <Link href={`/cms/${resource}/${row.id}`} className="rounded-lg border border-line px-2.5 py-1 hover:bg-primary-light">Edit</Link>
                      {toggleable && (
                        <form action={toggleResource.bind(null, resource, row.id)}>
                          <button className="rounded-lg border border-line px-2.5 py-1 hover:bg-primary-light">{row.is_active ? "Hide" : "Show"}</button>
                        </form>
                      )}
                      <ConfirmButton
                        action={deleteResource.bind(null, resource, row.id)}
                        message={`Delete this ${labels[0].toLowerCase()}?`}
                        className="rounded-lg border border-danger/30 px-2.5 py-1 text-danger hover:bg-danger-light"
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Empty>No {labels[1].toLowerCase()} yet.</Empty>}
    </>
  );
}
