import type { Metadata } from "next";
import { FormSection } from "@/components/form";
import { PageHeader } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { MailSettingsForm, TestMailForm } from "./mail-settings-form";

export const metadata: Metadata = { title: "Mail settings" };

export default async function MailSettingsPage() {
  const s = await superApi.mailSettings();
  return (
    <>
      <PageHeader title="Mail settings" subtitle="Outgoing email for password resets and invoices." />
      {s.source === "none" && (
        <p role="status" className="mb-6 max-w-3xl rounded-lg bg-warning-light px-4 py-3 text-sm text-warning ring-1 ring-inset ring-warning/25">
          Nothing is saved yet, so no email is sent in production. Save SMTP settings below to turn email on.
        </p>
      )}
      <div className="grid max-w-3xl gap-6">
        <FormSection title="SMTP server" description="Where outgoing mail is sent from.">
          <MailSettingsForm
            initial={{
              mailer: s.mailer,
              host: s.host ?? "",
              port: s.port == null ? "" : String(s.port),
              encryption: s.encryption ?? "none",
              username: s.username ?? "",
              from_address: s.from_address,
              from_name: s.from_name ?? "",
            }}
            passwordSet={s.password_set}
          />
        </FormSection>
        <FormSection title="Send a test email" description="Uses the saved settings (save your changes first).">
          <TestMailForm />
        </FormSection>
      </div>
    </>
  );
}
