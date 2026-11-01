import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader, Stat, buttonClass } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { AssignmentList } from "./assignment-list";
import { daysDiff, groupOf } from "./status";

export const metadata: Metadata = { title: "Assignments" };

export default async function StudentAssignmentsPage() {
  const rows = await studentApi.assignments();
  const count = (g: ReturnType<typeof groupOf>) => rows.filter((a) => groupOf(a.status) === g).length;

  return (
    <>
      <PageHeader title="Assignments" subtitle="Homework from your class teachers." />
      {rows.length ? (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Total" value={rows.length} />
            <Stat label="Submitted" value={count("submitted")} />
            <Stat label="Pending" value={count("pending")} />
            <Stat label="Overdue" value={count("overdue")} />
          </div>
          <AssignmentList
            rows={rows.map((a) => ({
              id: a.id,
              title: a.title,
              subject: a.subject,
              due_date: a.due_date,
              max_marks: a.max_marks,
              status: a.status,
              score: a.submission?.score ?? null,
              submitted_at: a.submission?.submitted_at ?? null,
              diff: daysDiff(a.due_date),
            }))}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 ring-1 ring-line">
            <div>
              <p className="font-semibold text-ink">Need help with your assignments?</p>
              <p className="text-sm text-ink-2">Use the AI Doubt Solver to get step-by-step help instantly.</p>
            </div>
            <Link href="/student/ai" className={buttonClass}>🤖 Ask AI Doubt Solver →</Link>
          </div>
        </>
      ) : (
        <Empty>No assignments yet. Your teacher hasn&apos;t posted any.</Empty>
      )}
    </>
  );
}
