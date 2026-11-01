import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";
import { CreateClassForm } from "./create-class-form";

export const metadata: Metadata = { title: "Classes" };

export default async function AdminClassesPage() {
  const [classes, teachers] = await Promise.all([adminApi.classes(), adminApi.users(new URLSearchParams({ role: "teacher", per_page: "100" }))]);
  // Legacy class-form default: date('Y').'-'.substr(date('Y')+1, -2)
  const year = new Date().getFullYear();
  const defaultYear = `${year}-${String(year + 1).slice(-2)}`;
  return (
    <>
      <PageHeader title="Classes" />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          {classes.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {classes.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/classes/${c.id}`} className="block h-full">
                    <Card className="h-full p-4 transition hover:ring-primary">
                      <p className="text-lg font-semibold text-brand">{c.label}</p>
                      <p className="text-xs text-ink-2">{c.class_teacher ? `Class teacher: ${c.class_teacher}` : "No class teacher"}</p>
                      <p className="mt-2 text-xs text-ink-3">{c.students_count} students · {c.subjects_count} subjects{c.academic_year ? ` · ${c.academic_year}` : ""}</p>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <Empty>No classes yet.</Empty>}
        </section>
        <CreateClassForm teachers={teachers.users.map((t) => ({ id: t.id, name: t.name }))} defaultYear={defaultYear} />
      </div>
    </>
  );
}
