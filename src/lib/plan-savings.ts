import type { PricePlan } from "@/lib/site-api";

/** Whole-percent saving of the yearly price over twelve monthly payments (0 when there is none). not in legacy */
export function yearlySavingPct(plan: Pick<PricePlan, "monthly_price" | "yearly_price">): number {
  const twelve = plan.monthly_price * 12;
  return twelve > 0 && plan.yearly_price < twelve ? Math.round(((twelve - plan.yearly_price) / twelve) * 100) : 0;
}

/** The largest yearly saving across plans, for "save up to" copy. not in legacy */
export function maxYearlySavingPct(plans: PricePlan[]): number {
  return plans.reduce((max, p) => Math.max(max, yearlySavingPct(p)), 0);
}
