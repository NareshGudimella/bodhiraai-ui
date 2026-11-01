import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { teacherApi } from "@/lib/teacher-api";
import { AssignmentForm } from "./assignment-form";

export const metadata: Metadata = { title: "New assignment" };

/** `?class=` picks which class's subjects to offer. */
export default async function NewAssignmentPage({ searchParams }: PageProps<"/teacher/assignments/new">) {
  const classes = await teacherApi.classes();
  const requested = (await searchParams).class;
  const classId = typeof requested === "string" ? requested : classes[0] ? String(classes[0].id) : undefined;
  const subjects = classId ? (await teacherApi.class(classId)).class.subjects : [];
  return (
    <>
      <PageHeader back={{ href: "/teacher/assignments", label: "Assignments" }} title="New assignment" />
      <AssignmentForm classes={classes} classId={classId} subjects={subjects} />
    </>
  );
}
