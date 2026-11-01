"use client";

import { useActionState, useState } from "react";
import { ConfirmButton } from "@/components/confirm-button";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Pill, buttonClass, secondaryButtonClass } from "@/components/ui";
import { deleteSection, reorderSections, saveSection, toggleSection } from "@/lib/cms-actions";
import type { Section } from "@/lib/cms-api";

type Item = Section & { media_src: string | null };
const small = "rounded-lg border border-line px-2 py-1 text-xs hover:bg-primary-light disabled:opacity-40";

/** The section builder: add, edit, show/hide, move and remove blocks. */
export function SectionList({ pageSlug, sections, types }: { pageSlug: string; sections: Item[]; types: Record<string, string> }) {
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const ids = sections.map((s) => s.id);
  const move = (i: number, by: number) => {
    const next = [...ids];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    return reorderSections.bind(null, pageSlug, next);
  };
  return (
    <div className="space-y-2">
      {sections.map((s, i) => (
        <div key={s.id} className="rounded-2xl bg-card p-4 ring-1 ring-line">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">{s.heading || types[s.type] || s.type}</span>
              <span className="text-xs text-ink-3">{types[s.type] ?? s.type}{s.key ? ` · ${s.key}` : ""}</span>
            </span>
            <span className="flex flex-wrap items-center gap-1.5">
              {!s.is_active && <Pill>hidden</Pill>}
              <form action={move(i, -1)}><button className={small} disabled={i === 0} aria-label={`Move ${s.heading || types[s.type] || s.type} up`}>↑</button></form>
              <form action={move(i, 1)}><button className={small} disabled={i === sections.length - 1} aria-label={`Move ${s.heading || types[s.type] || s.type} down`}>↓</button></form>
              <button type="button" className={small} onClick={() => setEditing(editing === s.id ? null : s.id)}>Edit</button>
              <form action={toggleSection.bind(null, s.id)}><button className={small}>{s.is_active ? "Hide" : "Show"}</button></form>
              <ConfirmButton action={deleteSection.bind(null, s.id)} message="Remove this section?" className={`${small} text-danger`}>Remove</ConfirmButton>
            </span>
          </div>
          {editing === s.id && <SectionForm pageSlug={pageSlug} section={s} types={types} onDone={() => setEditing(null)} />}
        </div>
      ))}
      {editing === "new" ? (
        <div className="rounded-2xl bg-card p-4 ring-1 ring-primary">
          <SectionForm pageSlug={pageSlug} section={null} types={types} onDone={() => setEditing(null)} />
        </div>
      ) : (
        <button type="button" className={secondaryButtonClass} onClick={() => setEditing("new")}>+ Add section</button>
      )}
    </div>
  );
}

function SectionForm({ pageSlug, section, types, onDone }: { pageSlug: string; section: Item | null; types: Record<string, string>; onDone: () => void }) {
  const [state, action, pending] = useActionState(
    async (prev: Parameters<typeof saveSection>[2], form: FormData) => {
      const result = await saveSection(pageSlug, section?.id ?? null, prev, form);
      if (result?.ok) onDone();
      return result;
    },
    undefined,
  );
  const v = state?.values;
  const e = state?.errors;
  const val = (k: keyof Section) => {
    if (v) return v[k] ?? "";
    const x = section?.[k];
    if (x === null || x === undefined) return "";
    return typeof x === "object" ? JSON.stringify(x, null, 2) : String(x);
  };
  const text = (k: keyof Section, label: string) => (
    <Field label={label} error={e?.[k]}>
      <input key={`${k}${v?.[k] ?? ""}`} name={k} defaultValue={val(k)} className={inputClass} />
    </Field>
  );
  return (
    <form action={action} className="mt-4 grid gap-3 [&>*]:min-w-0 sm:grid-cols-2">
      <Field label="Type" error={e?.type}>
        <select key={`t${v?.type ?? ""}`} name="type" defaultValue={val("type") || "hero"} className={inputClass}>
          {Object.entries(types).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select>
      </Field>
      {text("key", "Key")}
      {text("eyebrow", "Eyebrow")}
      {text("heading", "Heading")}
      <div className="sm:col-span-2">{text("subheading", "Subheading")}</div>
      <div className="sm:col-span-2">
        <Field label="Body" error={e?.body}>
          <textarea key={`b${v?.body ?? ""}`} name="body" defaultValue={val("body")} rows={4} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Image" error={e?.media_url ?? e?.media_file}>
          <span className="flex flex-wrap items-center gap-3">
            {section?.media_src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={section.media_src} alt="" className="size-14 rounded-lg object-cover ring-1 ring-line" />
            )}
            <input name="media_url" defaultValue={val("media_url")} placeholder="Image URL (blank keeps the current one)" className={`${inputClass} min-w-0 flex-1`} />
            <input name="media_file" type="file" accept="image/*" className="w-full text-sm" />
          </span>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Data (JSON)" error={e?.data} hint="Block-specific items, e.g. stats or CTA links. Invalid JSON is dropped.">
          <textarea key={`d${v?.data ?? ""}`} name="data" defaultValue={val("data")} rows={4} className={`${inputClass} font-mono text-xs`} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-2">
        <input type="hidden" name="is_active" value="0" />
        <input type="checkbox" name="is_active" value="1" defaultChecked={section ? section.is_active : true} /> Visible
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : section ? "Save section" : "Add section"}</button>
        <button type="button" onClick={onDone} className={secondaryButtonClass}>Cancel</button>
      </div>
    </form>
  );
}
