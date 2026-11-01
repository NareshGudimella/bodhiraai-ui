import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { SyllabusForm } from "../syllabus-form";

export const metadata: Metadata = { title: "Add syllabus" };

export default function NewSyllabusPage() {
  return (
    <>
      <PageHeader back={{ href: "/super/syllabi", label: "Syllabi" }} title="Add syllabus" />
      <Card className="max-w-2xl"><SyllabusForm /></Card>
    </>
  );
}
