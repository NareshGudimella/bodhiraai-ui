import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { MailSettingsForm, TestMailForm } from "./mail-settings-form";

export const metadata: Metadata = { title: "Mail settings" };

export default async function MailSettingsPage() {
  const s = await superApi.mailSettings();
  return (
    <>
      <PageHeader title="Mail settings" subtitle="Outgoing email for password resets and invoices." />
      {s.source === "none" && (
        <p className="mb-4 max-w-3xl rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink-2">
          Nothing is saved yet, so no email is sent in production. Save SMTP settings below to turn email on.
        </p>
      )}
      <div className="grid max-w-3xl gap-4">
        <Card>
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
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold text-ink">Send a test email</h2>
          <p className="mb-3 text-sm text-ink-3">Uses the saved settings (save your changes first).</p>
          <TestMailForm />
        </Card>
      </div>
    </>
  );
}
