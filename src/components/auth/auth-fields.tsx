"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { authInput } from "./auth-styles";

/** Props AuthField hands to its control: the id its label points at, plus the error/hint wiring. */
export type ControlProps = { id: string; "aria-describedby"?: string; "aria-invalid"?: true };

/**
 * Labelled field for the sign-in pages: the label points at the control, the
 * first Laravel error (or the hint) sits under it and is linked with
 * aria-describedby, and the control gets aria-invalid while there is an error.
 * `aside` goes at the end of the label row (e.g. "Forgot password?").
 * not in legacy
 */
export function AuthField({
  label,
  error,
  hint,
  aside,
  children,
}: {
  label: string;
  error?: string[] | string;
  hint?: string;
  aside?: ReactNode;
  children: (control: ControlProps) => ReactNode;
}) {
  const id = useId();
  const message = Array.isArray(error) ? error[0] : error;
  const showHint = !!hint && !message;
  const describedBy = message ? `${id}-error` : showHint ? `${id}-hint` : undefined;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {aside}
      </div>
      {children({ id, "aria-describedby": describedBy, ...(message && { "aria-invalid": true as const }) })}
      {showHint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-ink-3">
          {hint}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[13px] font-semibold text-danger">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-px size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {message}
        </p>
      )}
    </div>
  );
}

/** Password input with a show/hide toggle (the input stays a plain, uncontrolled `<input>`). not in legacy */
export function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type"> & { id: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={shown ? "text" : "password"} className={`${authInput} pr-13 ${className ?? ""}`} />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
        aria-controls={props.id}
        className="absolute inset-y-1 right-1 grid w-11 cursor-pointer place-items-center rounded-lg text-ink-3 transition hover:bg-[rgba(42,14,19,.05)] hover:text-(--auth-maroon) focus-visible:outline-2 focus-visible:outline-(color:--auth-wine)"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          {shown ? (
            <>
              <path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c7 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 7 10 7a9.7 9.7 0 0 0 5.39-1.61" />
              <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
              <path d="m2 2 20 20" />
            </>
          ) : (
            <>
              <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.1 7.36 5 12 5s8.58 3.1 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.9 16.64 19 12 19s-8.58-3.1-9.94-6.65" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

/** Status (green) or error (red) message box. not in legacy */
export function AuthAlert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const ok = tone === "success";
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium leading-relaxed ${
        ok ? "border-[rgba(15,122,79,.25)] bg-[#e8f6ef] text-success" : "border-[rgba(180,35,24,.25)] bg-danger-light text-danger"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        {ok ? <path d="m8 12 3 3 5-6" /> : <path d="M12 8v4M12 16h.01" />}
      </svg>
      <span>{children}</span>
    </p>
  );
}

/** Spinner for a pending submit button. */
export function Spinner() {
  return <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />;
}
