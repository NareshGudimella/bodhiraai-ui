"use client";

import { useActionState, useState } from "react";
import { CycleToggle, type Cycle } from "@/components/billing/cycle-toggle";
import { paywallCheckout } from "@/lib/billing-actions";
import type { IndividualPlan } from "@/lib/billing-api";

/** The paywall's B2C plans with the cycle switch; choosing one activates it. */
export function PaywallPlans({ plans }: { plans: Record<string, IndividualPlan> }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [state, action, pending] = useActionState(paywallCheckout, undefined);
  return (
    <>
      <div className="mb-7 flex justify-center">
        <CycleToggle cycle={cycle} onChange={setCycle} saving="· save 16%" />
      </div>
      {state?.message && (
        <p role="alert" className="mx-auto mb-4 max-w-md rounded-lg bg-danger-light px-3 py-2 text-center text-sm text-danger">
          {Object.values(state.errors ?? {})[0]?.[0] ?? state.message}
        </p>
      )}
      <div className="grid gap-5 [&>*]:min-w-0 sm:grid-cols-2">
        {Object.entries(plans).map(([key, plan]) => {
          const featured = key === "individual_premium";
          return (
            <article
              key={key}
              className={`flex flex-col gap-3 rounded-3xl bg-card p-7 text-ink ${featured ? "ring-2 ring-primary shadow-[0_30px_60px_rgba(196,149,96,.35)]" : "ring-1 ring-line"}`}
            >
              {featured && (
                <span className="self-start rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold tracking-wider text-brand">MOST POPULAR</span>
              )}
              <p className="text-xs font-bold tracking-wider text-ink-3">{plan.tagline.toUpperCase()}</p>
              <h2 className="text-xl font-extrabold">{plan.name}</h2>
              <p className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight">₹{plan[cycle]}</span>
                <span className="text-sm font-semibold text-ink-3">/ {cycle === "yearly" ? "year" : "month"}</span>
              </p>
              <ul className="space-y-2 text-sm text-ink-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><span aria-hidden className="font-extrabold text-success">✓</span>{f}</li>
                ))}
              </ul>
              <form action={action} className="mt-auto pt-2">
                <input type="hidden" name="plan" value={key} />
                <input type="hidden" name="cycle" value={cycle} />
                <button
                  type="submit"
                  disabled={pending}
                  className={`w-full rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                    featured ? "bg-brand text-primary-light hover:bg-brand-mid" : "border border-line text-ink-2 hover:bg-primary-light"
                  }`}
                >
                  Choose {plan.name} →
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </>
  );
}
