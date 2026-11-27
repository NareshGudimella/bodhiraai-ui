"use client";

import { useActionState } from "react";
import { AuthAlert, AuthField, PasswordInput, Spinner } from "@/components/auth/auth-fields";
import { authButton, authInput } from "@/components/auth/auth-styles";
import { resetPassword } from "@/lib/auth-actions";
import { NewPasswordInput } from "@/components/new-password-input";
import { L, emailProps } from "@/lib/input-limits";

export function ResetForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined);
  return (
    <form action={action} className="mt-7 space-y-5">
      {state?.message && <AuthAlert tone="error">{state.message}</AuthAlert>}
      <input type="hidden" name="token" value={token} />
      <AuthField label="Email">
        {(c) => (
          <input
            key={state?.email}
            name="email"
            defaultValue={state?.email ?? email}
            {...c}
            {...emailProps(L.email)}
            required
            className={authInput}
          />
        )}
      </AuthField>
      <AuthField label="New password">
        {(c) => <NewPasswordInput auth {...c} name="password" required />}
      </AuthField>
      <AuthField label="Confirm password">
        {(c) => <PasswordInput {...c} name="password_confirmation" required maxLength={L.passwordMax} autoComplete="new-password" />}
      </AuthField>
      <button type="submit" disabled={pending} className={authButton}>
        {pending && <Spinner />}
        {pending ? "Saving…" : "Reset password →"}
      </button>
    </form>
  );
}
