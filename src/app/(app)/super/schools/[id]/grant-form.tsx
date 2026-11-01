"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { grantPlan } from "@/lib/billing-actions";

/** Legacy "Manual Plan Grant" on the school page (BillingController::manualGrant). */
export function GrantForm({ schoolId, plans, current }: { schoolId: number; plans: readonly string[]; current: string }) {
  const [state, action, pending] = useActionState(grantPlan.bind(null, schoolId), undefined);
  const v = state?.ok ? undefined : state?.values;
  const e = state?.errors;
  return (
    <form action={action} className="space-y-3">
      <p className="text-sm text-ink-2">Use this for offline payments (wire transfer / cheque) or to comp a plan.</p>
      <div className="grid gap-3 [&>*]:min-w-0 sm:grid-cols-2">
        <Field label="Plan" error={e?.plan}>
          <select key={`p${v?.plan ?? current}`} name="plan" defaultValue={v?.plan ?? current} required className={`${inputClass} capitalize`}>
            {plans.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Days" error={e?.days}>
          <input key={`d${v?.days}`} name="days" type="number" defaultValue={v?.days ?? 30} min={1} max={730} required className={inputClass} />
        </Field>
        <Field label="Amount (₹ paise)" error={e?.amount_paise} hint="paise; ₹1 = 100">
          <input key={`a${v?.amount_paise}`} name="amount_paise" type="number" defaultValue={v?.amount_paise ?? 0} min={0} step={100} required className={inputClass} />
        </Field>
        <Field label="Note" error={e?.note}>
          <input key={`n${v?.note}`} name="note" defaultValue={v?.note} maxLength={255} placeholder="Reason / reference" className={inputClass} />
        </Field>
      </div>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Granting…" : "Grant"}</button>
    </form>
  );
}
