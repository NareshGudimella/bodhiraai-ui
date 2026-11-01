"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Empty, Pill, buttonClass, secondaryButtonClass } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { createSchoolAdmin, toggleSchoolAdmin, updateSchoolAdmin } from "@/lib/super-actions";
import type { SchoolAdmin } from "@/lib/super-api";
import { tone } from "../../format";

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "never";

/** not in legacy: the school's School Admin accounts (list, add, edit, reset password, activate/deactivate). */
export function SchoolAdmins({ schoolId, admins }: { schoolId: number; admins: SchoolAdmin[] }) {
  return (
    <>
      {admins.length ? (
        <ul className="space-y-2 text-sm">
          {admins.map((a, i) => (
            <AdminItem key={a.id} schoolId={schoolId} admin={a} index={i} />
          ))}
        </ul>
      ) : (
        <Empty>No admin accounts.</Empty>
      )}
      <AddAdmin schoolId={schoolId} />
    </>
  );
}

function AdminItem({ schoolId, admin: a, index }: { schoolId: number; admin: SchoolAdmin; index: number }) {
  return (
    <li className="ccard rounded-lg bg-card py-2 pl-4 pr-3 ring-1 ring-line" style={cardTone(index)}>
      <span className="flex items-center justify-between gap-2">
        <span className="text-ink">{a.name}</span>
        <Pill tone={tone(a.status)}>{a.status}</Pill>
      </span>
      <span className="block truncate text-xs text-ink-3">✉️ {a.email}</span>
      {a.phone && <span className="block truncate text-xs text-ink-3">📞 {a.phone}</span>}
      <span className="block text-xs text-ink-3">Last sign-in: {when(a.last_login_at)}</span>
      <div className="mt-2 flex flex-wrap items-start gap-2">
        <EditAdmin schoolId={schoolId} admin={a} />
        <ResetPassword schoolId={schoolId} admin={a} />
        <form action={toggleSchoolAdmin.bind(null, schoolId, a.id)}>
          <button className="text-xs font-semibold text-brand hover:underline">{a.status === "active" ? "Deactivate" : "Activate"}</button>
        </form>
      </div>
    </li>
  );
}

function EditAdmin({ schoolId, admin: a }: { schoolId: number; admin: SchoolAdmin }) {
  const [state, action, pending] = useActionState(updateSchoolAdmin.bind(null, schoolId, a.id), undefined);
  const v = state?.ok ? undefined : state?.values;
  const e = state?.errors;
  return (
    <details className="w-full" open={state?.ok === false}>
      <summary className="cursor-pointer text-xs font-semibold text-brand">Edit</summary>
      <form action={action} className="mt-2 space-y-2" key={state?.ok ? `done-${state.message}` : `edit-${JSON.stringify(v)}`}>
        <Field label="Name" error={e?.name}>
          <input name="name" defaultValue={v?.name ?? a.name} required maxLength={120} className={inputClass} />
        </Field>
        <Field label="Email" error={e?.email}>
          <input name="email" type="email" defaultValue={v?.email ?? a.email} required maxLength={160} className={inputClass} />
        </Field>
        <Field label="Phone" error={e?.phone}>
          <input name="phone" defaultValue={v?.phone ?? a.phone ?? ""} maxLength={20} className={inputClass} />
        </Field>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={secondaryButtonClass}>{pending ? "Saving…" : "Save"}</button>
      </form>
      {state?.ok && <div className="mt-2"><FormMessage state={state} /></div>}
    </details>
  );
}

/** The update endpoint with a new password; name and email go along unchanged. */
function ResetPassword({ schoolId, admin: a }: { schoolId: number; admin: SchoolAdmin }) {
  const [state, action, pending] = useActionState(updateSchoolAdmin.bind(null, schoolId, a.id), undefined);
  const e = state?.errors;
  return (
    <details className="w-full" open={state?.ok === false}>
      <summary className="cursor-pointer text-xs font-semibold text-brand">Reset password</summary>
      <form action={action} className="mt-2 space-y-2" key={state?.ok ? `done-${state.message}` : "reset"}>
        <input type="hidden" name="name" value={a.name} />
        <input type="hidden" name="email" value={a.email} />
        <Field label="New password" error={e?.password ?? e?.name ?? e?.email} hint="At least 8 characters. Signs the admin out everywhere.">
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </Field>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={secondaryButtonClass}>{pending ? "Saving…" : "Reset password"}</button>
      </form>
      {state?.ok && <div className="mt-2"><FormMessage state={state} /></div>}
    </details>
  );
}

function AddAdmin({ schoolId }: { schoolId: number }) {
  const [state, action, pending] = useActionState(createSchoolAdmin.bind(null, schoolId), undefined);
  const v = state?.ok ? undefined : state?.values;
  const e = state?.errors;
  return (
    <details className="mt-3 rounded-2xl bg-card p-4 ring-1 ring-line" open={state?.ok === false}>
      <summary className="cursor-pointer font-semibold text-brand">+ Add School Admin</summary>
      <form action={action} className="mt-4 space-y-3" key={state?.ok ? `done-${state.message}` : `new-${JSON.stringify(v)}`}>
        <Field label="Name" error={e?.name}>
          <input name="name" defaultValue={v?.name} required maxLength={120} className={inputClass} />
        </Field>
        <Field label="Email" error={e?.email} hint="The admin signs in with this email.">
          <input name="email" type="email" defaultValue={v?.email} required maxLength={160} className={inputClass} />
        </Field>
        <Field label="Phone" error={e?.phone}>
          <input name="phone" defaultValue={v?.phone} maxLength={20} className={inputClass} />
        </Field>
        <Field label="Password" error={e?.password} hint="At least 8 characters.">
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </Field>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Adding…" : "Add School Admin"}</button>
      </form>
      {state?.ok && <div className="mt-3"><FormMessage state={state} /></div>}
    </details>
  );
}
