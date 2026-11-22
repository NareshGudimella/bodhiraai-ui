"use client";

import { useActionState } from "react";
import { AuthAlert, AuthField, PasswordInput, Spinner } from "@/components/auth/auth-fields";
import { authButton, authInput } from "@/components/auth/auth-styles";
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
    <form action={action} className="mt-7 space-y-5">
      {first && <AuthAlert tone="error">{first}</AuthAlert>}
      {!first && state?.message && state.ok === false && <AuthAlert tone="error">{state.message}</AuthAlert>}
      {planKey && (
        <>
          <input type="hidden" name="plan_key" value={planKey} />
          <input type="hidden" name="cycle" value={cycle} />
        </>
      )}
      <AuthField label="Full name" error={e?.name}>
        {(c) => (
          <input key={`n${v?.name}`} {...c} name="name" defaultValue={v?.name} autoComplete="name" required maxLength={120} autoFocus className={authInput} />
        )}
      </AuthField>
      <div className="grid gap-5 sm:grid-cols-2 [&>*]:min-w-0">
        <AuthField label="Email" error={e?.email}>
          {(c) => (
            <input
              key={`e${v?.email}`}
              {...c}
              name="email"
              type="email"
              defaultValue={v?.email}
              autoComplete="email"
              spellCheck={false}
              required
              maxLength={160}
              className={authInput}
            />
          )}
        </AuthField>
        <AuthField label="Phone (optional)" error={e?.phone}>
          {(c) => (
            <input
              key={`p${v?.phone}`}
              {...c}
              name="phone"
              type="tel"
              defaultValue={v?.phone}
              autoComplete="tel"
              maxLength={20}
              placeholder="+91…"
              className={authInput}
            />
          )}
        </AuthField>
      </div>
      <AuthField label="Board & grade" error={e?.syllabus_id}>
        {(c) => (
          <select key={`s${v?.syllabus_id}`} {...c} name="syllabus_id" defaultValue={v?.syllabus_id ?? ""} required className={`${authInput} auth-select`}>
            <option value="">— Select your board &amp; grade —</option>
            {syllabi.map((g) => (
              <optgroup key={g.board} label={boardLabel(g.board)}>
                {g.syllabi.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
      </AuthField>
      <div className="grid gap-5 sm:grid-cols-2 [&>*]:min-w-0">
        <AuthField label="Password" error={e?.password}>
          {(c) => <PasswordInput {...c} name="password" required minLength={6} autoComplete="new-password" />}
        </AuthField>
        <AuthField label="Confirm password">
          {(c) => <PasswordInput {...c} name="password_confirmation" required autoComplete="new-password" />}
        </AuthField>
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
        <input
          type="checkbox"
          name="accept"
          value="1"
          required
          aria-invalid={e?.accept ? true : undefined}
          className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded accent-(--auth-wine) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--auth-wine)"
        />
        I agree to the Terms of Service and Privacy Policy.
      </label>
      <button type="submit" disabled={pending} className={authButton}>
        {pending && <Spinner />}
        {pending ? "Creating your account…" : paid ? "Create account · Continue to payment →" : "Start 7-day free trial →"}
      </button>
    </form>
  );
}
