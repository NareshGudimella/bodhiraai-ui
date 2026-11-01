import { Card, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { ASSIGNMENT_STATUS, daysDiff, daysMessage, dueLabel, groupOf, mjYtime } from "../status";
import { SubmitForm } from "./submit-form";

const fileName = (url: string) => decodeURIComponent(url.split("/").pop() ?? "file");

export default async function StudentAssignmentPage({ params }: PageProps<"/student/assignments/[id]">) {
  const { id } = await params;
  const { assignment: a, status, submission } = await studentApi.assignment(id);
  const s = ASSIGNMENT_STATUS[status] ?? ASSIGNMENT_STATUS.pending;
  const left = submission ? "" : daysMessage(daysDiff(a.due_date));

  return (
    <>
      <PageHeader
        back={{ href: "/student/assignments", label: "Assignments" }}
        title={a.title}
        subtitle={[a.subject, a.teacher && `by ${a.teacher}`, `due ${dueLabel(a.due_date)}`, `${a.max_marks} marks`].filter(Boolean).join(" · ")}
        action={<Pill tone={s.tone}>{s.label}</Pill>}
      />
      {left && (
        <p className={`-mt-3 mb-5 text-sm font-semibold ${groupOf(status) === "overdue" ? "text-danger" : "text-primary-dark"}`}>
          {groupOf(status) === "overdue" ? "⚠️" : "⏱"} {left}
        </p>
      )}
      <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <Card>
          <SectionTitle>Instructions</SectionTitle>
          <p className="whitespace-pre-line text-sm text-ink">{a.description || "No instructions."}</p>
          {a.attachment_url && (
            <a href={a.attachment_url} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-medium text-primary-dark underline">
              Open attachment
            </a>
          )}
        </Card>
        <div className="space-y-4">
          {submission && (
            <Card>
              <SectionTitle>Your submission</SectionTitle>
              <dl className="mb-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">Submitted</dt>
                  <dd className="text-ink">{mjYtime(submission.submitted_at)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">Status</dt>
                  <dd className="font-semibold capitalize text-ink">{submission.status}</dd>
                </div>
              </dl>
              {submission.note && <p className="whitespace-pre-line text-sm text-ink">{submission.note}</p>}
              {submission.file_url && (
                <a href={submission.file_url} target="_blank" rel="noopener" className="mt-2 block truncate text-sm font-medium text-primary-dark underline">
                  📎 {fileName(submission.file_url)}
                </a>
              )}
              {submission.status === "graded" && (
                <div className="mt-3 rounded-lg bg-success/10 p-3 text-sm">
                  <p className="font-semibold text-success">Score: {submission.score}/{a.max_marks}</p>
                  {submission.feedback && <p className="mt-1 text-ink">“{submission.feedback}”</p>}
                </div>
              )}
            </Card>
          )}
          <Card>
            <SectionTitle>{submission ? "Resubmit" : "Submit your work"}</SectionTitle>
            <SubmitForm assignmentId={a.id} hasSubmission={!!submission} initialNote={submission?.note ?? ""} />
          </Card>
        </div>
      </div>
    </>
  );
}
