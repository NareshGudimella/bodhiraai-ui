"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { saveSettings } from "@/lib/cms-actions";
import type { SettingField } from "@/lib/cms-api";

/** One settings group (legacy SettingsController::update). Image fields: a URL or an upload. */
export function SettingsForm({
  group,
  fields,
  values,
  previews,
}: {
  group: string;
  fields: SettingField[];
  values: Record<string, unknown>;
  previews: Record<string, string | null>;
}) {
  const keys = fields.map((f) => f.key);
  const images = fields.filter((f) => f.type === "image").map((f) => f.key);
  const [state, action, pending] = useActionState(saveSettings.bind(null, group, keys, images), undefined);
  const v = state?.values;
  const e = state?.errors;
  const val = (k: string) => (v ? (v[k] ?? "") : values[k] === null || values[k] === undefined ? "" : String(values[k]));
  return (
    <form action={action} className="grid gap-4 [&>*]:min-w-0 sm:grid-cols-2">
      {fields.map((f) => {
        const key = `${f.key}${v?.[f.key] ?? ""}`;
        if (f.type === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2 text-sm text-ink-2">
              <input type="hidden" name={f.key} value="0" />
              <input type="checkbox" name={f.key} value="1" defaultChecked={v ? v[f.key] === "1" : Boolean(values[f.key])} /> {f.label}
            </label>
          );
        }
        const wide = ["textarea", "code", "image"].includes(f.type) ? "sm:col-span-2" : "";
        return (
          <div key={key} className={wide}>
            <Field label={f.label} error={e?.[f.key] ?? e?.[`${f.key}_file`]}>
              {f.type === "textarea" || f.type === "code" ? (
                <textarea name={f.key} defaultValue={val(f.key)} rows={f.type === "code" ? 4 : 3} className={`${inputClass} ${f.type === "code" ? "font-mono text-xs" : ""}`} />
              ) : f.type === "image" ? (
                <span className="flex flex-wrap items-center gap-3">
                  {previews[f.key] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previews[f.key]!} alt="" className="h-12 max-w-32 rounded object-contain ring-1 ring-line" />
                  )}
                  <input name={f.key} defaultValue={val(f.key)} placeholder="Image URL" className={`${inputClass} min-w-0 flex-1`} />
                  <input name={`${f.key}_file`} type="file" accept="image/*" className="w-full text-sm" />
                </span>
              ) : (
                <input name={f.key} type={f.type === "number" ? "number" : "text"} defaultValue={val(f.key)} placeholder={f.type === "color" ? "#C49560" : undefined} className={inputClass} />
              )}
            </Field>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save settings"}</button>
      </div>
    </form>
  );
}
