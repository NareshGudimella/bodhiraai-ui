import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { INTEGRATIONS, PROVIDERS } from "@/lib/integrations-spec";
import { IntegrationCard } from "./integration-card";

export const metadata: Metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const items = await superApi.integrations();
  return (
    <>
      <PageHeader title="Integrations" subtitle="Provider credentials for storage, SMS, payments, AI and video." />
      <div className="grid max-w-3xl gap-4">
        <Card>
          <h2 className="font-semibold text-ink">Email (SMTP)</h2>
          <p className="mb-2 text-sm text-ink-3">Outgoing email for password resets and invoices.</p>
          <Link href="/super/mail-settings" className="text-sm font-medium text-primary hover:underline">
            Open Mail settings
          </Link>
        </Card>
        {PROVIDERS.map((p) => (
          <Card key={p}>
            <IntegrationCard provider={p} spec={INTEGRATIONS[p]} item={items[p]} />
          </Card>
        ))}
      </div>
    </>
  );
}
