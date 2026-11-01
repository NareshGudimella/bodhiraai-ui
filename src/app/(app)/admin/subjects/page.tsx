import type { Metadata } from "next";
import { Empty, PageHeader } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";
import { CreateSubjectForm, SubjectRow } from "./subject-forms";

export const metadata: Metadata = { title: "Subjects" };

export default async function AdminSubjectsPage() {
  const subjects = await adminApi.subjects();
  return (
    <>
      <PageHeader title="Subjects" subtitle="Your school's own subjects. Platform syllabi are managed by Bodhira." />
      <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <section>
          {subjects.length ? (
            <ul className="rounded-2xl bg-card ring-1 ring-line">{subjects.map((s) => <SubjectRow key={s.id} subject={s} />)}</ul>
          ) : <Empty>No school subjects yet.</Empty>}
        </section>
        <CreateSubjectForm />
      </div>
    </>
  );
}
