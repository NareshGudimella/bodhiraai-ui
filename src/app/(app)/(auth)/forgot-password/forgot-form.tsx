"use client";

import { useActionState } from "react";
import { sendResetLink } from "@/lib/auth-actions";

const input = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function ForgotForm() {
  const [state, action, pending] = useActionState(sendResetLink, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      {state?.message && (
        <p role={state.ok ? "status" : "alert"} className={`rounded-lg px-3 py-2 text-sm ${state.ok ? "bg-success/10 text-success" : "bg-danger-light text-danger"}`}>
          {state.message}
        </p>
      )}
      <label className="block text-sm font-medium text-ink-2">
        Email
        <input key={state?.email} name="email" type="email" defaultValue={state?.email} required autoFocus autoComplete="email" className={input} />
      </label>
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand py-2.5 font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60">
        {pending ? "Sending…" : "Send reset link →"}
      </button>
    </form>
  );
}
