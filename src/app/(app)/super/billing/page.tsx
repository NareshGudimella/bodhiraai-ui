import type { Metadata } from "next";
import Link from "next/link";
import { Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader } from "@/components/ui";
import { billingApi } from "@/lib/billing-api";
import { mj, mjY, paise } from "@/lib/money";

export const metadata: Metadata = { title: "Platform Billing" };

const TONES: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-danger-light text-danger",
};

/** Legacy BillingController::superIndex (`billing.platform`). */
export default async function SuperBillingPage({ searchParams }: PageProps<"/super/billing">) {
  const params = toParams(await searchParams, ["page"]);
  const { payments, meta } = await billingApi.payments(params);
  return (
    <>
      <PageHeader title="Platform Billing" subtitle="All payments across all schools, including manual grants." />
      {payments.length ? (
        <div className="overflow-x-auto rounded-2xl bg-card ring-1 ring-line">
          <table className="w-full min-w-3xl text-sm">
            <thead className="bg-primary-light/60 text-left text-[10px] uppercase tracking-wider text-ink-3">
              <tr>
                {["Date", "School", "Plan", "Amount", "Gateway", "Status", "Period"].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3 text-ink-3">{mjY(p.created_at)}</td>
                  <td className="px-4 py-3 font-semibold">
                    {p.school ? <Link href={`/super/schools/${p.school.id}`} className="hover:text-brand">{p.school.name}</Link> : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">{p.plan}</td>
                  <td className="px-4 py-3 font-mono">{paise(p.amount_paise)}</td>
                  <td className="px-4 py-3 capitalize text-ink-3">{p.gateway}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${TONES[p.status] ?? "bg-primary-light text-ink-2"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-3">
                    {p.period_start && p.period_end ? `${mj(p.period_start)} – ${mjY(p.period_end)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Empty>No payments yet.</Empty>}
      <Pagination base="/super/billing" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
      <Card className="mt-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Manual Grant</p>
        <p className="mt-1 text-xs text-ink-2">
          Useful for offline wire transfers or comp plans. Open a school&apos;s page from{" "}
          <Link href="/super/schools" className="font-semibold text-brand hover:underline">Schools</Link> to grant a plan manually.
        </p>
      </Card>
    </>
  );
}
