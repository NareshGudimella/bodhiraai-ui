"use client";

import { useActionState } from "react";
import { FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { enrolStudent, linkSubject } from "@/lib/admin-actions";

const sel = `${inputClass} py-1.5 text-sm`;

export function EnrolForm({ classId, students }: { classId: number; students: { id: number; name: string; grade: string | null }[] }) {
  const [state, action, pending] = useActionState(enrolStudent.bind(null, classId), undefined);
  if (!students.length) return <p className="text-xs text-ink-3">Every student in the school is already in this class.</p>;
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="min-w-40 flex-1 text-xs text-ink-3"><span className="mb-1 block">Student</span>
        <select name="student_id" className={sel}>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}{s.grade ? ` (Grade ${s.grade})` : ""}</option>)}
        </select>
      </label>
      <label className="w-28 text-xs text-ink-3"><span className="mb-1 block">Roll no.</span>
        <input name="roll_no" maxLength={20} className={sel} />
      </label>
      <button disabled={pending} className={buttonClass}>Enrol</button>
      <div className="w-full empty:hidden"><FormMessage state={state} /></div>
    </form>
  );
}

export function LinkSubjectForm({
  classId,
  subjects,
  teachers,
}: {
  classId: number;
  subjects: { id: number; name: string }[];
  teachers: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState(linkSubject.bind(null, classId), undefined);
  if (!subjects.length) return <p className="text-xs text-ink-3">All available subjects are linked.</p>;
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="min-w-36 flex-1 text-xs text-ink-3"><span className="mb-1 block">Subject</span>
        <select name="subject_id" className={sel}>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
      </label>
      <label className="min-w-36 flex-1 text-xs text-ink-3"><span className="mb-1 block">Teacher</span>
        <select name="teacher_id" className={sel}><option value="">—</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
      </label>
      <button disabled={pending} className={buttonClass}>Link</button>
      <div className="w-full empty:hidden"><FormMessage state={state} /></div>
    </form>
  );
}
