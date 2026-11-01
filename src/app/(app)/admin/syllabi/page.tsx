import type { Metadata } from "next";
import { Empty, PageHeader } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";
import { SyllabusToggle } from "./syllabus-toggle";

export const metadata: Metadata = { title: "Syllabi" };

export default async function AdminSyllabiPage() {
  const { school, syllabi, opted_ids } = await adminApi.syllabi();
  const opted = new Set(opted_ids);
  return (
    <>
      <PageHeader title="Syllabi" subtitle={`Boards and grades ${school.name} subscribes to. Their subjects appear for your students.`} />
      <p className="-mt-3 mb-6 flex flex-wrap gap-2 text-xs text-ink-2">
        <span className="rounded-full bg-primary-light px-3 py-1">📚 {syllabi.length} {syllabi.length === 1 ? "syllabus" : "syllabi"}</span>
        <span className="rounded-full bg-primary-light px-3 py-1">✅ {opted.size} subscribed</span>
      </p>
      {syllabi.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {syllabi.map((s, i) => (
            <li key={s.id}><SyllabusToggle syllabus={s} subscribed={opted.has(s.id)} index={i} /></li>
          ))}
        </ul>
      ) : <Empty>No syllabi are available yet.</Empty>}
    </>
  );
}
