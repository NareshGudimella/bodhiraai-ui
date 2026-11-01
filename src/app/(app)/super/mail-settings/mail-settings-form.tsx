"use client";

import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass } from "@/components/ui";
import { saveMailSettings, sendTestMail } from "@/lib/super-actions";

type Values = Partial<
  Record<"mailer" | "host" | "port" | "encryption" | "username" | "from_address" | "from_name", string>
>;

export function MailSettingsForm({ initial, passwordSet }: { initial: Values; passwordSet: boolean }) {
  const [state, action, pending] = useActionState(saveMailSettings, undefined);
  const e = state?.errors ?? {};
  const v: Values = { ...initial, ...state?.values };
  return (
    <form action={action} className="space-y-3" key={JSON.stringify(v)}>
      <Field label="Mailer" error={e.mailer} hint="Log writes messages to the server log and sends nothing (not for production)">
        <select name="mailer" defaultValue={v.mailer ?? "smtp"} className={inputClass}>
          <option value="smtp">SMTP</option>
          <option value="log">Log (development)</option>
        </select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="SMTP host" error={e.host}>
            <input name="host" maxLength={190} defaultValue={v.host} className={inputClass} />
          </Field>
        </div>
        <Field label="Port" error={e.port}>
          <input name="port" type="number" min={1} max={65535} defaultValue={v.port} className={inputClass} />
        </Field>
      </div>
      <Field label="Encryption" error={e.encryption}>
        <select name="encryption" defaultValue={v.encryption ?? "none"} className={inputClass}>
          <option value="tls">TLS (STARTTLS, usually port 587)</option>
          <option value="ssl">SSL (implicit, usually port 465)</option>
          <option value="none">None</option>
        </select>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Username" error={e.username}>
          <input name="username" maxLength={190} autoComplete="off" defaultValue={v.username} className={inputClass} />
        </Field>
        <Field label="Password" error={e.password} hint="Leave blank to keep the saved password">
          <input name="password" type="password" maxLength={500} autoComplete="new-password" className={inputClass} />
          <span className={`mt-1 block text-xs ${passwordSet ? "text-success" : "text-ink-3"}`}>
            Password: {passwordSet ? "set ✓" : "not set"}
          </span>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="From address" error={e.from_address}>
          <input name="from_address" type="email" required maxLength={190} defaultValue={v.from_address} className={inputClass} />
        </Field>
        <Field label="From name" error={e.from_name}>
          <input name="from_name" maxLength={120} defaultValue={v.from_name} className={inputClass} />
        </Field>
      </div>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

export function TestMailForm() {
  const [state, action, pending] = useActionState(sendTestMail, undefined);
  return (
    <form action={action} className="space-y-3">
      <Field label="Send to" error={state?.errors?.to}>
        <input name="to" type="email" required maxLength={190} defaultValue={state?.values?.to} className={inputClass} />
      </Field>
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>
        {pending ? "Sending…" : "Send test email"}
      </button>
    </form>
  );
}
