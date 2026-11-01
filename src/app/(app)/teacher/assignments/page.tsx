import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { teacherApi } from "@/lib/teacher-api";

export const metadata: Metadata = { title: "Assignments" };

const due = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) : "No due date";

export default async function AssignmentsPage() {
  const rows = await teacherApi.assignments();
  return (
    <>
      <PageHeader
        title="Assignments"
        action={<Link href="/teacher/assignments/new" className={buttonClass}>+ New assignment</Link>}
      />
      {rows.length ? (
        <ul className="space-y-2">
          {rows.map((a, i) => (
            <li key={a.id}>
              <Link href={`/teacher/assignments/${a.id}`} className="block">
                <Card className="ccard flex flex-wrap items-center justify-between gap-3 p-4 pl-5 transition hover:ring-primary" style={cardTone(i)}>
                  <span className="min-w-0">
                    <span className="block font-medium text-ink">{a.title}</span>
                    <span className="block text-xs text-ink-2">
                      {[a.class, a.subject].filter(Boolean).join(" · ")} · due {due(a.due_date)} · {a.max_marks} marks
                    </span>
                  </span>
                  <Pill>{a.submissions_count} submitted</Pill>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No assignments yet.</Empty>
      )}
    </>
  );
}
