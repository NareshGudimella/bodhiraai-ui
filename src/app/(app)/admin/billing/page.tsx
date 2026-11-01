import type { Metadata } from "next";
import { Card, Empty, PageHeader, SectionTitle } from "@/components/ui";
import { billingApi } from "@/lib/billing-api";
import { mj, mjY, paise } from "@/lib/money";
import { PlanPicker } from "./plan-picker";

export const metadata: Metadata = { title: "Billing" };

const LABELS: Record<string, string> = {
  free: "Bodhira.ai Free",
  starter: "Bodhira.ai Starter",
  pro: "Bodhira.ai Pro 🚀",
  enterprise: "Bodhira.ai Enterprise",
};
const TONES: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-danger-light text-danger",
};
const ucfirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Legacy BillingController::adminIndex (`billing.school`). */
export default async function AdminBillingPage() {
  const { school, payments, pricing, gateway, configured, students_used } = await billingApi.school();
  const current = school?.plan ?? "free";
  const maxStudents = school?.max_students ?? 500;
  const taglines: Record<string, string> = {
    free: "1 class · basic features · community support.",
    starter: "Up to 5 classes · email support · quizzes & assignments.",
    pro: `Up to ${maxStudents} students · All modules unlocked · Priority support.`,
    enterprise: "Multi-campus · dedicated support · custom integrations · SLA.",
  };
  const price = pricing[current] ?? 0;
  const cell = "rounded-xl border border-white/10 bg-white/5 px-4 py-3";
  return (
    <>
      <PageHeader title="💳 Billing" subtitle="Manage your school's subscription and invoices." />
      <div className="grid gap-5 [&>*]:min-w-0 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl bg-[linear-gradient(135deg,#1A0A0C,#2A0E13_50%,#3D1520)] p-7 text-white shadow-lg">
          <p className="text-xs font-semibold tracking-wider opacity-70">CURRENT PLAN</p>
          <h2 className="mt-1 text-2xl font-extrabold">{LABELS[current] ?? ucfirst(current)}</h2>
          <p className="mt-2 max-w-md text-sm opacity-80">{taglines[current] ?? "Manage your school subscription."}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className={cell}>
              <p className="text-[11px] font-semibold tracking-wider opacity-70">MONTHLY</p>
              <p className="mt-1 text-xl font-extrabold">{price === 0 ? "Free" : paise(price * 100, 0)}</p>
            </div>
            <div className={cell}>
              <p className="text-[11px] font-semibold tracking-wider opacity-70">SEATS USED</p>
              <p className="mt-1 text-xl font-extrabold">{students_used} / {maxStudents}</p>
            </div>
            <div className={cell}>
              <p className="text-[11px] font-semibold tracking-wider opacity-70">NEXT BILLING</p>
              <p className="mt-1 text-lg font-extrabold">{school?.plan_expires_at ? mjY(school.plan_expires_at) : "—"}</p>
            </div>
          </div>
          <p className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className={`rounded-full px-3 py-1 ${school?.status === "active" ? "bg-success/25 text-green-300" : "bg-white/10 text-white/70"}`}>
              {ucfirst(school?.status ?? "unknown")}
            </span>
            {!configured && <span className="rounded-full bg-amber-500/25 px-3 py-1 text-amber-200">Demo mode · {ucfirst(gateway)}</span>}
          </p>
        </section>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-extrabold text-ink">Choose a Plan</h2>
          <PlanPicker pricing={pricing} current={current} />
        </Card>
      </div>

      <section className="mt-8">
        <SectionTitle>Payment history</SectionTitle>
        {payments.length ? (
          <div className="overflow-x-auto rounded-2xl bg-card ring-1 ring-line">
            <table className="w-full min-w-xl text-sm">
              <thead className="bg-primary-light/60 text-left text-[11px] uppercase tracking-wide text-ink-3">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Period</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-4 py-3 font-bold">#INV-{String(p.id).padStart(6, "0")}</td>
                    <td className="px-4 py-3">{mjY(p.created_at)}</td>
                    <td className="px-4 py-3 font-bold">{paise(p.amount_paise, 0)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TONES[p.status] ?? "bg-primary-light text-ink-2"}`}>{ucfirst(p.status)}</span>
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
      </section>
    </>
  );
}
