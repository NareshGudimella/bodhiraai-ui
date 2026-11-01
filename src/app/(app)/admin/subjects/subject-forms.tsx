"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, Pill, SectionTitle, buttonClass, secondaryButtonClass } from "@/components/ui";
import { createSubject, deleteSubject, setSubjectActive, updateSubject } from "@/lib/admin-actions";
import type { FormState } from "@/lib/action-result";

type Subject = { id: number; name: string; grade: string | null; icon: string | null; color: string | null; description: string | null; is_active: boolean; chapters_count: number };

/** Legacy new-subject defaults (subjects.blade.php). */
const NEW_SUBJECT: Partial<Subject> = { icon: "📘", color: "#C49560" };

function Fields({ state, initial }: { state: FormState; initial?: Partial<Subject> }) {
  const e = state?.errors ?? {};
  const v = { ...initial, ...(state?.ok === false ? state.values : {}) } as Record<string, string | null | undefined>;
  return (
    <>
      <Field label="Name" error={e.name}><input name="name" required maxLength={120} defaultValue={v.name ?? ""} className={inputClass} /></Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Grade" error={e.grade}><input name="grade" maxLength={10} defaultValue={v.grade ?? ""} className={inputClass} /></Field>
        <Field label="Icon" error={e.icon}><input name="icon" maxLength={8} defaultValue={v.icon ?? ""} placeholder="📘" className={inputClass} /></Field>
        <Field label="Colour" error={e.color}><input name="color" maxLength={20} defaultValue={v.color ?? ""} placeholder="#C49560" className={inputClass} /></Field>
      </div>
      <Field label="Description" error={e.description}>
        <textarea name="description" rows={2} defaultValue={v.description ?? ""} className={inputClass} />
      </Field>
    </>
  );
}

export function CreateSubjectForm() {
  const [state, action, pending] = useActionState(createSubject, undefined);
  return (
    <Card>
      <SectionTitle>New subject</SectionTitle>
      <form action={action} className="space-y-3" key={state?.ok ? `ok-${state.message}` : JSON.stringify(state?.values ?? null)}>
        <Fields state={state} initial={NEW_SUBJECT} />
        <FormMessage state={state} />
        <button disabled={pending} className={buttonClass}>{pending ? "Creating…" : "Create subject"}</button>
      </form>
    </Card>
  );
}

export function SubjectRow({ subject: s }: { subject: Subject }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateSubject.bind(null, s.id), undefined);
  return (
    <li className="border-t border-line px-4 py-3 first:border-t-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-3">
          <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ring-1 ring-line" style={{ background: s.color ? `${s.color}33` : undefined }}>{s.icon ?? "📘"}</span>
          <span className="min-w-0">
            <span className="font-medium text-ink">{s.name}</span>
            {s.grade && <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-ink-2">Grade {s.grade}</span>}
            <span className="block text-xs text-ink-3">{s.grade ? "" : "All grades · "}{s.chapters_count} {s.chapters_count === 1 ? "chapter" : "chapters"}</span>
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <Pill tone={s.is_active ? "success" : "neutral"}>{s.is_active ? "Active" : "Hidden"}</Pill>
          <form action={setSubjectActive.bind(null, s.id, s.name, !s.is_active)}>
            <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">{s.is_active ? "Hide" : "Show"}</button>
          </form>
          <Link href="/admin/syllabi" className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">Manage Syllabus →</Link>
          <button type="button" onClick={() => setEditing((x) => !x)} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">{editing ? "Close" : "Edit"}</button>
          <form action={deleteSubject.bind(null, s.id)} onSubmit={(e) => { if (!confirm(`Delete ${s.name} and all its chapters and lessons?`)) e.preventDefault(); }}>
            <button className="rounded-md border border-danger/40 px-2 py-1 text-xs text-danger hover:bg-danger-light">Delete</button>
          </form>
        </span>
      </div>
      {(editing || state?.ok === false) && (
        <form action={action} className="mt-3 space-y-3" key={JSON.stringify(state ?? null)}>
          <Fields state={state} initial={s} />
          <FormMessage state={state} />
          <div className="flex gap-2">
            <button disabled={pending} className={buttonClass}>Save</button>
            <button type="button" onClick={() => setEditing(false)} className={secondaryButtonClass}>Cancel</button>
          </div>
        </form>
      )}
    </li>
  );
}
