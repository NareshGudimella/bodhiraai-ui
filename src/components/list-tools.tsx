import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";
import { inputClass } from "@/components/form";
import { secondaryButtonClass } from "@/components/ui";

/** GET filter form: submits as search params with a client-side navigation. */
export function FilterBar({ action, children }: { action: string; children: ReactNode }) {
  return (
    <Form action={action} className="mb-4 flex flex-wrap items-end gap-2">
      {children}
      <button className={secondaryButtonClass}>Apply</button>
    </Form>
  );
}

export function FilterInput({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <label className="text-xs text-ink-3">
      <span className="mb-1 block">{label}</span>
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} className={`${inputClass} py-1.5 text-sm`} />
    </label>
  );
}

export function FilterSelect({ name, label, defaultValue, options }: { name: string; label: string; defaultValue?: string; options: [string, string][] }) {
  return (
    <label className="text-xs text-ink-3">
      <span className="mb-1 block">{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} className={`${inputClass} py-1.5 text-sm`}>
        <option value="">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

/** Prev/next links keeping the other search params. */
export function Pagination({ base, params, page, lastPage, total }: { base: string; params: URLSearchParams; page: number; lastPage: number; total: number }) {
  const href = (p: number) => {
    const q = new URLSearchParams(params);
    q.set("page", String(p));
    return `${base}?${q}`;
  };
  return (
    <nav aria-label="Pages" className="mt-4 flex items-center justify-between gap-2 text-sm text-ink-3">
      {page > 1 ? <Link className={secondaryButtonClass} href={href(page - 1)}>← Previous</Link> : <span />}
      <span>Page {page} of {lastPage} · {total} total</span>
      {page < lastPage ? <Link className={secondaryButtonClass} href={href(page + 1)}>Next →</Link> : <span />}
    </nav>
  );
}

/** Search params from a page's searchParams object (first value of each). */
export function toParams(sp: Record<string, string | string[] | undefined>, keys: string[]) {
  const q = new URLSearchParams();
  for (const k of keys) {
    const v = sp[k];
    const s = Array.isArray(v) ? v[0] : v;
    if (s) q.set(k, s);
  }
  return q;
}
