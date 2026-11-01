import { Card, Empty, PageHeader, Pill, SectionTitle, Stat, buttonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { startChat } from "@/lib/inbox-actions";
import { parentApi } from "@/lib/parent-api";
import { ChildAvatar } from "../../child-avatar";
import { ChildTabs } from "./child-tabs";

const STATUS: Record<string, string> = { completed: "Completed", in_progress: "In progress" };

export default async function ChildPage({ params }: PageProps<"/parent/children/[id]">) {
  const { id } = await params;
  const { student, stats, recent_lessons, recent_quizzes } = await parentApi.child(id);
  return (
    <>
      <PageHeader
        back={{ href: "/parent", label: "Dashboard" }}
        title={
          <span className="flex items-center gap-3">
            <ChildAvatar name={student.name} avatar={student.avatar} size="size-12" />
            {student.name}
          </span>
        }
        subtitle={[student.grade && `Grade ${student.grade}`, student.school?.name].filter(Boolean).join(" · ") || undefined}
        action={
          <form action={startChat.bind(null, "with-teacher", student.id)}>
            <button className={buttonClass}>💬 Chat with Teacher</button>
          </form>
        }
      />
      <ChildTabs id={id} current="" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Attendance" value={`${stats.attendance_percent}%`} hint={`${stats.attendance_present}/${stats.attendance_total} days present`} />
        <Stat label="Quiz average" value={`${stats.avg_quiz_percent}%`} hint={`${stats.quizzes_attempted} quizzes`} />
        <Stat label="Lessons" value={`${stats.lessons_completed}/${stats.lessons_started}`} hint="completed / started" />
        <Stat label="Pending work" value={stats.pending_assignments} />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Recent lessons</SectionTitle>
          {recent_lessons.length ? (
            <ul className="space-y-2">
              {recent_lessons.map((l, i) => (
                <li key={i}>
                  <Card className="ccard p-3 pl-4" style={cardTone(i)}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink">{l.title}</p>
                      <Pill tone={l.status === "completed" ? "success" : "neutral"}>{STATUS[l.status] ?? l.status}</Pill>
                    </div>
                    <p className="text-xs text-ink-3">{l.subject} · {l.progress}% · {l.last_viewed_at}</p>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No lessons opened yet.</Empty>
          )}
        </section>
        <section>
          <SectionTitle>Recent quizzes</SectionTitle>
          {recent_quizzes.length ? (
            <ul className="space-y-2">
              {recent_quizzes.map((q, i) => (
                <li key={i}>
                  <Card className="ccard flex items-center justify-between gap-2 p-3 pl-4" style={cardTone(i)}>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">{q.title}</span>
                      <span className="block text-xs text-ink-3">{q.subject} · {q.submitted_at}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-brand">{q.percent}%</span>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No quizzes taken yet.</Empty>
          )}
        </section>
      </div>
    </>
  );
}
