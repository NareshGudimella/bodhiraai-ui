"use client";

import { useActionState } from "react";
import { cmsLogin } from "@/lib/cms-actions";

const input =
  "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function CmsLoginForm() {
  const [state, action, pending] = useActionState(cmsLogin, undefined);
  const error = state?.errors?.identifier?.[0] ?? (state?.ok === false ? state.message : undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-ink-2">
        Email, phone or username
        <input name="identifier" key={state?.values?.identifier} defaultValue={state?.values?.identifier} autoComplete="username" required className={input} />
      </label>
      <label className="block text-sm font-medium text-ink-2">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      {error && <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{error}</p>}
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand py-2.5 font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
