import type { Metadata } from "next";
import { Card, PageHeader, Pill } from "@/components/ui";
import { billingApi } from "@/lib/billing-api";
import { getCurrentUser } from "@/lib/dal";
import { mjY } from "@/lib/money";
import { PlanCards } from "./plan-cards";
import { isActive } from "./active";

export const metadata: Metadata = { title: "My Plan" };

/** Legacy StudentController::plan + student/plan.blade.php: the current plan and all individual plans. */
export default async function StudentPlanPage() {
  const user = await getCurrentUser();

  // Legacy hides "My Plan" from school students: their access comes from the school.
  if (user.school) {
    return (
      <>
        <PageHeader title="My Plan" subtitle="Your membership" />
        <Card className="max-w-lg">
          <p className="font-semibold text-ink">Covered by {user.school.name}</p>
          <p className="mt-1 text-sm text-ink-2">Your access comes through your school, so there is no personal plan to manage.</p>
        </Card>
      </>
    );
  }

  const { subscription: sub, plans } = await billingApi.paywall();
  const currentKey = sub?.plan ?? null;
  const current = currentKey && plans[currentKey] ? { key: currentKey, ...plans[currentKey] } : null;
  const cycle = sub?.meta?.cycle === "yearly" ? "yearly" : "monthly";
  const renews = sub?.current_period_end ?? null;
  const active = isActive(sub);

  return (
    <>
      <PageHeader
        title="My Plan"
        subtitle={[current?.name ?? "No active plan", renews && `Renews ${mjY(renews)}`].filter(Boolean).join(" · ")}
      />

      {current ? (
        <section className="mb-8 rounded-3xl bg-[linear-gradient(120deg,#1A0A0C,#2A0E13_50%,#3D1520)] p-6 text-white">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">✦ Current plan</p>
          <p className="mt-1 text-3xl font-black tracking-tight">{current.name}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
            <Pill tone={active ? "success" : "neutral"}>{active ? "● Active" : "○ Lapsed"}</Pill>
            <span>
              ₹{current[cycle].toLocaleString("en-IN")} / {cycle === "yearly" ? "year" : "month"}
            </span>
            {renews && (
              <span>
                🗓 {active ? "Renews on" : "Expired on"} {mjY(renews)}
              </span>
            )}
          </div>
        </section>
      ) : (
        <Card className="mb-8">
          <p className="font-semibold text-ink">No active plan</p>
          <p className="text-sm text-ink-2">Choose a plan below to unlock your full syllabus.</p>
        </Card>
      )}

      <PlanCards plans={plans} currentKey={currentKey} initialCycle={cycle} />
      <p className="mt-6 text-center text-xs text-ink-3">
        🔒 Secure checkout. Cancel anytime. Demo mode activates instantly until payment keys are configured.
      </p>
    </>
  );
}
