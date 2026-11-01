"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, buttonClass } from "@/components/ui";
import { createAssignment } from "@/lib/teacher-actions";

export function AssignmentForm({
  classes,
  classId,
  subjects,
}: {
  classes: { id: number; label: string }[];
  classId?: string;
  subjects: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createAssignment, undefined);
  const e = state?.errors ?? {};
  const v = state?.values ?? {};

  return (
    <Card className="max-w-2xl">
      <form action={action} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Class" error={e.class_id}>
            <select
              name="class_id"
              defaultValue={classId}
              onChange={(ev) => router.replace(`?class=${ev.target.value}`)}
              className={inputClass}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Subject (optional)" error={e.subject_id}>
            <select name="subject_id" defaultValue={v.subject_id ?? ""} key={`s-${v.subject_id}`} className={inputClass}>
              <option value="">—</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Title" error={e.title}>
          <input name="title" required maxLength={160} defaultValue={v.title} key={`t-${v.title}`} className={inputClass} />
        </Field>
        <Field label="Instructions" error={e.description}>
          <textarea name="description" rows={4} defaultValue={v.description} key={`d-${v.description}`} className={inputClass} />
        </Field>
        <Field label="Attachment file (optional)" error={e.attachment} hint="A worksheet or document, up to 50 MB.">
          <input
            name="attachment"
            type="file"
            className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-light file:px-3 file:py-1.5 file:text-sm file:text-brand"
          />
        </Field>
        <Field label="Or an attachment link (optional)" error={e.attachment_url} hint="A URL to a worksheet or document. An uploaded file takes priority.">
          <input name="attachment_url" type="url" placeholder="https://" defaultValue={v.attachment_url} key={`u-${v.attachment_url}`} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Due" error={e.due_date}>
            <input name="due_date" type="datetime-local" defaultValue={v.due_date} key={`due-${v.due_date}`} className={inputClass} />
          </Field>
          <Field label="Max marks" error={e.max_marks}>
            <input name="max_marks" type="number" min={1} max={1000} defaultValue={v.max_marks ?? 100} key={`m-${v.max_marks}`} required className={inputClass} />
          </Field>
        </div>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Publishing…" : "Publish to class"}
        </button>
        <p className="text-xs text-ink-3">Students in the class are notified when you publish.</p>
      </form>
    </Card>
  );
}
