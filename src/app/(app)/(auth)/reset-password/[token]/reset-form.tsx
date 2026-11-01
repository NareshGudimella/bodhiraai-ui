"use client";

import { useActionState } from "react";
import { resetPassword } from "@/lib/auth-actions";

const input = "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function ResetForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      {state?.message && <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{state.message}</p>}
      <input type="hidden" name="token" value={token} />
      <label className="block text-sm font-medium text-ink-2">
        Email
        <input key={state?.email} name="email" type="email" defaultValue={state?.email ?? email} required autoComplete="email" className={input} />
      </label>
      <label className="block text-sm font-medium text-ink-2">
        New password
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </label>
      <label className="block text-sm font-medium text-ink-2">
        Confirm password
        <input name="password_confirmation" type="password" required autoComplete="new-password" className={input} />
      </label>
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand py-2.5 font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60">
        {pending ? "Saving…" : "Reset password →"}
      </button>
    </form>
  );
}
