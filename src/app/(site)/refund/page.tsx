import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { LegalPage } from "@/components/site/legal-page";
import { TbaEmail } from "@/components/site/tba";
import { siteMetadata } from "@/lib/site";
import { businessDetails } from "@/lib/site-business";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/refund", 'Refund & Cancellation Policy · Bodhira.ai', { description: "The Bodhira.ai refund and cancellation policy for plans and subscriptions." });
}

const UPDATED = "November 22, 2026";

/**
 * Legacy resources/views/legal/refund.blade.php; the 2026 design-kit layout
 * (contents list, prose) comes from `LegalPage`. Differences from legacy (not
 * in legacy, 2026-11-22, compliance pass; needs a lawyer's and the owner's
 * review): the plan list matches the platform (individual and school plans,
 * monthly or yearly; legacy named Free / Starter / Pro / Enterprise and
 * "annual plans (if introduced later)", but yearly billing exists), no
 * automatic-renewal claim (there is none), the refund request also works
 * with an account email (individual sign-ups have no school code), "how to
 * cancel" no longer points at a Free plan downgrade that doesn't exist, and
 * the billing address is the `billing.email` setting (else `contact.email`)
 * instead of billing@bodhira.com (unverified domain). The 7-day window,
 * 10% fee, 5–10 days and 48 hours are legacy's commitments, unchanged.
 */
export default async function RefundPage() {
  await connection();
  const b = await businessDetails();
  const billing = <TbaEmail value={b.billingEmail} />;
  return (
    <>
      <SeoSchema path="refund" />
      <LegalPage heading="Refund & Cancellation Policy" path="/refund" updated={UPDATED}>
      <h2>1. Subscription Plans</h2>
<p>{b.siteName} offers individual plans for students and plans for schools, billed monthly or yearly as shown on our <a href="/pricing">Pricing</a> page. Each payment covers the billing period you chose; we do not charge you again automatically.</p>

<h2>2. 7-Day Refund Window</h2>
<p>If you&apos;re not satisfied within 7 days of your first paid period, email {billing} with your account email or school code and we&apos;ll issue a full refund. No questions asked.</p>

<h2>3. After the Refund Window</h2>
<p>Subscription fees for months already begun are non-refundable. You will continue to have access until the end of the current billing period.</p>

<h2>4. How to Cancel</h2>
<p>Email {billing} from your account email (School Admins: with your school code). We process cancellations within 2 business days.</p>

<h2>5. Pro-Rata Refunds</h2>
<p>Yearly plans are refundable pro-rata for unused months, less a 10% processing fee.</p>

<h2>6. Failed Payments</h2>
<p>If a payment fails, your account moves to &ldquo;inactive&rdquo; after 7 days of unsuccessful retries. Data is retained for 30 days; after that, it may be archived or deleted.</p>

<h2>7. Refund Processing</h2>
<p>Refunds are processed to the original payment method within 5–10 business days via Razorpay or Stripe.</p>

<h2>8. Disputes</h2>
<p>Contact {billing}. We respond within 48 hours.</p>
      </LegalPage>
    </>
  );
}
