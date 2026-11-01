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
      <span className="mb-1 block font-medium text-ink-2">{label}</span>
      {linkControls(children, describedBy, !!message)}
      {showHint && (
        <span id={hintId} className="mt-1 block text-xs text-ink-3">
          {hint}
        </span>
      )}
      {message && (
        <span id={errorId} className="mt-1 block text-xs text-danger">
          {message}
        </span>
      )}
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
