"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { Card, buttonClass } from "@/components/ui";
import { changePassword, updateProfile } from "@/lib/account-actions";
import { NewPasswordInput } from "@/components/new-password-input";
import { DOB_MIN, FILE, L, PHONE_HINT, checkFiles, currentPasswordProps, digitsOnly, dobMax, nameProps, phoneProps } from "@/lib/input-limits";

type Profile = {
  name: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  email: string | null;
  avatar: string | null;
};

export function ProfileForm({ user }: { user: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  // A chosen photo previews until the next submit result arrives; after that the
  // stored photo (refreshed props) shows again.
  const [picked, setPicked] = useState<{ url: string; after: typeof state } | null>(null);
  const preview = picked && picked.after === state ? picked.url : null;
  const e = state?.errors ?? {};
  // After a failed submit React resets the inputs; refill from what was sent.
  const v = state?.ok === false ? (state.values ?? {}) : {};
  const value = (k: keyof Profile) => v[k] ?? user[k] ?? "";

  return (
    <Card>
      <form action={action} className="space-y-4" key={state?.ok ? "saved" : `edit-${JSON.stringify(v)}`}>
        <div className="flex items-center gap-4">
          {preview || user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview ?? user.avatar!} alt="" className="size-16 rounded-full object-cover ring-2 ring-primary" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-brand">
              {user.name.charAt(0)}
            </span>
          )}
          <Field label="Photo" error={e.avatar} hint="JPG, PNG, GIF or WebP, up to 4 MB.">
            <input
              name="avatar"
              type="file"
              accept={FILE.avatar.accept}
              onChange={(ev) => {
                checkFiles(FILE.avatar.kb)(ev);
                const f = ev.target.files?.[0];
                setPicked(f ? { url: URL.createObjectURL(f), after: state } : null);
              }}
              className="block w-full text-sm text-ink-2 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-light file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand"
            />
          </Field>
        </div>
        <Field label="Name" error={e.name}>
          <input name="name" {...nameProps(L.nameLong)} defaultValue={value("name")} className={inputClass} />
        </Field>
        {user.email && <p className="text-xs text-ink-3">Email: {user.email} (contact your school to change it)</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" error={e.phone} hint={PHONE_HINT}>
            <input name="phone" {...phoneProps()} onInput={digitsOnly} defaultValue={value("phone")} className={inputClass} />
          </Field>
          <Field label="Date of birth" error={e.dob}>
            <input name="dob" type="date" min={DOB_MIN} max={dobMax()} autoComplete="bday" defaultValue={value("dob")} className={inputClass} />
          </Field>
        </div>
        <Field label="Gender" error={e.gender}>
          <select name="gender" defaultValue={value("gender")} className={inputClass}>
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save profile"}</button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  const e = state?.errors ?? {};
  return (
    <Card>
      <form action={action} className="space-y-4">
        <Field label="Current password" error={e.current_password}>
          <input name="current_password" type="password" {...currentPasswordProps} required className={inputClass} />
        </Field>
        <Field label="New password" error={e.password}>
          <NewPasswordInput name="password" required className={inputClass} />
        </Field>
        <Field label="Confirm new password" error={e.password_confirmation}>
          <input name="password_confirmation" type="password" maxLength={L.passwordMax} autoComplete="new-password" required className={inputClass} />
        </Field>
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Change password"}</button>
      </form>
    </Card>
  );
}
