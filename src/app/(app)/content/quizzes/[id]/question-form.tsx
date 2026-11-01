"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { addQuestion } from "@/lib/content-actions";

const KEYS = ["A", "B", "C", "D"];

export function QuestionForm({ quizId }: { quizId: number }) {
  const [state, action, pending] = useActionState(addQuestion.bind(null, quizId), undefined);
  const e = state?.errors ?? {};
  const v = state?.ok === false ? (state.values ?? {}) : {};
  const [type, setType] = useState(v.type ?? "mcq");
  const optionError = Object.entries(e).find(([k]) => k.startsWith("options"))?.[1];
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(state ?? null)}>
      <Field label="Question" error={e.body}><textarea name="body" rows={2} required defaultValue={v.body} className={inputClass} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type" error={e.type}>
          <select name="type" value={type} onChange={(ev) => setType(ev.target.value)} className={inputClass}>
            <option value="mcq">Multiple choice</option>
            <option value="tf">True / false</option>
            <option value="short">Short answer</option>
          </select>
        </Field>
        <Field label="Marks" error={e.marks}>
          <input name="marks" type="number" required min={1} max={50} defaultValue={v.marks ?? "1"} className={inputClass} />
        </Field>
      </div>
      {type !== "short" && (
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium text-ink-2">Options</legend>
          {(type === "tf" ? ["True", "False"] : ["", "", "", ""]).map((d, i) => (
            <label key={`${type}-${i}`} className="flex items-center gap-2 text-sm">
              <span className="w-5 text-ink-3">{KEYS[i]}</span>
              <input name="options[]" maxLength={240} defaultValue={d} className={inputClass} />
            </label>
          ))}
          {optionError?.[0] && <p className="text-xs text-danger">{optionError[0]}</p>}
        </fieldset>
      )}
      <Field label="Correct answer" error={e.correct_answer} hint={type === "short" ? "The expected answer" : "Option letters, comma-separated (e.g. A or A, C)"}>
        <input name="correct_answer" required defaultValue={v.correct_answer} className={inputClass} />
      </Field>
      <Field label="Explanation" error={e.explanation}><textarea name="explanation" rows={2} defaultValue={v.explanation} className={inputClass} /></Field>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add question"}</button>
    </form>
  );
}
