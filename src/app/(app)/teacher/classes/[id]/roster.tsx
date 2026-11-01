"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Empty, Pill, buttonClass, secondaryButtonClass } from "@/components/ui";
import { startChat } from "@/lib/inbox-actions";
import { addStudent, removeStudent, setStudentStatus, updateStudent } from "@/lib/teacher-actions";
import type { FormState } from "@/lib/action-result";

export type RosterStudent = {
  id: number;
  name: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  status: string;
  roll_no: string | null;
  /** Resolved image URL (null: show the initial). */
  avatar?: string | null;
};

const STATUS_TONE: Record<string, "success" | "brand" | "neutral"> = { active: "success", on_hold: "brand" };
const STATUS_LABEL: Record<string, string> = { active: "Active", on_hold: "On hold", blocked: "Blocked" };

/** Shared fields for add/edit (legacy storeStudent / updateStudent). */
function StudentFields({ state, student }: { state: FormState; student?: RosterStudent }) {
  const e = state?.errors ?? {};
  const v = state?.ok === false ? (state.values ?? {}) : {};
  const val = (k: keyof RosterStudent) => v[k] ?? (student?.[k] as string | null | undefined) ?? "";
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Field label="Full name" error={e.name}>
          <input name="name" required maxLength={255} defaultValue={val("name")} className={inputClass} />
        </Field>
        <Field label="Roll no." error={e.roll_no}>
          <input name="roll_no" maxLength={30} defaultValue={val("roll_no")} className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Email (optional)" error={e.email}>
          <input name="email" type="email" maxLength={255} defaultValue={val("email")} className={inputClass} />
        </Field>
        <Field label="Phone (optional)" error={e.phone}>
          <input name="phone" type="tel" maxLength={30} defaultValue={val("phone")} className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Date of birth" error={e.dob}>
          <input name="dob" type="date" defaultValue={val("dob")} className={inputClass} />
        </Field>
        <Field label="Gender" error={e.gender}>
          <select name="gender" defaultValue={val("gender")} className={inputClass}>
            <option value="">—</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label={student ? "New password" : "Password"} error={e.password} hint={student ? "Leave blank to keep." : "Optional, min 6."}>
          <input name="password" type="password" autoComplete="new-password" minLength={6} className={inputClass} />
        </Field>
      </div>
      <Field label="Photo (optional)" error={e.avatar}>
        <input name="avatar" type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-light file:px-3 file:py-1.5 file:text-sm file:text-brand" />
      </Field>
    </>
  );
}

export function AddStudentForm({ classId }: { classId: number }) {
  const [state, action, pending] = useActionState(addStudent.bind(null, classId), undefined);
  return (
    <details className="mb-4 rounded-2xl bg-card p-4 ring-1 ring-line" open={state?.ok === false}>
      <summary className="cursor-pointer font-semibold text-brand">+ Add a student</summary>
      <form action={action} className="mt-4 space-y-3" key={state?.ok ? `done-${state.message}` : `edit-${JSON.stringify(state?.values)}`}>
        <StudentFields state={state} />
        <p className="text-xs text-ink-3">A school login username is created automatically.</p>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add student"}</button>
      </form>
      {state?.ok && <div className="mt-3"><FormMessage state={state} /></div>}
    </details>
  );
}

/** Roster with client-side search and sort (legacy class.blade.php: name or roll no; name A-Z or roll no). */
export function RosterList({ classId, students }: { classId: number; students: RosterStudent[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "roll">("name");
  const q = query.trim().toLowerCase();
  const shown = students
    .filter((s) => !q || s.name.toLowerCase().includes(q) || (s.roll_no ?? "").toLowerCase().includes(q))
    .sort((a, b) =>
      sort === "roll"
        ? (a.roll_no ?? "").localeCompare(b.roll_no ?? "", undefined, { numeric: true }) || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="min-w-48 flex-1">
          <span className="sr-only">Search students</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or roll no…"
            className={inputClass}
          />
        </label>
        <label>
          <span className="sr-only">Sort students</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as "name" | "roll")} className={inputClass}>
            <option value="name">Sort: Name (A–Z)</option>
            <option value="roll">Sort: Roll no.</option>
          </select>
        </label>
        <span className="text-xs text-ink-3">{shown.length} of {students.length}</span>
      </div>
      {shown.length ? (
        <ul className="rounded-2xl bg-card shadow-sm ring-1 ring-line">
          {shown.map((s) => (
            <RosterRow key={s.id} classId={classId} student={s} />
          ))}
        </ul>
      ) : (
        <Empty>{students.length ? "No students match your search." : "No students in this class yet."}</Empty>
      )}
    </>
  );
}

export function RosterRow({ classId, student }: { classId: number; student: RosterStudent }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateStudent.bind(null, classId, student.id), undefined);
  return (
    <li className="border-t border-line px-4 py-3 first:border-t-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-3">
          {student.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={student.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light font-bold text-brand">
              {student.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="mr-2 text-xs text-ink-3">{student.roll_no ?? "—"}</span>
            <Link href={`/teacher/students/${student.id}`} className="font-medium text-ink hover:text-brand hover:underline">
              {student.name}
            </Link>
            <span className="block truncate text-xs text-ink-3">{student.username ?? student.email ?? student.phone ?? ""}</span>
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-2">
          <Pill tone={STATUS_TONE[student.status] ?? "neutral"}>{STATUS_LABEL[student.status] ?? student.status}</Pill>
          <form action={setStudentStatus.bind(null, classId, student.id)} className="flex items-center gap-1">
            <label className="sr-only" htmlFor={`status-${student.id}`}>Status</label>
            <select id={`status-${student.id}`} name="status" defaultValue={student.status} className="rounded-md border border-line bg-bg px-2 py-1 text-xs">
              <option value="active">Active</option>
              <option value="on_hold">On hold</option>
              <option value="blocked">Blocked</option>
            </select>
            <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">Set</button>
          </form>
          <form action={startChat.bind(null, "with-parent", student.id)}>
            <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light" title="Chat with this student's parent">
              Chat parent
            </button>
          </form>
          <button type="button" onClick={() => setEditing((x) => !x)} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">
            {editing ? "Close" : "Edit"}
          </button>
          <form
            action={removeStudent.bind(null, classId, student.id)}
            onSubmit={(e) => {
              if (!confirm(`Delete ${student.name}'s account? This removes their progress too.`)) e.preventDefault();
            }}
          >
            <button className="rounded-md border border-danger/40 px-2 py-1 text-xs text-danger hover:bg-danger-light">Remove</button>
          </form>
        </span>
      </div>
      {(editing || state?.ok === false) && (
        <form action={action} className="mt-3 space-y-3" key={`${state?.ok}-${JSON.stringify(state?.values)}`}>
          <StudentFields state={state} student={student} />
          <FormMessage state={state} />
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save"}</button>
            <button type="button" onClick={() => setEditing(false)} className={secondaryButtonClass}>Cancel</button>
          </div>
        </form>
      )}
      {state?.ok && !editing && <div className="mt-2"><FormMessage state={state} /></div>}
    </li>
  );
}
