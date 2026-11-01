"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { addSyllabusChapter, addSyllabusSubject } from "@/lib/super-actions";

export function SubjectForm({ syllabusId }: { syllabusId: number }) {
  const [state, action, pending] = useActionState(addSyllabusSubject.bind(null, syllabusId), undefined);
  const e = state?.errors ?? {};
  const v = state?.ok === false ? (state.values ?? {}) : {};
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(state ?? null)}>
      <Field label="Name" error={e.name}><input name="name" required maxLength={120} defaultValue={v.name} className={inputClass} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Icon" error={e.icon}><input name="icon" maxLength={8} defaultValue={v.icon ?? "📘"} className={inputClass} /></Field>
        <Field label="Colour" error={e.color}><input name="color" maxLength={20} defaultValue={v.color ?? "#C49560"} className={inputClass} /></Field>
      </div>
      <Field label="Description" error={e.description}><textarea name="description" rows={2} defaultValue={v.description} className={inputClass} /></Field>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add subject"}</button>
    </form>
  );
}

export function SyllabusChapterForm({ syllabusId, subjectId }: { syllabusId: number; subjectId: number }) {
  const [state, action, pending] = useActionState(addSyllabusChapter.bind(null, syllabusId, subjectId), undefined);
  const e = state?.errors ?? {};
  const v = state?.ok === false ? (state.values ?? {}) : {};
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(state ?? null)}>
      <Field label="Title" error={e.title}><input name="title" required maxLength={160} defaultValue={v.title} className={inputClass} /></Field>
      <Field label="Description" error={e.description}><textarea name="description" rows={2} defaultValue={v.description} className={inputClass} /></Field>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add chapter"}</button>
    </form>
  );
}
