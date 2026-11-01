import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, ProgressBar, SectionTitle, Stat } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { superApi } from "@/lib/super-api";
import { inr } from "../format";

export const metadata: Metadata = { title: "Revenue" };

export default async function SuperRevenuePage() {
  const r = await superApi.revenue();
  const share = (n: number) => (r.mrr > 0 ? Math.round((n / r.mrr) * 100) : 0);
  // Legacy: now()->diffInDays(plan_expires_at); expiry dates are whole days.
  const today = Date.parse(new Date().toISOString().slice(0, 10));
  const daysLeft = (d: string) => Math.max(0, Math.floor((Date.parse(d.slice(0, 10)) - today) / 86_400_000));
  return (
    <>
      <PageHeader title="Revenue" subtitle="Subscription billing snapshot across the platform. Counts every school's plan, whatever its status." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="MRR" value={inr(r.mrr)} />
        <Stat label="ARR" value={inr(r.arr)} />
        <Stat label="Active" value={r.by_status.active} hint="schools" />
        <Stat label="Inactive" value={r.by_status.inactive} hint="schools" />
        <Stat label="Suspended" value={r.by_status.suspended} hint="schools" />
        <Stat label="Expiring in 30d" value={r.expiring_soon.length} hint="plans" />
      </div>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <SectionTitle>By plan</SectionTitle>
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink-3">
                <tr><th className="px-4 py-2">Plan</th><th className="px-4 py-2">Schools</th><th className="px-4 py-2">Price / month</th><th className="px-4 py-2">MRR</th><th className="px-4 py-2">Share</th></tr>
              </thead>
              <tbody>
                {r.by_plan.map((p) => (
                  <tr key={p.plan} className="border-t border-line">
                    <td className="px-4 py-2 font-medium capitalize text-ink">{p.plan}</td>
                    <td className="px-4 py-2 text-ink-2">{p.count}</td>
                    <td className="px-4 py-2 text-ink-2">{inr(p.price)}</td>
                    <td className="px-4 py-2 text-ink-2">{inr(p.mrr_contribution)}</td>
                    <td className="min-w-24 px-4 py-2 text-ink-2">
                      <span className="mb-1 block text-xs font-bold text-ink-3">{share(p.mrr_contribution)}%</span>
                      <ProgressBar value={share(p.mrr_contribution)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
        <section>
          <SectionTitle>Plans expiring in 30 days</SectionTitle>
          {r.expiring_soon.length ? (
            <ul className="space-y-1 text-sm">
              {r.expiring_soon.map((s, i) => (
                <li key={s.id}>
                  <Link href={`/super/schools/${s.id}`} className="ccard flex justify-between gap-2 rounded-lg bg-card py-2 pl-4 pr-3 ring-1 ring-line hover:ring-primary" style={cardTone(i)}>
                    <span className="truncate text-ink">{s.name} <span className="text-xs capitalize text-ink-3">· {s.plan}</span></span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-ink-3">{s.plan_expires_at.slice(0, 10)} <Pill>{daysLeft(s.plan_expires_at)}d left</Pill></span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <Empty>Nothing expires soon.</Empty>}
        </section>
      </div>
    </>
  );
}
