import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, buttonClass, secondaryButtonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { teacherApi } from "@/lib/teacher-api";

export const metadata: Metadata = { title: "Classes" };

export default async function ClassesPage() {
  const classes = await teacherApi.classes();
  return (
    <>
      <PageHeader title="Classes" subtitle="Classes you teach or are class teacher for." />
      {classes.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((c, i) => (
            <li key={c.id}>
              <Card className="ccard flex h-full flex-col p-4 pl-5 transition hover:ring-primary" style={cardTone(i)}>
                <Link href={`/teacher/classes/${c.id}`} className="block flex-1">
                  <p className="text-lg font-semibold text-brand">{c.label}</p>
                  <p className="text-sm text-ink-2">
                    {c.students_count} {c.students_count === 1 ? "student" : "students"}
                    {c.academic_year ? ` · A.Y ${c.academic_year}` : ""}
                  </p>
                  {c.class_teacher && <p className="mt-1 text-xs text-ink-3">Class teacher: {c.class_teacher}</p>}
                </Link>
                <div className="mt-3 flex gap-2">
                  <Link href={`/teacher/classes/${c.id}`} className={buttonClass}>Overview</Link>
                  <Link href={`/teacher/classes/${c.id}/attendance`} className={secondaryButtonClass}>Attendance</Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No classes assigned yet.</Empty>
      )}
    </>
  );
}
