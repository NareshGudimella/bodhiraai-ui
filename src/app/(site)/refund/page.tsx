import type { Metadata } from "next";
import { SeoSchema } from "@/components/site/seo-schema";
import { LegalPage } from "@/components/site/legal-page";
import { siteMetadata } from "@/lib/site";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/refund", 'Refund & Cancellation Policy · Bodhira.ai');
}

/** Legacy resources/views/legal/refund.blade.php. */
export default function RefundPage() {
  return (
    <>
      <SeoSchema path="refund" />
      <LegalPage heading="Refund & Cancellation Policy" path="/refund">
      <h2>1. Subscription Plans</h2>
<p>Bodhira.ai offers monthly subscription plans (Free, Starter, Pro, Enterprise). Paid plans renew automatically unless cancelled before the billing date.</p>

<h2>2. 7-Day Refund Window</h2>
<p>If you're not satisfied within 7 days of your first paid month, email <a href="mailto:billing@bodhira.com">billing@bodhira.com</a> with your school code and we'll issue a full refund. No questions asked.</p>

<h2>3. After the Refund Window</h2>
<p>Subscription fees for months already begun are non-refundable. You will continue to have access until the end of the current billing period.</p>

<h2>4. How to Cancel</h2>
<p>From your School Admin → Billing page, downgrade to the Free plan, or email <a href="mailto:billing@bodhira.com">billing@bodhira.com</a>. We process cancellations within 2 business days.</p>

<h2>5. Pro-Rata Refunds</h2>
<p>Annual plans (if introduced later) will be refundable pro-rata for unused months, less a 10% processing fee.</p>

<h2>6. Failed Payments</h2>
<p>If a renewal payment fails, your account moves to "inactive" after 7 days of unsuccessful retries. Data is retained for 30 days; after that, it may be archived or deleted.</p>

<h2>7. Refund Processing</h2>
<p>Refunds are processed to the original payment method within 5–10 business days via Razorpay or Stripe.</p>

<h2>8. Disputes</h2>
<p>Contact <a href="mailto:billing@bodhira.com">billing@bodhira.com</a>. We respond within 48 hours.</p>
      </LegalPage>
    </>
  );
}
