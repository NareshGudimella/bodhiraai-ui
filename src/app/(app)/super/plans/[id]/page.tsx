import { Card, PageHeader } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { PlanForm } from "../plan-form";

export default async function EditPlanPage({ params }: PageProps<"/super/plans/[id]">) {
  const { id } = await params;
  const p = await superApi.plan(id);
  return (
    <>
      <PageHeader back={{ href: "/super/plans", label: "Plans" }} title={`Edit: ${p.name}`} />
      <Card className="max-w-3xl">
        <PlanForm
          id={p.id}
          initial={{
            key: p.key,
            audience: p.audience,
            name: p.name,
            tagline: p.tagline ?? "",
            description: p.description ?? "",
            features: (p.features ?? []).join("\n"),
            monthly_price: String(p.monthly_price),
            yearly_price: String(p.yearly_price),
            trial_days: String(p.trial_days),
            is_featured: p.is_featured ? "1" : "0",
            is_active: p.is_active ? "1" : "0",
            sort_order: String(p.sort_order),
          }}
        />
      </Card>
    </>
  );
}
