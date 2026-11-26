import type { Metadata } from "next";
import Link from "next/link";
import { Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader, TableCard } from "@/components/ui";
import { billingApi } from "@/lib/billing-api";
import { mj, mjY, paise } from "@/lib/money";

export const metadata: Metadata = { title: "Platform Billing" };

const TONES: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning-light text-warning",
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
        <TableCard>
          <table className="data-table min-w-3xl">
            <thead>
              <tr>
                {["Date", "School", "Plan", "Amount", "Gateway", "Status", "Period"].map((h) => (
                  <th key={h} className={h === "Amount" ? "num" : undefined}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="whitespace-nowrap">{mjY(p.created_at)}</td>
                  <td className="font-medium">
                    {p.school ? <Link href={`/super/schools/${p.school.id}`} className="hover:underline">{p.school.name}</Link> : "—"}
                  </td>
                  <td className="capitalize">{p.plan}</td>
                  <td className="num font-medium text-ink">{paise(p.amount_paise)}</td>
                  <td className="capitalize">{p.gateway}</td>
                  <td>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TONES[p.status] ?? "bg-primary-light text-ink-2"}`}>{p.status}</span>
                  </td>
                  <td className="whitespace-nowrap text-xs">
                    {p.period_start && p.period_end ? `${mj(p.period_start)} – ${mjY(p.period_end)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      ) : <Empty>No payments yet.</Empty>}
      <Pagination base="/super/billing" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
      <Card className="mt-6">
        <h2 className="text-sm font-semibold text-ink">Manual grant</h2>
        <p className="mt-1 text-sm text-ink-2">
          Useful for offline wire transfers or comp plans. Open a school&apos;s page from{" "}
          <Link href="/super/schools" className="font-semibold text-ink underline hover:text-brand-lift">Schools</Link> to grant a plan manually.
        </p>
      </Card>
    </>
  );
}
