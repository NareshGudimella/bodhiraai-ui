"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { saveMenuItem } from "@/lib/cms-actions";

/** The legacy "add item" form: label, URL, icon, target, parent, visible. */
export function ItemForm({ menuKey, parents }: { menuKey: string; parents: { id: number; label: string }[] }) {
  const [state, action, pending] = useActionState(saveMenuItem.bind(null, menuKey, null), undefined);
  const v = state?.ok ? undefined : state?.values;
  const e = state?.errors;
  return (
    <form action={action} className="space-y-3">
      <Field label="Label" error={e?.label}><input key={`l${v?.label}`} name="label" defaultValue={v?.label} required className={inputClass} /></Field>
      <Field label="URL" error={e?.url}><input key={`u${v?.url}`} name="url" defaultValue={v?.url} placeholder="/about or https://…" required className={inputClass} /></Field>
      <Field label="Icon (optional)" error={e?.icon}><input key={`i${v?.icon}`} name="icon" defaultValue={v?.icon} placeholder="fa-house" className={inputClass} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Open in" error={e?.target}>
          <select key={`t${v?.target}`} name="target" defaultValue={v?.target ?? "_self"} className={inputClass}>
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
        </Field>
        <Field label="Parent" error={e?.parent_id}>
          <select key={`p${v?.parent_id}`} name="parent_id" defaultValue={v?.parent_id ?? ""} className={inputClass}>
            <option value="">— Top level —</option>
            {parents.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-2">
        <input type="hidden" name="is_active" value="0" />
        <input type="checkbox" name="is_active" value="1" defaultChecked /> Visible
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add item"}</button>
    </form>
  );
}
