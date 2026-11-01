"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, SectionTitle, buttonClass } from "@/components/ui";
import { createClass } from "@/lib/admin-actions";

/** `defaultYear`: legacy class-form default, e.g. 2026-27 (computed on the server). */
export function CreateClassForm({ teachers, defaultYear }: { teachers: { id: number; name: string }[]; defaultYear: string }) {
  const [state, action, pending] = useActionState(createClass, undefined);
  const e = state?.errors ?? {};
  const v = state?.values ?? {};
  return (
    <Card>
      <SectionTitle>New class</SectionTitle>
      <form action={action} className="space-y-3" key={JSON.stringify(v)}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Grade" error={e.grade}><input name="grade" required maxLength={10} defaultValue={v.grade} className={inputClass} /></Field>
          <Field label="Section" error={e.section}><input name="section" required maxLength={10} defaultValue={v.section} className={inputClass} /></Field>
        </div>
        <Field label="Academic year" error={e.academic_year} hint="e.g. 2026-27">
          <input name="academic_year" maxLength={9} defaultValue={v.academic_year ?? defaultYear} className={inputClass} />
        </Field>
        <Field label="Class teacher" error={e.class_teacher_id}>
          <select name="class_teacher_id" defaultValue={v.class_teacher_id ?? ""} className={inputClass}>
            <option value="">— Unassigned —</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Creating…" : "Create class"}</button>
      </form>
    </Card>
  );
}
