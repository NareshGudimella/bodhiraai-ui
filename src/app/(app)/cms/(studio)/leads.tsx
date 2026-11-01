import { ConfirmButton } from "@/components/confirm-button";
import { deleteLead, setLeadStatus } from "@/lib/cms-actions";
import type { Lead } from "@/lib/cms-api";
import { mjY } from "@/lib/money";

/** One lead card: its fields, received date, status changer and delete. */
export function LeadCard({
  kind,
  lead,
  lines,
  statuses,
}: {
  kind: "demos" | "contacts" | "subscribers";
  lead: Lead;
  lines: (string | null | false | undefined)[];
  statuses?: readonly string[];
}) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-card p-4 text-sm ring-1 ring-line">
      <span className="min-w-0 space-y-1">
        {lines.filter(Boolean).map((l, i) => (
          <span key={i} className={`block break-words ${i === 0 ? "font-medium text-ink" : "text-xs text-ink-2"}`}>{l}</span>
        ))}
        <span className="block text-xs text-ink-3">Received {mjY(lead.created_at)}</span>
      </span>
      <span className="flex flex-wrap items-center gap-2">
        {statuses ? (
          <form action={setLeadStatus.bind(null, kind as "demos" | "contacts", lead.id)} className="flex items-center gap-1">
            <select name="status" defaultValue={lead.status} aria-label="Status" className="rounded-lg border border-line bg-bg px-2 py-1 text-xs capitalize">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="rounded-lg border border-line px-2 py-1 text-xs hover:bg-primary-light">Save</button>
          </form>
        ) : (
          <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs capitalize text-ink-2">{lead.status}</span>
        )}
        {kind !== "subscribers" && typeof lead.email === "string" && lead.email && (
          <a href={`mailto:${lead.email}`} className="rounded-lg border border-line px-2 py-1 text-xs hover:bg-primary-light">{kind === "contacts" ? "Reply" : "Email"}</a>
        )}
        {kind === "demos" && typeof lead.phone === "string" && lead.phone && (
          <a href={`tel:${lead.phone}`} className="rounded-lg border border-line px-2 py-1 text-xs hover:bg-primary-light">Call</a>
        )}
        <ConfirmButton action={deleteLead.bind(null, kind, lead.id)} message="Delete this record?" className="rounded-lg border border-danger/30 px-2 py-1 text-xs text-danger hover:bg-danger-light">
          Delete
        </ConfirmButton>
      </span>
    </li>
  );
}

export function StatusTabs({ base, statuses, active, extra = "" }: { base: string; statuses: readonly string[]; active: string | null; extra?: string }) {
  const tab = (s: string | null, label: string) => (
    <a
      key={label}
      href={`${base}?${new URLSearchParams({ ...(extra ? Object.fromEntries(new URLSearchParams(extra)) : {}), ...(s ? { status: s } : {}) })}`}
      aria-current={active === s ? "page" : undefined}
      className="rounded-full px-3 py-1 text-sm capitalize ring-1 ring-line aria-[current=page]:bg-brand aria-[current=page]:text-white"
    >
      {label}
    </a>
  );
  return (
    <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
      {tab(null, "All")}
      {statuses.map((s) => tab(s, s))}
    </nav>
  );
}
