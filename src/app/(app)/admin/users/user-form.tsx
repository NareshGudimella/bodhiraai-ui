"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, ProgressBar, SectionTitle, buttonClass } from "@/components/ui";
import { saveUser } from "@/lib/admin-actions";

export type UserValues = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  username?: string | null;
  role?: string | null;
  gender?: string | null;
  grade?: string | null;
  dob?: string | null;
};

export type Seats = { teachers_used: number; teachers_max: number; students_used: number; students_max: number };

/** Legacy "Seat Usage" banner (user-form.blade.php, create mode). */
function SeatPanel({ seats }: { seats: Seats }) {
  const rows = [
    { label: "Teachers", used: seats.teachers_used, max: seats.teachers_max },
    { label: "Students", used: seats.students_used, max: seats.students_max },
  ];
  return (
    <Card className="mb-4 max-w-2xl">
      <SectionTitle>Seat usage</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => {
          const full = r.used >= r.max;
          return (
            <div key={r.label}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{r.label} seats</p>
              <p className={`text-2xl font-black ${full ? "text-danger" : "text-ink"}`}>{r.used} / {r.max}</p>
              <ProgressBar value={r.max > 0 ? Math.round((r.used / r.max) * 100) : 100} />
              {full && <p className="mt-1 text-[11px] font-bold text-danger">Limit reached — contact the platform admin to raise it.</p>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

const ROLE_LABELS: Record<string, string> = { student: "Student", teacher: "Teacher", parent: "Parent", admin: "Admin", super_admin: "Super admin" };

/**
 * Create/edit form (AdminApiController::validateUser fields). As in legacy the
 * role is chosen on create and locked on edit (a disabled select plus a hidden
 * field carrying the current role), and the username is not editable.
 */
export function UserForm({ userId, initial, seats }: { userId: number | null; initial: UserValues; seats?: Seats | null }) {
  const [state, action, pending] = useActionState(saveUser.bind(null, userId), undefined);
  const e = state?.errors ?? {};
  const v = { ...initial, ...(state?.values ?? {}) } as Record<string, string | null | undefined>;
  return (
    <>
    {!userId && seats && <SeatPanel seats={seats} />}
    <Card className="max-w-2xl">
      <form action={action} className="space-y-4" key={JSON.stringify(state?.values ?? null)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={e.name}>
            <input name="name" required maxLength={120} defaultValue={v.name ?? ""} className={inputClass} />
          </Field>
          <Field label="Role" error={e.role}>
            <select name={userId ? undefined : "role"} defaultValue={v.role ?? "student"} disabled={!!userId} className={inputClass}>
              {["student", "teacher", "parent"].map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              {userId && v.role && !["student", "teacher", "parent"].includes(v.role) && (
                <option value={v.role}>{ROLE_LABELS[v.role] ?? v.role}</option>
              )}
            </select>
            {userId && <input type="hidden" name="role" value={initial.role ?? ""} />}
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" error={e.email}>
            <input name="email" type="email" maxLength={160} defaultValue={v.email ?? ""} className={inputClass} />
          </Field>
          <Field label="Phone" error={e.phone}>
            <input name="phone" maxLength={20} defaultValue={v.phone ?? ""} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Username" error={e.username} hint={userId ? "Set when the account is created." : "Blank: auto for students."}>
            <input name={userId ? undefined : "username"} maxLength={40} pattern="[a-zA-Z0-9._\-]+" defaultValue={v.username ?? ""} disabled={!!userId} className={inputClass} />
          </Field>
          <Field label="Grade" error={e.grade}>
            <input name="grade" maxLength={10} defaultValue={v.grade ?? ""} className={inputClass} />
          </Field>
          <Field label="Gender" error={e.gender}>
            <select name="gender" defaultValue={v.gender ?? ""} className={inputClass}>
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date of birth" error={e.dob}>
            <input name="dob" type="date" defaultValue={v.dob ?? ""} className={inputClass} />
          </Field>
          <Field label={userId ? "New password" : "Password"} error={e.password} hint={userId ? "Leave blank to keep." : "At least 6 characters."}>
            <input name="password" type="password" autoComplete="new-password" minLength={6} required={!userId} className={inputClass} />
          </Field>
        </div>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : userId ? "Save changes" : "Create user"}</button>
      </form>
    </Card>
    </>
  );
}
