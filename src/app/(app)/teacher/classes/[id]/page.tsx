import Link from "next/link";
import { Card, Empty, PageHeader, SectionTitle, Stat, buttonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { teacherApi } from "@/lib/teacher-api";
import { mediaUrl } from "@/lib/media";
import { AddStudentForm, RosterList } from "./roster";

const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "UTC" }) : "No due date";

export default async function ClassPage({ params }: PageProps<"/teacher/classes/[id]">) {
  const { id } = await params;
  const { class: c, stats, assignments, recent_scores } = await teacherApi.class(id);
  const students = [...c.students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader
        back={{ href: "/teacher/classes", label: "Classes" }}
        title={`Grade ${c.grade} - ${c.section}`}
        subtitle={c.class_teacher ? `Class teacher: ${c.class_teacher.name}` : undefined}
        action={<Link href={`/teacher/classes/${c.id}/attendance`} className={buttonClass}>Take attendance</Link>}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Students" value={stats.students} />
        <Stat label="Subjects" value={stats.subjects} />
        <Stat label="Attendance" value={`${stats.attendance_percent}%`} hint="present, all time" />
        <Stat label="Assignments" value={stats.assignments_count} />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-[3fr_2fr]">
        <section>
          <SectionTitle>Students</SectionTitle>
          <AddStudentForm classId={c.id} />
          <RosterList
            classId={c.id}
            students={students.map((s) => ({
              id: s.id,
              name: s.name,
              username: s.username,
              email: s.email,
              phone: s.phone,
              gender: s.gender,
              dob: s.dob ? s.dob.slice(0, 10) : null,
              status: s.status,
              roll_no: s.pivot.roll_no,
              avatar: mediaUrl(s.avatar),
            }))}
          />
        </section>
        <div className="space-y-8">
          <section>
            <SectionTitle>Subjects</SectionTitle>
            <ul className="flex flex-wrap gap-2">
              {c.subjects.map((s) => (
                <li key={s.id} className="rounded-full bg-card px-3 py-1 text-sm ring-1 ring-line">
                  {s.icon} {s.name}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionTitle>Latest assignments</SectionTitle>
            {assignments.length ? (
              <ul className="space-y-2">
                {assignments.map((a, i) => (
                  <li key={a.id}>
                    <Link href={`/teacher/assignments/${a.id}`} className="block">
                      <Card className="ccard p-3 pl-4 transition hover:ring-primary" style={cardTone(i)}>
                        <p className="font-medium text-ink">{a.title}</p>
                        <p className="text-xs text-ink-3">{day(a.due_date)} · {a.max_marks} marks</p>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No assignments yet.</Empty>
            )}
          </section>
          <section>
            <SectionTitle>Recent quiz scores</SectionTitle>
            {recent_scores.length ? (
              <Card className="overflow-x-auto p-0">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-ink-3">
                    <tr><th className="px-3 py-2">Student</th><th className="px-3 py-2">Score</th><th className="px-3 py-2">When</th></tr>
                  </thead>
                  <tbody>
                    {recent_scores.map((r, i) => (
                      <tr key={i} className="border-t border-line">
                        <td className="px-3 py-2 text-ink">{r.student}</td>
                        <td className="px-3 py-2 text-ink-2">{r.score}/{r.total} · {r.percent}%</td>
                        <td className="px-3 py-2 text-ink-3">{r.submitted_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : (
              <Empty>No quiz attempts yet.</Empty>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
