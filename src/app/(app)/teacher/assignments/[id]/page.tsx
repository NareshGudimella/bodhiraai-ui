import { Card, PageHeader, Pill, SectionTitle, Stat } from "@/components/ui";
import { fileNameOf } from "@/lib/signed-file";
import { teacherApi } from "@/lib/teacher-api";
import { GradeForm } from "./grade-form";

const STATUS_PILL: Record<string, { label: string; tone: "success" | "brand" | "neutral" }> = {
  graded: { label: "Graded", tone: "success" },
  submitted: { label: "Submitted", tone: "brand" },
  pending: { label: "Pending", tone: "neutral" },
};
const statusPill = (status: string) =>
  STATUS_PILL[status] ?? { label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "), tone: "neutral" as const };

const due = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) : "No due date";

export default async function AssignmentPage({ params }: PageProps<"/teacher/assignments/[id]">) {
  const { id } = await params;
  const { assignment: a, roster } = await teacherApi.assignment(id);
  const subs = new Map(a.submissions.map((s) => [s.id, s]));
  const submitted = roster.filter((r) => r.submission_id).length;
  const graded = roster.filter((r) => r.graded).length;

  return (
    <>
      <PageHeader
        back={{ href: "/teacher/assignments", label: "Assignments" }}
        title={a.title}
        subtitle={`Grade ${a.klass.grade} - ${a.klass.section}${a.subject ? ` · ${a.subject.name}` : ""} · due ${due(a.due_date)} · ${a.max_marks} marks`}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Graded" value={graded} hint={`of ${roster.length} students`} />
        <Stat label="Submitted" value={submitted} hint="Awaiting review or graded" />
        <Stat label="Pending" value={roster.length - submitted} hint="Not submitted yet" />
        <Stat label="Max marks" value={a.max_marks} hint="Per student" />
      </div>
      {(a.description || a.attachment_url) && (
        <Card className="mb-6">
          {a.description && <p className="whitespace-pre-line text-sm text-ink">{a.description}</p>}
          {a.attachment_url && (
            <a href={a.attachment_url} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-medium text-primary-dark underline">
              Open attachment
            </a>
          )}
        </Card>
      )}
      <SectionTitle>Submissions · {submitted}/{roster.length}</SectionTitle>
      <ul className="space-y-2">
        {roster.map((r) => {
          const sub = r.submission_id ? subs.get(r.submission_id) : undefined;
          return (
            <li key={r.student_id}>
              <Card className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink">{r.name}</span>
                  <span className="flex items-center gap-2 text-xs text-ink-3">
                    {r.submitted_at && <span>{r.submitted_at}</span>}
                    <Pill tone={statusPill(r.status).tone}>
                      {r.status === "graded" ? `Graded ${r.score}/${a.max_marks}` : statusPill(r.status).label}
                    </Pill>
                  </span>
                </div>
                {sub && (
                  <div className="mt-3 space-y-3 border-t border-line pt-3">
                    {sub.note && <p className="whitespace-pre-line text-sm text-ink-2">{sub.note}</p>}
                    {sub.file_url && (
                      <a href={sub.file_url} target="_blank" rel="noopener" className="block truncate text-sm font-medium text-primary-dark underline">
                        📎 {fileNameOf(sub.file_url, "Submitted file")}
                      </a>
                    )}
                    <GradeForm submissionId={sub.id} maxMarks={a.max_marks} score={r.score} feedback={sub.feedback} />
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
