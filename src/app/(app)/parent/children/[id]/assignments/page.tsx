import { Card, Empty, PageHeader, Pill, Stat } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { parentApi } from "@/lib/parent-api";
import { ChildTabs } from "../child-tabs";

const TONE: Record<string, "success" | "brand" | "neutral"> = { graded: "success", submitted: "brand" };

export default async function ChildAssignmentsPage({ params }: PageProps<"/parent/children/[id]/assignments">) {
  const { id } = await params;
  const { student, assignments, totals } = await parentApi.assignments(id);
  return (
    <>
      <PageHeader back={{ href: "/parent", label: "Dashboard" }} title={student.name} />
      <ChildTabs id={id} current="/assignments" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Total" value={totals.total} />
        <Stat label="Graded" value={totals.graded} />
        <Stat label="Submitted" value={totals.submitted} />
        <Stat label="Pending" value={totals.pending} />
        <Stat label="Missed" value={totals.missed} />
      </div>
      <div className="mt-6">
        {assignments.length ? (
          <ul className="space-y-2">
            {assignments.map((a, i) => (
              <li key={a.id}>
                <Card className="ccard p-4 pl-5" style={cardTone(i)}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{a.title}</span>
                      <span className="block text-xs text-ink-3">
                        {[
                          a.subject,
                          a.class,
                          a.due_date && `Due ${a.due_date}`,
                          `${a.max_marks} marks`,
                          a.submitted_at && `Submitted ${a.submitted_at}`,
                        ].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <Pill tone={TONE[a.status] ?? "neutral"}>
                      {a.status === "graded" ? `Graded ${a.score}/${a.max_marks}` : a.status}
                    </Pill>
                  </div>
                  {a.feedback && <p className="mt-2 text-sm text-ink-2">“{a.feedback}”</p>}
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No assignments yet.</Empty>
        )}
      </div>
    </>
  );
}
