import type { ReactNode } from "react";

/** Labelled form field with a Laravel-style error (first message for the field). */
export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string[];
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink-2">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
      {error?.[0] && <span className="mt-1 block text-xs text-danger">{error[0]}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function FormMessage({ state }: { state?: { ok?: boolean; message?: string } }) {
  if (!state?.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-lg px-3 py-2 text-sm ${state.ok ? "bg-success/10 text-success" : "bg-danger-light text-danger"}`}
    >
      {state.message}
    </p>
  );
}
