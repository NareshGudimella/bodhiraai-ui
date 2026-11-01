"use client";

import { useActionState } from "react";
import { Field, inputClass } from "@/components/form";
import { registerStudent } from "@/lib/billing-actions";
import type { SignupOptions } from "@/lib/billing-api";

/** Legacy optgroup labels: CBSE, ICSE, then "State Board · <state>". */
const boardLabel = (board: string) => (board.startsWith("STATE_") ? `State Board · ${board.slice(6)}` : board);

export function SignupForm({
  syllabi,
  planKey,
  cycle,
  paid,
}: {
  syllabi: SignupOptions["syllabi"];
  planKey: string | null;
  cycle: string;
  paid: boolean;
}) {
  const [state, action, pending] = useActionState(registerStudent, undefined);
  const v = state?.values;
  const e = state?.errors;
  const first = e && Object.values(e)[0]?.[0];
  return (
    <form action={action} className="mt-6 space-y-4">
      {first && (
        <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{first}</p>
      )}
      {!first && state?.message && state.ok === false && (
        <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{state.message}</p>
      )}
      {planKey && (
        <>
          <input type="hidden" name="plan_key" value={planKey} />
          <input type="hidden" name="cycle" value={cycle} />
        </>
      )}
      <Field label="Full name" error={e?.name}>
        <input key={`n${v?.name}`} name="name" defaultValue={v?.name} autoComplete="name" required maxLength={120} autoFocus className={inputClass} />
      </Field>
      <Field label="Email" error={e?.email}>
        <input key={`e${v?.email}`} name="email" type="email" defaultValue={v?.email} autoComplete="email" required maxLength={160} className={inputClass} />
      </Field>
      <Field label="Phone (optional)" error={e?.phone}>
        <input key={`p${v?.phone}`} name="phone" defaultValue={v?.phone} autoComplete="tel" maxLength={20} placeholder="+91…" className={inputClass} />
      </Field>
      <Field label="Board & grade" error={e?.syllabus_id}>
        <select key={`s${v?.syllabus_id}`} name="syllabus_id" defaultValue={v?.syllabus_id ?? ""} required className={inputClass}>
          <option value="">— Select your board &amp; grade —</option>
          {syllabi.map((g) => (
            <optgroup key={g.board} label={boardLabel(g.board)}>
              {g.syllabi.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field label="Password" error={e?.password}>
        <input name="password" type="password" required minLength={6} autoComplete="new-password" className={inputClass} />
      </Field>
      <Field label="Confirm password">
        <input name="password_confirmation" type="password" required autoComplete="new-password" className={inputClass} />
      </Field>
      <label className="flex items-start gap-2 text-sm text-ink-2">
        <input type="checkbox" name="accept" value="1" required className="mt-1" />
        I agree to the Terms of Service and Privacy Policy.
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand py-2.5 font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60"
      >
        {pending ? "Creating your account…" : paid ? "Create account · Continue to payment →" : "Start 7-day free trial →"}
      </button>
    </form>
  );
}
