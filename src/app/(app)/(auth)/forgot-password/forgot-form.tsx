"use client";

import { useActionState } from "react";
import { AuthAlert, AuthField, Spinner } from "@/components/auth/auth-fields";
import { authButton, authInput } from "@/components/auth/auth-styles";
import { sendResetLink } from "@/lib/auth-actions";

export function ForgotForm() {
  const [state, action, pending] = useActionState(sendResetLink, undefined);
  return (
    <form action={action} className="mt-7 space-y-5">
      {state?.message && <AuthAlert tone={state.ok ? "success" : "error"}>{state.message}</AuthAlert>}
      <AuthField label="Email">
        {(c) => (
          <input
            key={state?.email}
            name="email"
            type="email"
            defaultValue={state?.email}
            {...c}
            required
            autoFocus
            autoComplete="email"
            spellCheck={false}
            className={authInput}
          />
        )}
      </AuthField>
      <button type="submit" disabled={pending} className={authButton}>
        {pending && <Spinner />}
        {pending ? "Sending…" : "Send reset link →"}
      </button>
    </form>
  );
}
