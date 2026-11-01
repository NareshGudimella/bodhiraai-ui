"use client";

import { useActionState } from "react";
import { FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { gradeSubmission } from "@/lib/teacher-actions";

export function GradeForm({
  submissionId,
  maxMarks,
  score,
  feedback,
}: {
  submissionId: number;
  maxMarks: number;
  score: number | null;
  feedback: string | null;
}) {
  const [state, action, pending] = useActionState(gradeSubmission.bind(null, submissionId), undefined);
  return (
    <form action={action} className="flex flex-wrap items-start gap-2">
      <label className="w-28 text-xs">
        <span className="sr-only">Score out of {maxMarks}</span>
        {/* The max is a UI-only cap: legacy's grade form had it as an HTML attribute and its server accepted any integer >= 0. */}
        <input name="score" type="number" min={0} max={maxMarks} step={1} defaultValue={state?.values?.score ?? score ?? ""}
          key={`s-${state?.values?.score}`} placeholder={`/ ${maxMarks}`} required className={inputClass} />
      </label>
      <label className="min-w-48 flex-1 text-xs">
        <span className="sr-only">Feedback</span>
        <input name="feedback" defaultValue={state?.values?.feedback ?? feedback ?? ""}
          key={`f-${state?.values?.feedback}`} placeholder="Feedback (optional)" className={inputClass} />
      </label>
      <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save grade"}</button>
      <div className="w-full empty:hidden">
        {state?.errors?.score?.[0] ? <p className="text-xs text-danger">{state.errors.score[0]}</p> : <FormMessage state={state} />}
      </div>
    </form>
  );
}
