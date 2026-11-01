import type { Metadata } from "next";
import { Card, PageHeader, Pill } from "@/components/ui";
import { superApi } from "@/lib/super-api";

export const metadata: Metadata = { title: "Health" };

export default async function SuperHealthPage() {
  const h = await superApi.health();
  return (
    <>
      <PageHeader
        title="System health"
        subtitle={`${h.environment}${h.node_version ? ` · Node ${h.node_version}` : ""}${h.app_url ? ` · ${h.app_url}` : ""} · checked ${new Date(h.checked_at).toLocaleString("en-IN")}`}
        action={<Pill tone={h.overall === "healthy" ? "success" : "neutral"}>{h.overall}</Pill>}
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {h.checks.map((c) => (
          <li key={c.name}>
            <Card className="flex items-start justify-between gap-3 p-4">
              <span className="min-w-0">
                <span className="block font-medium text-ink">{c.name}</span>
                <span className="block break-words text-xs text-ink-3">{c.detail ?? "—"}{c.latency_ms != null ? ` · ${c.latency_ms} ms` : ""}</span>
              </span>
              <Pill tone={c.status === "healthy" ? "success" : "neutral"}>{c.status}</Pill>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
