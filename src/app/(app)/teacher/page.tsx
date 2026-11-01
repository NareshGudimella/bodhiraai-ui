import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, Stat } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { teacherApi } from "@/lib/teacher-api";

const QUICK_ACTIONS = [
  { href: "/teacher/assignments/new", icon: "📝", title: "Create assignment", sub: "Assign tasks to students" },
  { href: "/teacher/quizzes", icon: "❓", title: "My quizzes", sub: "View published quizzes" },
  { href: "/teacher/live/new", icon: "📹", title: "Schedule live class", sub: "Plan and host a session" },
  { href: "/teacher/classes", icon: "📊", title: "View reports", sub: "Track progress" },
];

export default async function TeacherHome() {
  const { teacher, stats, classes, recent_submissions } = await teacherApi.home();
  return (
    <>
      <PageHeader title={`Welcome, ${teacher.name.split(" ")[0]}`} subtitle={teacher.school ?? undefined} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Classes" value={stats.classes_count} />
        <Stat label="Students" value={stats.students_count} />
        <Stat label="To grade" value={stats.pending_grading} />
        <Stat label="Active assignments" value={stats.assignments_active} />
        <Stat label="Published quizzes" value={stats.quizzes_published} />
        <Stat label="Attendance today" value={`${stats.attendance_today_percent}%`} hint={`${stats.attendance_today} records`} />
      </div>
      <section className="mt-8">
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((q) => (
            <Link key={q.href} href={q.href} className="block">
              <Card className="h-full p-4 transition hover:ring-primary">
                <p className="font-medium text-ink">{q.icon} {q.title}</p>
                <p className="mt-0.5 text-xs text-ink-2">{q.sub} →</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Your classes</SectionTitle>
          {classes.length ? (
            <ul className="space-y-2">
              {classes.map((c, i) => (
                <li key={c.id}>
                  <Link href={`/teacher/classes/${c.id}`} className="block">
                    <Card className="ccard flex items-center justify-between p-4 pl-5 transition hover:ring-primary" style={cardTone(i)}>
                      <span className="font-medium text-ink">{c.label}</span>
                      <span className="text-xs text-ink-3">{c.students_count} students</span>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No classes assigned yet.</Empty>
          )}
        </section>
        <section>
          <SectionTitle>Recent submissions</SectionTitle>
          {recent_submissions.length ? (
            <ul className="space-y-2">
              {recent_submissions.map((s) => (
                <li key={s.id}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink">{s.assignment_title}</p>
                      <Pill tone={s.graded ? "success" : "brand"}>{s.graded ? "Graded" : "To grade"}</Pill>
                    </div>
                    <p className="text-xs text-ink-2">
                      {s.student} · {s.class} · {s.submitted_at}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No submissions yet.</Empty>
          )}
        </section>
      </div>
    </>
  );
}
