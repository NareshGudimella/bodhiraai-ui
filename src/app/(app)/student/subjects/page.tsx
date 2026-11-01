import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { studentApi } from "@/lib/student-api";
import { SubjectGrid } from "./subject-grid";

export const metadata: Metadata = { title: "Subjects" };

export default async function SubjectsPage() {
  const subjects = await studentApi.subjects();
  return (
    <>
      <PageHeader title="Subjects" subtitle="Pick a subject to see its chapters." />
      <SubjectGrid subjects={subjects} />
    </>
  );
}
