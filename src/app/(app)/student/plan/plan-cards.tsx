"use client";

import { useActionState, useState } from "react";
import { CycleToggle, type Cycle } from "@/components/billing/cycle-toggle";
import { paywallCheckout } from "@/lib/billing-actions";
import type { IndividualPlan } from "@/lib/billing-api";

/** All individual plans with the monthly/yearly switch; Renew, Upgrade and Choose Plan all post to the paywall checkout. */
export function PlanCards({
  plans,
  currentKey,
  initialCycle,
}: {
  plans: Record<string, IndividualPlan>;
  currentKey: string | null;
  initialCycle: Cycle;
}) {
  const [cycle, setCycle] = useState<Cycle>(initialCycle);
  const [state, action, pending] = useActionState(paywallCheckout, undefined);
  return (
    <>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-3">All plans</h2>
      <div className="mb-5 [&_[role=tablist]]:bg-primary-light">
        <CycleToggle cycle={cycle} onChange={setCycle} saving="· save ~30%" />
      </div>
      {state?.message && (
        <p role="alert" className="mb-4 max-w-md rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
          {Object.values(state.errors ?? {})[0]?.[0] ?? state.message}
        </p>
      )}
      <div className="grid gap-5 [&>*]:min-w-0 sm:grid-cols-2">
        {Object.entries(plans).map(([key, plan]) => {
          const isCurrent = key === currentKey;
          const featured = key === "individual_premium";
          const upgrade = currentKey === "individual_basic" && featured;
          return (
            <article
              key={key}
              className={`relative flex flex-col gap-3 rounded-3xl bg-card p-6 text-ink ${
                isCurrent ? "ring-2 ring-success" : featured ? "ring-2 ring-primary" : "ring-1 ring-line"
              }`}
            >
              {isCurrent ? (
                <span className="absolute right-4 top-4 rounded-full bg-success/10 px-3 py-1 text-[11px] font-extrabold text-success">✓ Your plan</span>
              ) : featured ? (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold text-brand">⭐ Popular</span>
              ) : null}
              <h3 className="text-lg font-extrabold">{plan.name}</h3>
              <p className="-mt-2 text-sm text-ink-2">{plan.tagline}</p>
              <p className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight">₹{plan[cycle].toLocaleString("en-IN")}</span>
                <span className="text-sm font-semibold text-ink-3">/ {cycle === "yearly" ? "year" : "month"}</span>
              </p>
              <ul className="space-y-2 text-sm text-ink-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><span aria-hidden className="font-extrabold text-success">✓</span>{f}</li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 pt-2">
                {isCurrent && (
                  <form action={action}>
                    <input type="hidden" name="plan" value={key} />
                    <input type="hidden" name="cycle" value={cycle} />
                    <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60">
                      🔄 Renew plan →
                    </button>
                  </form>
                )}
                {!isCurrent && (
                  <form action={action}>
                    <input type="hidden" name="plan" value={key} />
                    <input type="hidden" name="cycle" value={cycle} />
                    <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60">
                      {upgrade ? "⬆ Upgrade" : "Choose plan"} →
                    </button>
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
