"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { createQuiz, updateQuiz } from "@/lib/content-actions";

type Option = { id: number; name?: string; title?: string; grade?: string | null };
type Values = Partial<Record<"title" | "description" | "subject_id" | "chapter_id" | "duration_min" | "pass_marks" | "is_published", string>>;

/** Create (quiz builder) or edit (quiz page) form. */
export function QuizForm({ quizId, subjects, chapters, initial = {} }: { quizId?: number; subjects: Option[]; chapters?: Option[]; initial?: Values }) {
  const [state, action, pending] = useActionState(quizId ? updateQuiz.bind(null, quizId) : createQuiz, undefined);
  const e = state?.errors ?? {};
  const v: Values = { ...initial, ...(state?.ok === false ? state.values : {}) };
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(state ?? null)}>
      <Field label="Title" error={e.title}><input name="title" required maxLength={160} defaultValue={v.title} className={inputClass} /></Field>
      <Field label="Description" error={e.description}><textarea name="description" rows={2} defaultValue={v.description} className={inputClass} /></Field>
      <Field label="Subject" error={e.subject_id}>
        <select name="subject_id" defaultValue={v.subject_id ?? ""} className={inputClass}>
          <option value="">—</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}{s.grade ? ` (Grade ${s.grade})` : ""}</option>)}
        </select>
      </Field>
      {chapters && (
        <Field label="Chapter" error={e.chapter_id} hint="Chapters of the saved subject">
          <select name="chapter_id" defaultValue={v.chapter_id ?? ""} className={inputClass}>
            <option value="">—</option>
            {chapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Minutes" error={e.duration_min}>
          <input name="duration_min" type="number" required min={1} max={300} defaultValue={v.duration_min ?? "15"} className={inputClass} />
        </Field>
        <Field label="Pass marks" error={e.pass_marks}>
          <input name="pass_marks" type="number" min={0} defaultValue={v.pass_marks ?? "0"} className={inputClass} />
        </Field>
      </div>
      {quizId && (
        <Field label="Status" error={e.is_published}>
          <select name="is_published" defaultValue={v.is_published ?? "0"} className={inputClass}>
            <option value="0">Draft</option>
            <option value="1">Published</option>
          </select>
        </Field>
      )}
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Saving…" : quizId ? "Save quiz" : "Create quiz"}</button>
    </form>
  );
}
