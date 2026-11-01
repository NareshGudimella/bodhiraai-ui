"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, buttonClass } from "@/components/ui";
import { scheduleLiveClass } from "@/lib/teacher-actions";

export function LiveForm({
  classes,
  subjects,
  syllabi,
}: {
  classes: { id: number; label: string; students_count: number }[];
  subjects: { id: number; name: string; class_id: number }[];
  syllabi: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState(scheduleLiveClass, undefined);
  const [scope, setScope] = useState<"class" | "syllabus" | "school">("class");
  const [provider, setProvider] = useState<"jitsi" | "external">("jitsi");
  const [classId, setClassId] = useState<string>(String(classes[0]?.id ?? ""));
  const e = state?.errors ?? {};
  const v = state?.values ?? {};
  // Optional subject (not in legacy's form; legacy validates `subject_id` as nullable|exists):
  // the picked class's subjects, or all of the teacher's distinct subjects for other audiences.
  const subjectOptions = [
    ...new Map(
      subjects
        .filter((s) => scope !== "class" || !classId || String(s.class_id) === classId)
        .map((s) => [s.id, s.name] as const),
    ),
  ];

  return (
    <Card className="max-w-2xl">
      <form action={action} className="space-y-4">
        <Field label="Title" error={e.title}>
          <input name="title" required maxLength={200} defaultValue={v.title} key={`t-${v.title}`} className={inputClass} />
        </Field>
        <Field label="Description (optional)" error={e.description}>
          <textarea name="description" rows={3} maxLength={1000} defaultValue={v.description} key={`d-${v.description}`} className={inputClass} />
        </Field>
        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink-2">Audience</legend>
          <div className="flex flex-wrap gap-2">
            {(["class", "syllabus", "school"] as const).map((s) => (
              <label key={s} className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm has-checked:border-brand has-checked:bg-brand has-checked:text-primary-light">
                <input type="radio" name="scope_type" value={s} checked={scope === s} onChange={() => setScope(s)} className="sr-only" />
                {s === "class" ? "A class" : s === "syllabus" ? "A syllabus (B2C)" : "Whole school"}
              </label>
            ))}
          </div>
        </fieldset>
        {scope === "class" && (
          <Field label="Class" error={e.class_id}>
            <select name="class_id" defaultValue={v.class_id} key={`c-${v.class_id}`} onChange={(ev) => setClassId(ev.target.value)} className={inputClass}>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.label} · {c.students_count} students</option>)}
            </select>
          </Field>
        )}
        {scope === "syllabus" && (
          <Field label="Syllabus" error={e.syllabus_id}>
            <select name="syllabus_id" defaultValue={v.syllabus_id} key={`s-${v.syllabus_id}`} className={inputClass}>
              {syllabi.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
        )}
        {/* not in legacy: legacy's form never offered the optional subject_id */}
        <Field label="Subject (optional)" error={e.subject_id}>
          <select name="subject_id" defaultValue={v.subject_id ?? ""} key={`sub-${v.subject_id}-${scope}-${classId}`} className={inputClass}>
            <option value="">No subject</option>
            {subjectOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Starts at" error={e.scheduled_at} hint="Shown to students exactly as entered.">
            <input name="scheduled_at" type="datetime-local" required defaultValue={v.scheduled_at} key={`at-${v.scheduled_at}`} className={inputClass} />
          </Field>
          <Field label="Duration (minutes)" error={e.duration_min}>
            <input name="duration_min" type="number" min={5} max={480} defaultValue={v.duration_min ?? 45} key={`dm-${v.duration_min}`} required className={inputClass} />
          </Field>
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink-2">Meeting</legend>
          <div className="flex flex-wrap gap-2">
            {(["jitsi", "external"] as const).map((p) => (
              <label key={p} className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm has-checked:border-brand has-checked:bg-brand has-checked:text-primary-light">
                <input type="radio" name="provider" value={p} checked={provider === p} onChange={() => setProvider(p)} className="sr-only" />
                {p === "jitsi" ? "Create a Jitsi room" : "Use my own link"}
              </label>
            ))}
          </div>
        </fieldset>
        {provider === "external" && (
          <Field label="Meeting link" error={e.meeting_url}>
            <input name="meeting_url" type="url" placeholder="https://" required defaultValue={v.meeting_url} key={`u-${v.meeting_url}`} className={inputClass} />
          </Field>
        )}
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Scheduling…" : "Schedule"}</button>
        <p className="text-xs text-ink-3">Students in the audience get a notification.</p>
      </form>
    </Card>
  );
}
