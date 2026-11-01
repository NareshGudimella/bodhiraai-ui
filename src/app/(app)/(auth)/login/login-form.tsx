"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "@/lib/auth-actions";

const input =
  "mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(login, undefined);
  const fieldError = state?.errors?.identifier?.[0];

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm font-medium text-ink-2">
        Email, phone or username
        <input
          name="identifier"
          defaultValue={state?.identifier}
          autoComplete="username"
          required
          className={input}
        />
      </label>
      <label className="block text-sm font-medium text-ink-2">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      <p className="-mt-2 text-right text-sm">
        <Link href="/forgot-password" className="font-semibold text-brand hover:underline">Forgot password?</Link>
      </p>

      {(fieldError || state?.message) && (
        <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
          {fieldError ?? state?.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand py-2.5 font-semibold text-primary-light transition hover:bg-brand-mid disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
