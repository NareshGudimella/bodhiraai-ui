"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useActionState } from "react";
import { FormMessage } from "@/components/form";
import { adminCheckout, type CheckoutPayload } from "@/lib/billing-actions";

const ucfirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * The plan options (legacy `billing.school`); a paid plan opens the gateway
 * checkout (legacy `billing.checkout`) in place.
 */
export function PlanPicker({ pricing, current }: { pricing: Record<string, number>; current: string }) {
  const [state, action, pending] = useActionState(adminCheckout, undefined);
  if (state?.payload) return <Checkout payload={state.payload} />;
  const error = state?.errors ? Object.values(state.errors)[0]?.[0] : undefined;
  return (
    <>
      {error ? <p role="alert" className="mb-3 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{error}</p> : <div className="mb-3 empty:hidden"><FormMessage state={state} /></div>}
      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(pricing).map(([key, rupees]) => {
          const active = key === current;
          return (
            <div key={key} className={`rounded-xl border-[1.5px] p-3.5 ${active ? "border-primary bg-primary-light" : "border-line bg-page"}`}>
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-3">{ucfirst(key)}</p>
              {/* Legacy prints the rupee price divided by 100 here (₹100 for Starter); kept for parity. */}
              <p className="mt-1 text-xl font-black">{rupees === 0 ? "Free" : `₹${Math.round(rupees / 100).toLocaleString("en-US")}`}</p>
              {rupees > 0 && <p className="text-[11px] text-ink-3">per month</p>}
              {active ? (
                <p className="mt-3 rounded-lg bg-page py-2 text-center text-xs font-bold opacity-60">Current Plan</p>
              ) : (
                <form action={action} className="mt-3">
                  <input type="hidden" name="plan" value={key} />
                  <button
                    type="submit"
                    disabled={pending}
                    className={`w-full rounded-lg py-2 text-xs font-bold disabled:opacity-60 ${rupees === 0 ? "bg-page text-ink" : "bg-brand text-primary-light hover:bg-brand-mid"}`}
                  >
                    {rupees === 0 ? "Switch to Free" : "Upgrade →"}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Checkout({ payload: p }: { payload: CheckoutPayload }) {
  const router = useRouter();
  const launch = () => {
    const Razorpay = (window as unknown as { Razorpay?: new (o: Record<string, unknown>) => { open(): void } }).Razorpay;
    if (!Razorpay) return;
    new Razorpay({
      key: p.key_id,
      amount: p.amount_paise,
      currency: p.currency,
      order_id: p.order_id,
      name: "Bodhira.ai",
      description: "Subscription payment",
      handler: () => router.push(`/billing/success?payment_id=${p.payment_id}`),
      modal: { ondismiss: () => router.push("/billing/cancel") },
    }).open();
  };
  const label = "text-[10px] font-bold uppercase tracking-wider text-ink-3";
  return (
    <div>
      <h3 className="text-lg font-extrabold text-ink">Complete your payment</h3>
      <p className="mt-1 text-sm text-ink-3">Gateway: <b className="text-ink-2">{ucfirst(p.gateway)}</b></p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><p className={label}>Amount</p><p className="text-2xl font-extrabold">₹{(p.amount_paise / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p></div>
        <div><p className={label}>Payment ID</p><p className="font-mono">{p.payment_id}</p></div>
        <div className="col-span-2"><p className={label}>{p.gateway === "razorpay" ? "Order" : "Session"} ID</p><p className="break-all font-mono">{p.order_id ?? p.session_id ?? "—"}</p></div>
      </div>
      {p.demo ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <b>Demo mode.</b> No real charge will happen — gateway credentials are not configured. Set{" "}
          <code className="font-mono text-xs">{p.gateway === "razorpay" ? "RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET" : "STRIPE_SECRET"}</code> in <code>.env</code> to enable live checkout.
        </p>
      ) : p.gateway === "stripe" && p.checkout_url ? (
        <a href={p.checkout_url} className="mt-4 block rounded-lg bg-brand py-3 text-center font-bold text-primary-light hover:bg-brand-mid">Pay with Stripe →</a>
      ) : p.gateway === "razorpay" ? (
        <>
          {p.key_id && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
          <button type="button" onClick={launch} className="mt-4 w-full rounded-lg bg-brand py-3 font-bold text-primary-light hover:bg-brand-mid">Pay with Razorpay →</button>
        </>
      ) : null}
      {/* A full load resets the picker (legacy: a link back to the billing page). */}
      <a href="/admin/billing" className="mt-3 block text-center text-sm text-ink-3 hover:text-ink-2">← Cancel</a>
    </div>
  );
}
