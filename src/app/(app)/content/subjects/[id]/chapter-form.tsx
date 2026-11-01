"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, SectionTitle, buttonClass } from "@/components/ui";
import { createChapter } from "@/lib/content-actions";

export function ChapterForm({ subjectId }: { subjectId: number }) {
  const [state, action, pending] = useActionState(createChapter.bind(null, subjectId), undefined);
  const e = state?.errors ?? {};
  const v = state?.ok === false ? (state.values ?? {}) : {};
  return (
    <Card>
      <SectionTitle>New chapter</SectionTitle>
      <form action={action} className="space-y-3" key={JSON.stringify(state ?? null)}>
        <Field label="Title" error={e.title}><input name="title" required maxLength={160} defaultValue={v.title} className={inputClass} /></Field>
        <Field label="Description" error={e.description}>
          <textarea name="description" rows={2} defaultValue={v.description} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Position" error={e.sort_order} hint="Blank: add at the end">
            <input name="sort_order" type="number" min={0} max={999} defaultValue={v.sort_order} className={inputClass} />
          </Field>
          <Field label="Status" error={e.is_published}>
            <select name="is_published" defaultValue={v.is_published ?? "1"} className={inputClass}>
              <option value="1">Published</option>
              <option value="0">Draft</option>
            </select>
          </Field>
        </div>
        <FormMessage state={state} />
        <button disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add chapter"}</button>
      </form>
    </Card>
  );
}
