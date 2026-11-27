import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { teacherApi } from "@/lib/teacher-api";
import { AssignmentForm } from "./assignment-form";

export const metadata: Metadata = { title: "New assignment" };

/** `?class=` picks which class's subjects to offer. */
export default async function NewAssignmentPage({ searchParams }: PageProps<"/teacher/assignments/new">) {
  const classes = await teacherApi.classes();
  const requested = (await searchParams).class;
  // The URL carries the class slug; the form posts the numeric id (`class_id`). An old `?class=<id>` still works.
  const match = typeof requested === "string" ? classes.find((c) => c.slug === requested || String(c.id) === requested) : classes[0];
  const classId = match ? String(match.id) : typeof requested === "string" ? requested : undefined;
  const subjects = classId ? (await teacherApi.class(match?.slug ?? classId)).class.subjects : [];
  return (
    <>
      <PageHeader back={{ href: "/teacher/assignments", label: "Assignments" }} title="New assignment" />
      <AssignmentForm classes={classes} classId={classId} subjects={subjects} />
    </>
  );
}
