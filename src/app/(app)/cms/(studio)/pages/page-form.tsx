"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { savePage } from "@/lib/cms-actions";
import type { CmsPage } from "@/lib/cms-api";
import type { InputHTMLAttributes } from "react";
import { L, N, SLUG_PATTERN, numberProps } from "@/lib/input-limits";
import { CountedTextarea } from "@/components/counted-textarea";

/** Legacy `cms.pages.form`: page settings and SEO. */
export function PageForm({ page }: { page: CmsPage | null }) {
  const [state, action, pending] = useActionState(savePage.bind(null, page?.slug ?? null), undefined);
  const v = state?.values;
  const e = state?.errors;
  const val = (k: keyof CmsPage) => {
    if (v) return v[k] ?? "";
    const x = page?.[k];
    if (x === null || x === undefined) return "";
    return typeof x === "object" ? JSON.stringify(x, null, 2) : String(x);
  };
  const text = (k: keyof CmsPage, label: string, hint?: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <Field label={label} error={e?.[k]} hint={hint}>
      <input key={`${k}${v?.[k] ?? ""}`} name={k} defaultValue={val(k)} {...props} className={inputClass} />
    </Field>
  );
  return (
    <form action={action} className="grid gap-4 [&>*]:min-w-0 sm:grid-cols-2">
      {text("name", "Name", undefined, { required: true, maxLength: 160 })}
      {text("slug", "Slug", "Lowercase letters, numbers and dashes. Blank: from the name.", { maxLength: 120, pattern: SLUG_PATTERN, title: "Lowercase letters, numbers and dashes" })}
      {text("template", "Template", undefined, { maxLength: 40 })}
      <Field label="Status" error={e?.status}>
        <select key={`st${v?.status ?? ""}`} name="status" defaultValue={val("status") || "draft"} className={inputClass}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </Field>
      {text("meta_title", "Meta title", undefined, { maxLength: 180 })}
      {text("og_image", "OG image URL", undefined, { maxLength: L.urlShort })}
      <div className="sm:col-span-2">
        <Field label="Meta description" error={e?.meta_description}>
          <CountedTextarea key={`md${v?.meta_description ?? ""}`} name="meta_description" maxLength={320} defaultValue={val("meta_description")} rows={2} className={inputClass} />
        </Field>
      </div>
      {text("meta_keywords", "Meta keywords", undefined, { maxLength: 320 })}
      {text("sort_order", "Sort order", undefined, numberProps(N.sortOrder))}
      <div className="sm:col-span-2">
        <Field label="Schema (JSON-LD)" error={e?.schema} hint="Invalid JSON is dropped.">
          <CountedTextarea key={`sc${v?.schema ?? ""}`} name="schema" maxLength={20000} defaultValue={val("schema")} rows={4} className={`${inputClass} font-mono text-xs`} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-2">
        <input type="hidden" name="noindex" value="0" />
        <input type="checkbox" name="noindex" value="1" defaultChecked={v ? v.noindex === "1" : page?.noindex} /> Hide from search engines (noindex)
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : page ? "Save settings" : "Create page"}</button>
      </div>
    </form>
  );
}
