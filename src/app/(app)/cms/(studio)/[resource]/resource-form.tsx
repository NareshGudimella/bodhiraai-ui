"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass, secondaryButtonClass } from "@/components/ui";
import { saveResource } from "@/lib/cms-actions";
import type { ResourceField, Row } from "@/lib/cms-api";

/** Legacy `cms.resource.form`: one input per schema field, by type. */
export function ResourceForm({
  slug,
  fields,
  row,
  imageUrls,
}: {
  slug: string;
  fields: ResourceField[];
  row: Row | null;
  /** Displayable URLs for the row's image fields. */
  imageUrls: Record<string, string | null>;
}) {
  const names = fields.map((f) => f.name);
  const images = fields.filter((f) => f.type === "image").map((f) => f.name);
  const [state, action, pending] = useActionState(saveResource.bind(null, slug, row?.id ?? null, names, images), undefined);
  const v = state?.values;
  const e = state?.errors;
  const initial = (f: ResourceField) => {
    if (v) return v[f.name] ?? "";
    const x = row?.[f.name];
    return x === null || x === undefined ? "" : String(x);
  };
  return (
    <form action={action} className="grid gap-4 [&>*]:min-w-0 sm:grid-cols-2">
      {fields.map((f) => {
        const key = `${f.name}-${v?.[f.name] ?? ""}`;
        const wide = ["textarea", "richtext", "image"].includes(f.type) ? "sm:col-span-2" : "";
        if (f.type === "boolean") {
          const checked = v ? v[f.name] === "1" : row ? Boolean(row[f.name]) : f.name === "is_active";
          return (
            <label key={key} className="flex items-center gap-2 self-end text-sm text-ink-2">
              <input type="hidden" name={f.name} value="0" />
              <input type="checkbox" name={f.name} value="1" defaultChecked={checked} />
              {f.label}
              {e?.[f.name] && <span className="text-xs text-danger">{e[f.name][0]}</span>}
            </label>
          );
        }
        return (
          <div key={key} className={wide}>
            <Field label={f.label} error={e?.[f.name] ?? e?.[`${f.name}_file`]} hint={f.help}>
              {f.type === "textarea" || f.type === "richtext" ? (
                <textarea name={f.name} defaultValue={initial(f)} rows={f.type === "richtext" ? 8 : 3} className={inputClass} />
              ) : f.type === "number" ? (
                <input name={f.name} type="number" defaultValue={initial(f)} className={inputClass} />
              ) : f.type === "color" ? (
                <input name={f.name} defaultValue={initial(f)} placeholder="#C49560" className={inputClass} />
              ) : f.type === "image" ? (
                <span className="flex flex-wrap items-center gap-3">
                  {imageUrls[f.name] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrls[f.name]!} alt="" className="size-14 rounded-lg object-cover ring-1 ring-line" />
                  )}
                  <input name={f.name} defaultValue={initial(f)} placeholder="Image URL (or upload below)" className={`${inputClass} min-w-0 flex-1`} />
                  <input name={`${f.name}_file`} type="file" accept="image/*" className="w-full text-sm" />
                </span>
              ) : (
                <input name={f.name} defaultValue={initial(f)} className={inputClass} />
              )}
            </Field>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save"}</button>
        <Link href={`/cms/${slug}`} className={secondaryButtonClass}>Cancel</Link>
      </div>
    </form>
  );
}
