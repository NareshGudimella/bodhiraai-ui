"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { submitAssignment } from "@/lib/student-actions";

const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip";

export function SubmitForm({
  assignmentId,
  hasSubmission,
  initialNote = "",
}: {
  assignmentId: number;
  hasSubmission: boolean;
  /** The earlier note, pre-filled on resubmit (legacy assignment.blade.php:220). */
  initialNote?: string;
}) {
  const [state, action, pending] = useActionState(submitAssignment.bind(null, assignmentId), undefined);
  const e = state?.errors ?? {};
  return (
    <form action={action} className="space-y-3">
      <Field label="Note for your teacher (optional)" error={e.note}>
        <textarea
          name="note"
          rows={3}
          maxLength={2000}
          defaultValue={state && !state.ok && state.values ? state.values.note : initialNote}
          key={`n-${state?.values?.note}-${state?.ok}-${initialNote}`}
          className={inputClass}
        />
      </Field>
      <Field label="File (optional)" error={e.file} hint="PDF, Word, Excel, PowerPoint, text or ZIP, up to 50 MB.">
        <input name="file" type="file" accept={ACCEPT} className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-light file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand" />
      </Field>
      {hasSubmission && <p className="text-xs text-ink-3">Resubmitting replaces your note; a new file replaces the old one (leave the file empty to keep it).</p>}
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Uploading…" : "Submit"}</button>
    </form>
  );
}
