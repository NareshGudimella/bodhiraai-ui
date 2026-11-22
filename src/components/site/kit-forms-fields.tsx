/**
 * Form building blocks for the redesigned lead-form pages (/contact,
 * /book-demo, /student-registration). not in legacy: presentation only, the
 * fields keep their legacy names, values and `required` attributes.
 * Styles: the kit's `bp-field`/`bp-input`/`bp-select`/`bp-textarea`
 * (site-ui.css) plus `kf-*` in public/assets/css/site-ui-forms.css.
 * Server-safe (no hooks), so the client DemoForm can use them too.
 *
 * Each control gets a visible label, an optional hint and the field's first
 * Laravel validation message, wired with `aria-describedby` and
 * `aria-invalid`. `req` marks a field the API requires: a star and
 * `aria-required` (the native `required` attribute is passed only where the
 * legacy form had it, so server-side validation messages still show).
 */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Icon, type IconName } from "./icons";

export type FieldErrors = Record<string, string[] | undefined>;

type Common = {
  id: string;
  name: string;
  label: ReactNode;
  req?: boolean;
  hint?: ReactNode;
  error?: string;
  icon?: IconName;
  className?: string;
};

/** The field's describedby ids (hint, error) and invalid state. */
function aria({ id, hint, error, req }: Pick<Common, "id" | "hint" | "error" | "req">) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return {
    "aria-describedby": ids || undefined,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-required": req || undefined,
  };
}

function Shell({ id, label, req, hint, error, icon, className, children }: Omit<Common, "name"> & { children: ReactNode }) {
  return (
    <div className={`bp-field kf-field${error ? " bp-field--error" : ""}${icon ? " kf-field--icon" : ""}${className ? ` ${className}` : ""}`}>
      <label className="bp-field__label" htmlFor={id}>
        {label}
        {req && <span className="bp-req" aria-hidden="true">*</span>}
      </label>
      <div className="kf-control">
        {icon && <Icon name={icon} size={18} className="kf-control__icon" />}
        {children}
      </div>
      {hint && <p id={`${id}-hint`} className="bp-field__hint">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="bp-field__error">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

export function KfInput({ id, name, label, req, hint, error, icon, className, ...rest }: Common & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name">) {
  return (
    <Shell id={id} label={label} req={req} hint={hint} error={error} icon={icon} className={className}>
      <input id={id} name={name} className="bp-input" {...aria({ id, hint, error, req })} {...rest} />
    </Shell>
  );
}

export function KfSelect({ id, name, label, req, hint, error, icon, className, placeholder, options, ...rest }: Common & {
  placeholder: string;
  /** [value, label] pairs, or plain strings (value = label). */
  options: (string | [string, string])[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name">) {
  return (
    <Shell id={id} label={label} req={req} hint={hint} error={error} icon={icon} className={className}>
      <select id={id} name={name} className="bp-select" {...aria({ id, hint, error, req })} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const [v, l] = typeof o === "string" ? [o, o] : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </Shell>
  );
}

export function KfTextarea({ id, name, label, req, hint, error, icon, className, ...rest }: Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name">) {
  return (
    <Shell id={id} label={label} req={req} hint={hint} error={error} icon={icon} className={className}>
      <textarea id={id} name={name} className="bp-textarea" {...aria({ id, hint, error, req })} {...rest} />
    </Shell>
  );
}

/** "Fields marked * are required." */
export function KfRequiredNote() {
  return (
    <p className="kf-note">
      Fields marked <span className="bp-req" aria-hidden="true">*</span><span className="bh-sr-only">with an asterisk</span> are required.
    </p>
  );
}

function AlertIcon() {
  return (
    <svg className="bh-icon" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
    </svg>
  );
}

/**
 * The flashed result above a form: the success status (role="status"), or
 * the validation errors (role="alert") as a list whose items jump to their
 * field. `fieldIds` maps an error key to its control's id.
 */
export function KfAlert({ status, errors, fieldIds, intro }: {
  status?: string;
  errors?: FieldErrors;
  fieldIds?: Record<string, string>;
  /** Text above the error list (default: "Please check the highlighted fields and try again."). */
  intro?: string;
}) {
  const list = Object.entries(errors ?? {}).flatMap(([k, msgs]) => (msgs ?? []).map((m, i) => ({ k: `${k}-${i}`, id: fieldIds?.[k], m })));
  if (status) {
    return (
      <div className="bp-alert bp-alert--success kf-alert" role="status" tabIndex={-1} data-kf-focus>
        <Icon name="check" size={22} />
        <p className="kf-alert__msg">{status}</p>
      </div>
    );
  }
  if (list.length === 0) return null;
  return (
    <div className="bp-alert bp-alert--error kf-alert" role="alert" tabIndex={-1} data-kf-focus>
      <AlertIcon />
      <div>
        <strong className="kf-alert__title">{intro ?? "Please check the highlighted fields and try again."}</strong>
        <ul className="kf-alert__list">
          {list.map(({ k, id, m }) => (
            <li key={k}>{id ? <a href={`#${id}`}>{m}</a> : m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** A side card row: icon tile, small label, then the details. */
export function KfInfoItem({ icon, title, children }: { icon: IconName; title: ReactNode; children: ReactNode }) {
  return (
    <li className="kf-info">
      <span className="bp-tile bp-tile--sm"><Icon name={icon} size={20} /></span>
      <div>
        <h3 className="kf-info__title">{title}</h3>
        <div className="kf-info__body">{children}</div>
      </div>
    </li>
  );
}

/** Framed photo for the form pages' side column, with an optional floating chip. */
export function KfPhoto({ src, alt, chip }: { src: string; alt: string; chip?: ReactNode }) {
  return (
    <figure className="kf-photo" data-reveal>
      <img src={src} alt={alt} width={1200} height={900} loading="lazy" decoding="async" />
      {chip}
    </figure>
  );
}
