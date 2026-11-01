import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal";

/** Legacy `billing.result`: where a gateway sends the school admin back after checkout. */
export function BillingResult({ status }: { status: "success" | "cancelled" }) {
  const ok = status === "success";
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-line">
        <p aria-hidden className="mb-4 text-6xl">{ok ? "✅" : "⏸️"}</p>
        <h1 className={`text-2xl font-extrabold ${ok ? "text-success" : "text-ink-2"}`}>
          {ok ? "Payment Successful" : "Checkout Cancelled"}
        </h1>
        <p className="mt-2 text-sm text-ink-3">
          {ok ? "Payment received — your plan will activate once verified." : "Checkout cancelled. No charge was made."}
        </p>
        <Suspense>
          <SignedIn />
        </Suspense>
        <Link href="/admin/billing" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-bold text-primary-light hover:bg-brand-mid">
          Back to Billing
        </Link>
      </div>
    </main>
  );
}

/** Legacy `auth` middleware: signed-out visitors go to /login. */
async function SignedIn() {
  await getCurrentUser();
  return null;
}
