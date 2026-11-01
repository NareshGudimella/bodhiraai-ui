import type { Metadata } from "next";
import Link from "next/link";
import { Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { ENQUIRY_STATUSES, superApi } from "@/lib/super-api";
import { EnquiryStatus } from "./enquiry-status";

export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }: PageProps<"/super/enquiries">) {
  const params = toParams(await searchParams, ["status", "page"]);
  const { enquiries, counts, status, meta } = await superApi.enquiries(params);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tab = (s: string | null, label: string, n: number) => (
    <Link
      key={label}
      href={s ? `/super/enquiries?status=${s}` : "/super/enquiries"}
      aria-current={status === s ? "page" : undefined}
      className="rounded-full px-3 py-1 text-sm capitalize ring-1 ring-line aria-[current=page]:bg-brand aria-[current=page]:text-white"
    >
      {label} <span className="opacity-70">{n}</span>
    </Link>
  );
  return (
    <>
      <PageHeader title="Enquiries" subtitle="Interested students from the public enquiry form" />
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        {tab(null, "All", total)}
        {ENQUIRY_STATUSES.map((s) => tab(s, s, counts[s] ?? 0))}
      </nav>
      {enquiries.length ? (
        <ul className="space-y-2">
          {enquiries.map((q, i) => (
            <li key={q.id}>
              <Card className="ccard flex flex-wrap items-start justify-between gap-3 p-4 pl-5 text-sm" style={cardTone(i)}>
                <span className="min-w-0 space-y-1">
                  <span className="block font-medium text-ink">{q.name}</span>
                  <span className="block break-all text-xs text-ink-2">{q.email} · {q.phone}</span>
                  <span className="block text-xs text-ink-3">
                    {[q.grade && `Grade ${q.grade}`, q.board, q.city, q.school_name].filter(Boolean).join(" · ")}
                    {q.created_at && ` · ${new Date(q.created_at).toLocaleDateString("en-IN")}`}
                  </span>
                  {q.message && <span className="block whitespace-pre-line text-ink-2">{q.message}</span>}
                </span>
                <EnquiryStatus id={q.id} status={q.status} />
              </Card>
            </li>
          ))}
        </ul>
      ) : <Empty>No enquiries{status ? ` marked ${status}` : ""}.</Empty>}
      <Pagination base="/super/enquiries" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
