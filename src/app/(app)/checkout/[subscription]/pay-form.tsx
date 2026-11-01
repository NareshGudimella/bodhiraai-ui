"use client";

import Script from "next/script";
import { useActionState, useRef } from "react";
import { completeCheckout } from "@/lib/billing-actions";

type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open(): void };
  }
}

/**
 * Pays the order. Demo mode (no Razorpay keys) submits straight away; with
 * keys, Razorpay's checkout opens and its handler fills in the payment ids.
 */
export function PayForm({
  subscriptionId,
  cycle,
  demo,
  keyId,
  orderId,
  totalPaise,
  description,
  buyer,
}: {
  subscriptionId: number;
  cycle: string;
  demo: boolean;
  keyId: string | null;
  /** The server-side Razorpay order; the API verifies the payment against it. */
  orderId: string | null;
  totalPaise: number;
  description: string;
  buyer: { name: string; email: string | null };
}) {
  const [state, action, pending] = useActionState(completeCheckout.bind(null, subscriptionId), undefined);
  const form = useRef<HTMLFormElement>(null);
  const total = (totalPaise / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const launch = () => {
    if (!window.Razorpay || !form.current) return;
    const f = form.current;
    new window.Razorpay({
      key: keyId,
      order_id: orderId,
      amount: totalPaise,
      currency: "INR",
      name: "Bodhira.ai",
      description,
      handler: (resp: RazorpayResponse) => {
        (f.elements.namedItem("razorpay_payment_id") as HTMLInputElement).value = resp.razorpay_payment_id;
        (f.elements.namedItem("razorpay_order_id") as HTMLInputElement).value = resp.razorpay_order_id ?? "";
        (f.elements.namedItem("razorpay_signature") as HTMLInputElement).value = resp.razorpay_signature ?? "";
        f.requestSubmit();
      },
      prefill: { name: buyer.name, email: buyer.email },
    }).open();
  };

  const error = state?.errors ? Object.values(state.errors)[0]?.[0] : state?.message;
  return (
    <form ref={form} action={action} className="mt-6">
      {!demo && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}
      <input type="hidden" name="cycle" value={cycle} />
      <input type="hidden" name="razorpay_payment_id" />
      <input type="hidden" name="razorpay_order_id" />
      <input type="hidden" name="razorpay_signature" />
      <input type="hidden" name="demo" value={demo ? "1" : "0"} />
      {error && <p role="alert" className="mb-3 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{error}</p>}
      {demo ? (
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-brand py-3 font-semibold text-primary-light hover:bg-brand-mid disabled:opacity-60">
          {pending ? "Processing…" : "Simulate payment → Generate invoice →"}
        </button>
      ) : (
        <button type="button" onClick={launch} disabled={pending} className="w-full rounded-lg bg-brand py-3 font-semibold text-primary-light hover:bg-brand-mid disabled:opacity-60">
          {pending ? "Processing…" : `Pay ₹${total} with Razorpay →`}
        </button>
      )}
    </form>
  );
}
