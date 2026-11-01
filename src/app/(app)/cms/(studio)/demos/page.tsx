import type { Metadata } from "next";
import Link from "next/link";
import { Pagination, toParams } from "@/components/list-tools";
import { Empty, PageHeader, secondaryButtonClass } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { LeadCard, StatusTabs } from "../leads";

export const metadata: Metadata = { title: "Demo Requests" };
const STATUSES = ["new", "contacted", "scheduled", "closed"] as const;

/** Legacy `cms.leads.demos`: School / Student tabs, status filter, CSV export. */
export default async function DemosPage({ searchParams }: PageProps<"/cms/demos">) {
  const params = toParams(await searchParams, ["type", "status", "page"]);
  const { data, meta } = await cmsApi.demos(params);
  const { demos, type, counts } = data;
  return (
    <>
      <PageHeader
        title="Demo Requests"
        subtitle="From the “Book a Demo” form"
        action={<a href={`/cms/demos/export?type=${type}`} className={secondaryButtonClass}>⬇ Export CSV</a>}
      />
      <nav aria-label="Requester type" className="mb-3 flex gap-2">
        {(["school", "student"] as const).map((t) => (
          <Link key={t} href={`/cms/demos?type=${t}`} aria-current={type === t ? "page" : undefined} className="rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ring-1 ring-line aria-[current=page]:bg-primary-light">
            {t} <span className="opacity-70">{counts[t]}</span>
          </Link>
        ))}
      </nav>
      <StatusTabs base="/cms/demos" statuses={STATUSES} active={params.get("status")} extra={`type=${type}`} />
      {demos.length ? (
        <ul className="space-y-2">
          {demos.map((d) => (
            <LeadCard
              key={d.id}
              kind="demos"
              lead={d}
              statuses={STATUSES}
              lines={[
                `${d.name}${d.organization ? ` · ${d.organization}` : ""}`,
                `${d.email} · ${d.phone}`,
                [d.designation, d.student_count && `${d.student_count} students`, d.grade && `Class ${d.grade}`, d.board, d.city].filter(Boolean).join(" · "),
                d.message as string | null,
              ]}
            />
          ))}
        </ul>
      ) : <Empty>No {type} demo requests{params.get("status") ? ` marked ${params.get("status")}` : ""}.</Empty>}
      <Pagination base="/cms/demos" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
