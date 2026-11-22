"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { AuthAlert, AuthField, PasswordInput, Spinner } from "@/components/auth/auth-fields";
import { authButton, authInput, authLink } from "@/components/auth/auth-styles";
import { login } from "@/lib/auth-actions";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(login, undefined);
  const identifierError = state?.errors?.identifier?.[0];
  const passwordError = state?.errors?.password?.[0];
  // A field error shows under its field; anything else (e.g. "Enter your email…") above the button.
  const general = !identifierError && !passwordError ? state?.message : undefined;

  return (
    <form action={action} className="mt-7 space-y-5">
      <input type="hidden" name="next" value={next} />
      <AuthField label="Email, phone or username" error={identifierError}>
        {(c) => (
          <input
            key={state?.identifier}
            name="identifier"
            defaultValue={state?.identifier}
            {...c}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            className={authInput}
          />
        )}
      </AuthField>
      <AuthField
        label="Password"
        error={passwordError}
        aside={
          <Link href="/forgot-password" className={`text-sm ${authLink}`}>
            Forgot password?
          </Link>
        }
      >
        {(c) => <PasswordInput {...c} name="password" autoComplete="current-password" required />}
      </AuthField>

      {general && <AuthAlert tone="error">{general}</AuthAlert>}

      <button type="submit" disabled={pending} className={authButton}>
        {pending && <Spinner />}
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
