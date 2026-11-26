import { Children, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";

type ControlProps = { "aria-describedby"?: string; "aria-invalid"?: boolean | "true" | "false"; children?: ReactNode };
const CONTROLS = new Set(["input", "select", "textarea"]);

/**
 * Gives the field's controls (plain `<input>`, `<select>`, `<textarea>`, also
 * when nested in plain elements) `aria-describedby` → the error or hint, and
 * `aria-invalid` while there is an error. Controls inside custom components
 * are left alone.
 */
function linkControls(node: ReactNode, describedBy: string | undefined, invalid: boolean): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child) || typeof child.type !== "string") return child;
    const el = child as ReactElement<ControlProps>;
    if (CONTROLS.has(el.type as string)) {
      if (!describedBy && !invalid) return el;
      return cloneElement(el, {
        "aria-describedby": [el.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
        ...(invalid && { "aria-invalid": true }),
      });
    }
    if (el.props.children === undefined) return el;
    return cloneElement(el, undefined, linkControls(el.props.children, describedBy, invalid));
  });
}

/**
 * Labelled form field with a Laravel-style error (first message for the
 * field). The error (or hint) is linked to the control with
 * aria-describedby, and the control is marked aria-invalid. not in legacy
 */
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
  const id = useId();
  const message = error?.[0];
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const showHint = !!hint && !error;
  const describedBy = message ? errorId : showHint ? hintId : undefined;
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {linkControls(children, describedBy, !!message)}
      {showHint && (
        <span id={hintId} className="mt-1.5 block text-xs text-ink-3">
          {hint}
        </span>
      )}
      {message && (
        <span id={errorId} className="mt-1.5 block text-xs font-medium text-danger">
          {message}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-line bg-card px-3 py-2 text-ink shadow-xs outline-none transition placeholder:text-ink-3 hover:border-ink-3/60 focus:border-primary-dark focus:ring-2 focus:ring-primary/40 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/25";

export function FormMessage({ state }: { state?: { ok?: boolean; message?: string } }) {
  if (!state?.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-lg px-3 py-2 text-sm font-medium ring-1 ring-inset ${state.ok ? "bg-success/10 text-success ring-success/25" : "bg-danger-light text-danger ring-danger/25"}`}
    >
      {state.message}
    </p>
  );
}

/**
 * Titled form block: header (title + help text, optional status on the right),
 * body, and an optional footer row for the actions. Pass the whole `<form>`
 * as children, or use `footer` when the form wraps the section.
 */
export function FormSection({
  title,
  description,
  aside,
  footer,
  children,
}: {
  title: string;
  description?: string;
  aside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-card bg-card shadow-card ring-1 ring-line">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-ink-2">{description}</p>}
        </div>
        {aside}
      </header>
      <div className="px-5 py-5">{children}</div>
      {footer && <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-page/50 px-5 py-3">{footer}</footer>}
    </section>
  );
}
