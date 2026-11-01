import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Flash } from "@/components/flash";
import { ApiError } from "@/lib/api";
import { billingApi } from "@/lib/billing-api";
import { requireRole } from "@/lib/dal";
import { paise } from "@/lib/money";
import { PayForm } from "./pay-form";

export const metadata: Metadata = { title: "Complete payment" };

/** Legacy CheckoutController::show (`billing.checkout-individual`). Not behind the paywall. */
export default function CheckoutPage({ params, searchParams }: PageProps<"/checkout/[subscription]">) {
  return (
    <main className="flex-1 bg-[linear-gradient(135deg,#1A0A0C,#2A0E13_50%,#3D1520)] px-4 py-10 text-white">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <Link href="/pricing" className="text-sm font-bold text-primary opacity-70">← Change plan</Link>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Complete your payment</h1>
          <p className="mt-1 opacity-70">One last step.</p>
        </div>
        <Suspense fallback={<p className="text-center opacity-70">Loading your order…</p>}>
          <Summary params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Summary({ params, searchParams }: PageProps<"/checkout/[subscription]">) {
  const user = await requireRole("student");
  const { subscription } = await params;
  const cycle = (await searchParams).cycle;
  let s;
  try {
    s = await billingApi.checkout(subscription, typeof cycle === "string" ? cycle : "");
  } catch (e) {
    // No plan to pay for: back to pricing, as legacy does.
    if (e instanceof ApiError && e.status === 422) redirect("/pricing");
    if (e instanceof ApiError && (e.status === 403 || e.status === 404)) notFound();
    throw e;
  }
  const line = "flex justify-between gap-3 py-2 text-sm text-ink-2";
  return (
    <section className="rounded-3xl bg-card p-8 text-ink shadow-[0_30px_60px_rgba(0,0,0,.35)]">
      <Flash />
      {s.demo_mode && (
        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <b>Demo mode.</b> No real charge will happen — Razorpay keys are not configured. Set{" "}
          <code className="font-mono">RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET</code> in <code>.env</code> to enable live checkout.
        </p>
      )}
      <p className="text-[11px] font-extrabold tracking-wider text-ink-3">ORDER SUMMARY</p>
      <h2 className="mt-2 text-xl font-extrabold">{s.plan.name}</h2>
      <p className="text-sm text-ink-2">{s.plan.tagline} · {s.cycle === "yearly" ? "Yearly" : "Monthly"} billing</p>
      <div className="mt-5">
        <p className={line}><span>{s.plan.name} ({s.cycle})</span><span>{paise(s.amount_paise)}</span></p>
        <p className={line}><span>GST ({Math.round(s.tax_rate_pct)}%)</span><span>{paise(s.tax_paise)}</span></p>
        <p className="mt-2 flex justify-between gap-3 border-t border-dashed border-line pt-3 text-lg font-extrabold">
          <span>Total due today</span><span>{paise(s.total_paise)}</span>
        </p>
      </div>
      <PayForm
        subscriptionId={s.subscription.id}
        cycle={s.cycle}
        demo={s.demo_mode}
        keyId={s.key_id}
        orderId={s.order_id}
        totalPaise={s.total_paise}
        description={`${s.plan.name} · ${s.cycle}`}
        buyer={{ name: user.name, email: user.email }}
      />
      <p className="mt-5 text-center text-xs leading-relaxed text-ink-3">
        Your invoice will be emailed to <b>{user.email}</b> the moment payment clears.
        <br />
        Cancel anytime from your account settings.
      </p>
    </section>
  );
}
