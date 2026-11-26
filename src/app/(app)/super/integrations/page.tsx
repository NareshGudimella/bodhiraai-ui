import type { Metadata } from "next";
import Link from "next/link";
import { FormSection } from "@/components/form";
import { PageHeader } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { INTEGRATIONS, PROVIDERS } from "@/lib/integrations-spec";
import { IntegrationCard } from "./integration-card";

export const metadata: Metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const items = await superApi.integrations();
  return (
    <>
      <PageHeader title="Integrations" subtitle="Provider credentials for storage, SMS, payments, AI and video." />
      <div className="grid max-w-3xl gap-6">
        <FormSection
          title="Email (SMTP)"
          description="Outgoing email for password resets and invoices."
          footer={<Link href="/super/mail-settings" className="text-sm font-semibold text-ink underline hover:text-brand-lift">Open Mail settings</Link>}
        >
          <p className="text-sm text-ink-2">SMTP credentials and the test email live on their own page.</p>
        </FormSection>
        {PROVIDERS.map((p) => (
          <IntegrationCard key={p} provider={p} spec={INTEGRATIONS[p]} item={items[p]} />
        ))}
      </div>
    </>
  );
}
