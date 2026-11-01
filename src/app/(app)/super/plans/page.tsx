import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, SectionTitle, buttonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { deletePlan, togglePlan } from "@/lib/super-actions";
import { superApi, type Plan } from "@/lib/super-api";
import { ConfirmButton } from "@/components/confirm-button";
import { inr } from "../format";

export const metadata: Metadata = { title: "Plans" };

const GROUPS: [Plan["audience"], string][] = [
  ["individual", "Individual plans (students)"],
  ["school", "School plans"],
];

function PlanCard({ p, index }: { p: Plan; index: number }) {
  return (
    <Card className="ccard flex h-full flex-col gap-2 p-4" style={cardTone(index)}>
      <p className="flex items-start justify-between gap-2">
        <span className="font-semibold text-brand">{p.is_featured && "★ "}{p.name}</span>
        <Pill tone={p.is_active ? "success" : "neutral"}>{p.is_active ? "Active" : "Hidden"}</Pill>
      </p>
      <p className="text-xs capitalize text-ink-3">{p.audience} · {p.key}</p>
      <p className="text-sm text-ink">{inr(p.monthly_price)}/mo · {inr(p.yearly_price)}/yr{p.trial_days ? ` · ${p.trial_days}-day trial` : ""}</p>
      {p.tagline && <p className="text-xs text-ink-2">{p.tagline}</p>}
      {!!p.features?.length && (
        <ul className="list-inside list-disc text-xs text-ink-2">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <Link href={`/super/plans/${p.id}`} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">Edit</Link>
        <form action={togglePlan.bind(null, p.id)}>
          <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">{p.is_active ? "Hide" : "Activate"}</button>
        </form>
        <ConfirmButton action={deletePlan.bind(null, p.id)} message={`Delete the ${p.name} plan?`} className="rounded-md border border-danger/40 px-2 py-1 text-xs text-danger hover:bg-danger-light">
          Delete
        </ConfirmButton>
      </div>
    </Card>
  );
}

export default async function PlansPage() {
  const plans = await superApi.plans();
  return (
    <>
      <PageHeader
        title="Plans"
        subtitle="Pricing pages and checkout read these"
        action={<Link href="/super/plans/new" className={buttonClass}>+ Add plan</Link>}
      />
      {plans.length ? (
        <div className="space-y-8">
          {GROUPS.map(([audience, title]) => {
            const list = plans.filter((p) => p.audience === audience);
            return list.length ? (
              <section key={audience}>
                <SectionTitle>{title}</SectionTitle>
                <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {list.map((p, i) => <li key={p.id}><PlanCard p={p} index={i} /></li>)}
                </ul>
              </section>
            ) : null;
          })}
        </div>
      ) : <Empty>No plans yet.</Empty>}
    </>
  );
}
