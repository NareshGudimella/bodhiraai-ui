import type { Metadata } from "next";
import Link from "next/link";
import { Card, buttonClass, secondaryButtonClass } from "@/components/ui";
import { billingApi } from "@/lib/billing-api";
import { paise } from "@/lib/money";

export const metadata: Metadata = { title: "Payment successful" };

/** Legacy CheckoutController::success (`billing.thank-you`). */
export default async function CheckoutSuccessPage({ params }: PageProps<"/checkout/success/[invoice]">) {
  const invoice = await billingApi.invoice((await params).invoice);
  const row = "flex justify-between gap-3 py-1 text-sm text-ink-2";
  return (
    <Card className="mx-auto mt-4 max-w-2xl p-8 text-center">
      <p aria-hidden className="text-7xl leading-none">✅</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight text-success">Payment successful</h1>
      <p className="mt-2 text-ink-2">
        Your <b>{invoice.plan_name}</b> subscription is now active.
      </p>
      <div className="mt-6 rounded-xl bg-primary-light/60 px-5 py-4 text-left">
        <p className={row}><span>Invoice number</span><span className="font-mono font-bold text-ink">{invoice.number}</span></p>
        <p className={row}><span>Amount</span><span className="font-mono font-bold text-ink">{paise(invoice.total_paise)}</span></p>
        <p className={row}><span>Email</span><span className="break-all text-ink">{invoice.billing_email}</span></p>
        <p className={row}><span>Status</span><span>{invoice.email_sent_at ? "✓ Invoice emailed" : "Saved to your account"}</span></p>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/student" className={buttonClass}>Go to dashboard →</Link>
        {invoice.pdf_path && (
          <a href={`/invoices/${invoice.id}/download`} className={secondaryButtonClass}>⬇ Download invoice</a>
        )}
      </div>
      <p className="mt-6 text-xs text-ink-3">
        Trouble with your invoice? Reach out at <b>hello@bodhira.com</b>.
      </p>
    </Card>
  );
}
