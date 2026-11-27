"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { savePlan } from "@/lib/super-actions";
import { L, N, PLAN_KEY_PATTERN, numberProps } from "@/lib/input-limits";
import { CountedTextarea } from "@/components/counted-textarea";

type Values = Partial<Record<
  "key" | "audience" | "name" | "tagline" | "description" | "features" | "monthly_price" | "yearly_price" | "trial_days" | "is_featured" | "is_active" | "sort_order",
  string
>>;

export function PlanForm({ id, initial = {} }: { id?: number; initial?: Values }) {
  const [state, action, pending] = useActionState(savePlan.bind(null, id ?? null), undefined);
  const e = state?.errors ?? {};
  const v: Values = { ...initial, ...state?.values };
  const num = (name: keyof Values, label: string, max: number, fallback = "0", required = false) => (
    <Field label={label} error={e[name]}>
      <input name={name} {...numberProps([0, max])} required={required} defaultValue={v[name] ?? fallback} className={inputClass} />
    </Field>
  );
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(v)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" error={e.name}><input name="name" required maxLength={100} defaultValue={v.name} className={inputClass} /></Field>
        <Field label="Key" error={e.key} hint="Lowercase, digits and _. Blank: made from the name">
          <input name="key" maxLength={50} pattern={PLAN_KEY_PATTERN} title="Lowercase letters, digits and _" defaultValue={v.key} className={inputClass} />
        </Field>
        <Field label="Audience" error={e.audience}>
          <select name="audience" required defaultValue={v.audience ?? "individual"} className={inputClass}>
            <option value="individual">Individual (students)</option>
            <option value="school">School</option>
          </select>
        </Field>
        <Field label="Tagline" error={e.tagline}><input name="tagline" maxLength={200} defaultValue={v.tagline} className={inputClass} /></Field>
      </div>
      <Field label="Description" error={e.description}><CountedTextarea name="description" rows={2} maxLength={L.description} defaultValue={v.description} className={inputClass} /></Field>
      <Field label="Features" error={e.features} hint="One per line">
        <CountedTextarea name="features" rows={4} maxLength={5000} defaultValue={v.features} className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {num("monthly_price", "Monthly (₹)", 9999999, "0", true)}
        {num("yearly_price", "Yearly (₹)", 99999999, "0", true)}
        {num("trial_days", "Trial days", 90)}
        {num("sort_order", "Sort order", N.sortOrder[1])}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Featured" error={e.is_featured}>
          <select name="is_featured" defaultValue={v.is_featured ?? "0"} className={inputClass}>
            <option value="0">No</option>
            <option value="1">Yes, show ★ ribbon</option>
          </select>
        </Field>
        <Field label="Status" error={e.is_active}>
          <select name="is_active" defaultValue={v.is_active ?? "1"} className={inputClass}>
            <option value="1">Active (visible)</option>
            <option value="0">Hidden</option>
          </select>
        </Field>
      </div>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Saving…" : id ? "Save plan" : "Create plan"}</button>
    </form>
  );
}
