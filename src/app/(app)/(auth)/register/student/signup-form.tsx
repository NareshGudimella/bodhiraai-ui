"use client";

import { useActionState, useEffect, useRef } from "react";
import { AuthAlert, AuthField, PasswordInput, Spinner } from "@/components/auth/auth-fields";
import { authButton, authInput, authLink } from "@/components/auth/auth-styles";
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
  const formRef = useRef<HTMLFormElement>(null);
  // After a failed submit, move focus to the first invalid field (not in legacy).
  useEffect(() => {
    if (state?.errors) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);
  return (
    <form ref={formRef} action={action} className="mt-7 space-y-5">
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
      {/* Consent (not in legacy, 2026-11-22): purpose notice, guardian statement, links, `consent=1` checked by registerStudent */}
      <div className="space-y-2.5 rounded-xl border border-line bg-[rgba(42,14,19,.025)] p-4">
        <p id="signup-consent-purpose" className="text-[13px] leading-relaxed text-ink-3">
          We use your details to create and run your account: lessons, quizzes, progress for you and your parents, AI help, and
          billing. Questions you ask the AI tutor are processed by Anthropic.
        </p>
        <p id="signup-consent-minor" className="text-[13px] font-semibold leading-relaxed text-ink-2">
          Under 18? A parent or guardian must create this account with you and give consent on your behalf.
        </p>
        <input type="hidden" name="consent" value="0" />
        <label htmlFor="signup-consent" className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-2">
          <input
            key={`c${v?.consent}`}
            id="signup-consent"
            type="checkbox"
            name="consent"
            value="1"
            required
            aria-required="true"
            defaultChecked={v?.consent === "1"}
            aria-invalid={e?.consent || e?.accept ? true : undefined}
            aria-describedby={`signup-consent-purpose signup-consent-minor${e?.consent ? " signup-consent-error" : ""}`}
            className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded accent-(--auth-wine) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--auth-wine)"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener" className={authLink}>
              Terms of Service<span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            and have read the{" "}
            <a href="/privacy" target="_blank" rel="noopener" className={authLink}>
              Privacy Policy<span className="sr-only"> (opens in a new tab)</span>
            </a>
            . I am 18 or older, or my parent or guardian agrees on my behalf.
          </span>
        </label>
        {e?.consent && (
          <p id="signup-consent-error" className="text-[13px] font-semibold text-danger">
            {e.consent[0]}
          </p>
        )}
      </div>
      <button type="submit" disabled={pending} className={authButton}>
        {pending && <Spinner />}
        {pending ? "Creating your account…" : paid ? "Create account · Continue to payment →" : "Start 7-day free trial →"}
      </button>
    </form>
  );
}
