import { Avatar } from "@/components/avatar";
import { Card, Empty, PageHeader, SectionTitle } from "@/components/ui";
import { unenrolStudent, unlinkSubject } from "@/lib/admin-actions";
import { cardTone } from "@/lib/appearance";
import { adminApi } from "@/lib/admin-api";
import { EnrolForm, LinkSubjectForm } from "./class-forms";

export default async function AdminClassPage({ params }: PageProps<"/admin/classes/[id]">) {
  const { id } = await params;
  const [detail, options] = await Promise.all([adminApi.class(id), adminApi.classOptions(id)]);
  const { class: c, students, subjects } = detail;
  const teacherName = new Map(options.teachers.map((t) => [t.id, t.name]));
  return (
    <>
      <PageHeader
        back={{ href: "/admin/classes", label: "Classes" }}
        title={c.label}
        subtitle={[c.class_teacher && `Class teacher: ${c.class_teacher}`, c.academic_year].filter(Boolean).join(" · ") || undefined}
      />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>Students · {students.length}</SectionTitle>
          <EnrolForm classId={c.id} students={options.available_students} />
          {students.length ? (
            <div className="mt-3 overflow-x-auto rounded-2xl bg-card ring-1 ring-line">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-ink-3">
                  <tr><th className="px-4 py-2">Roll</th><th className="px-4 py-2">Student</th><th className="px-4 py-2">Grade</th><th className="px-4 py-2" /></tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-t border-line">
                      <td className="px-4 py-2 text-xs text-ink-3">{s.roll_no ?? "—"}</td>
                      <td className="px-4 py-2"><span className="flex items-center gap-2"><Avatar name={s.name} src={s.avatar} size={28} />{s.name}</span></td>
                      <td className="px-4 py-2 text-ink-2">{s.grade ? `G${s.grade}` : "—"}</td>
                      <td className="px-4 py-2 text-right">
                        <form action={unenrolStudent.bind(null, c.id, s.id)}>
                          <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-danger-light hover:text-danger">Remove</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <Empty>No students enrolled.</Empty>}
        </section>
        <section>
          <SectionTitle>Subjects · {subjects.length}</SectionTitle>
          <LinkSubjectForm classId={c.id} subjects={options.available_subjects} teachers={options.teachers} />
          {subjects.length ? (
            <ul className="mt-3 space-y-2">
              {subjects.map((s, i) => (
                <li key={s.id}>
                  <Card className="ccard flex items-center justify-between gap-2 p-3 text-sm" style={cardTone(i)}>
                    <span className="min-w-0">
                      <span className="block font-medium text-ink"><span aria-hidden className="ccard-tile mr-1 inline-flex size-7 items-center justify-center rounded-lg">{s.icon ?? "📘"}</span> {s.name}{s.grade && <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-ink-2">Grade {s.grade}</span>}</span>
                      <span className="block text-xs text-ink-3">{s.teacher_id ? `Teacher: ${teacherName.get(s.teacher_id) ?? `#${s.teacher_id}`}` : "No teacher"}</span>
                    </span>
                    <form action={unlinkSubject.bind(null, c.id, s.id)}>
                      <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-danger-light hover:text-danger">Unlink</button>
                    </form>
                  </Card>
                </li>
              ))}
            </ul>
          ) : <Empty>No subjects linked.</Empty>}
        </section>
      </div>
    </>
  );
}
