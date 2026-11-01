import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { PlanForm } from "../plan-form";

export const metadata: Metadata = { title: "Add plan" };

export default function NewPlanPage() {
  return (
    <>
      <PageHeader back={{ href: "/super/plans", label: "Plans" }} title="Add plan" />
      <Card className="max-w-3xl"><PlanForm /></Card>
    </>
  );
}
