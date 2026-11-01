import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { PLAN_KEYS, superApi } from "@/lib/super-api";
import { SchoolForm } from "../school-form";

export const metadata: Metadata = { title: "Add school" };

export default async function NewSchoolPage() {
  const { syllabi, plan_prices } = await superApi.schoolFormOptions();
  return (
    <>
      <PageHeader back={{ href: "/super/schools", label: "Schools" }} title="Add school" />
      <Card className="max-w-2xl"><SchoolForm plans={PLAN_KEYS} prices={plan_prices} syllabi={syllabi} /></Card>
    </>
  );
}
