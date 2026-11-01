import { ApiError } from './api';

/** Result shape for form Server Actions (used with useActionState). */
export type FormState =
  | { ok?: boolean; message?: string; errors?: Record<string, string[]>; values?: Record<string, string> }
  | undefined;

/**
 * Error state for a failed submit. Pass the FormData so the form can refill its
 * fields: React resets uncontrolled inputs after an action runs.
 */
export function failure(e: unknown, fallback = 'Something went wrong. Try again.', form?: FormData): FormState {
  const values = form
    ? Object.fromEntries([...form.entries()].filter(([k, v]) => typeof v === 'string' && !k.startsWith('$')) as [string, string][])
    : undefined;
  if (e instanceof ApiError) return { ok: false, message: e.message, errors: e.errors, values };
  return { ok: false, message: fallback, values };
}

/**
 * Rebuild a submitted form for the API: the listed text fields, plus the file
 * field only when a file was actually chosen (an empty input still sends an
 * empty File). Framework fields (`$ACTION…`) are dropped.
 */
export function forwardForm(form: FormData, fields: string[], fileField?: string): FormData {
  const out = new FormData();
  for (const name of fields) {
    const v = form.get(name);
    if (typeof v === 'string') out.set(name, v);
  }
  if (fileField) {
    const f = form.get(fileField);
    if (f instanceof File && f.size > 0 && f.name) out.set(fileField, f, f.name);
  }
  return out;
}
