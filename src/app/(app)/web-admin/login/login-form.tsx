"use client";

import { useActionState } from "react";
import { AuthAlert, AuthField, PasswordInput, Spinner } from "@/components/auth/auth-fields";
import { authButton, authInput } from "@/components/auth/auth-styles";
import { cmsLogin } from "@/lib/cms-actions";
import { L, currentPasswordProps } from "@/lib/input-limits";

export function CmsLoginForm() {
  const [state, action, pending] = useActionState(cmsLogin, undefined);
  const identifierError = state?.errors?.identifier?.[0];
  const passwordError = state?.errors?.password?.[0];
  // A field error shows under its field; any other failure above the button.
  const general = !identifierError && !passwordError && state?.ok === false ? state.message : undefined;
  return (
    <form action={action} className="mt-7 space-y-5">
      <AuthField label="Email, phone or username" error={identifierError}>
        {(c) => (
          <input
            key={state?.values?.identifier}
            {...c}
            name="identifier"
            defaultValue={state?.values?.identifier}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={L.identifier}
            className={authInput}
          />
        )}
      </AuthField>
      <AuthField label="Password" error={passwordError}>
        {(c) => <PasswordInput {...c} name="password" {...currentPasswordProps} required />}
      </AuthField>
      {general && <AuthAlert tone="error">{general}</AuthAlert>}
      <button type="submit" disabled={pending} className={authButton}>
        {pending && <Spinner />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
