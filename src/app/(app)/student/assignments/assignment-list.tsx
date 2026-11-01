"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, Pill } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { ASSIGNMENT_STATUS, daysMessage, groupOf, mj, type Group } from "./status";

export type Row = {
  id: number;
  title: string;
  subject: string | null;
  due_date: string | null;
  max_marks: number;
  status: string;
  score: number | null;
  submitted_at: string | null;
  /** Whole days until the due day, computed on the server. */
  diff: number | null;
};

const TABS: { key: "all" | Group; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "pending", label: "Pending" },
  { key: "overdue", label: "Overdue" },
];

/** Assignment cards with legacy's All / Submitted / Pending / Overdue tabs. */
export function AssignmentList({ rows }: { rows: Row[] }) {
  const [tab, setTab] = useState<"all" | Group>("all");
  const shown = rows.filter((r) => tab === "all" || groupOf(r.status) === tab);
  return (
    <>
      <div role="tablist" aria-label="Filter assignments" className="mb-4 inline-flex rounded-xl bg-primary-light p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className="rounded-lg px-3.5 py-1.5 text-sm font-semibold text-ink-2 transition aria-selected:bg-card aria-selected:text-brand aria-selected:shadow-sm"
          >
            {t.label}
          </button>
        ))}
      </div>
      {shown.length ? (
        <ul className="space-y-2">
          {shown.map((a, i) => {
            const s = ASSIGNMENT_STATUS[a.status] ?? ASSIGNMENT_STATUS.pending;
            const overdue = groupOf(a.status) === "overdue";
            const msg = daysMessage(a.diff);
            return (
              <li key={a.id}>
                <Link href={`/student/assignments/${a.id}`} className="block">
                  <Card className="ccard flex flex-wrap items-center justify-between gap-3 p-4 transition hover:ring-primary" style={cardTone(i)}>
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{a.title}</span>
                      <span className="block text-xs text-ink-2">
                        {[a.subject, a.due_date && `📅 ${mj(a.due_date)}`, `⭐ ${a.max_marks} marks`].filter(Boolean).join(" · ")}
                      </span>
                      {a.submitted_at ? (
                        <span className="mt-1 block text-xs font-semibold text-success">✅ Submitted {mj(a.submitted_at)}</span>
                      ) : msg ? (
                        <span className={`mt-1 block text-xs font-semibold ${overdue ? "text-danger" : "text-primary-dark"}`}>
                          {overdue ? "⚠️" : "⏱"} {msg}
                        </span>
                      ) : null}
                    </span>
                    <Pill tone={s.tone}>{a.status === "graded" && a.score !== null ? `${a.score}/${a.max_marks}` : s.label}</Pill>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-card/60 p-6 text-center text-sm text-ink-3">
          Nothing in this tab.
        </p>
      )}
    </>
  );
}
