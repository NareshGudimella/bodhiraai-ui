import type { Metadata } from "next";
import { SeoSchema } from "@/components/site/seo-schema";
import { LegalPage } from "@/components/site/legal-page";
import { siteMetadata } from "@/lib/site";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/privacy", 'Privacy Policy · Bodhira.ai');
}

/** Legacy resources/views/legal/privacy.blade.php. */
export default function PrivacyPage() {
  return (
    <>
      <SeoSchema path="privacy" />
      <LegalPage heading="Privacy Policy" path="/privacy">
      <p>This Privacy Policy explains how Bodhira.ai collects, uses, and protects your personal data. We comply with India's Digital Personal Data Protection Act, 2023.</p>

<h2>1. Data We Collect</h2>
<ul>
  <li><b>Account data:</b> name, email, phone, role, school affiliation, grade, date of birth.</li>
  <li><b>Learning data:</b> lessons watched, quizzes attempted, assignments submitted, attendance, AI chat history and daily AI token usage.</li>
  <li><b>Messages:</b> conversations between parents and class teachers sent through the platform.</li>
  <li><b>Technical data:</b> IP address, browser, device info, session cookies for security.</li>
  <li><b>Payment data:</b> processed by Razorpay or Stripe; we never store full card numbers.</li>
</ul>

<h2>2. How We Use It</h2>
<ul>
  <li>Provide and personalise the Service.</li>
  <li>Generate learning analytics and AI recommendations.</li>
  <li>Communicate about your account (grade notifications, assignment reminders).</li>
  <li>Detect and prevent abuse.</li>
</ul>

<h2>3. Children's Data</h2>
<p>For users under 18, a parent or guardian must consent to data processing through the school's enrolment process. Parents may request access, correction, or deletion of their child's data at any time.</p>

<h2>4. Data Sharing</h2>
<p>We share data only with:</p>
<ul>
  <li><b>Schools</b> for users they have enrolled.</li>
  <li><b>Service providers</b> (hosting, email, payment gateway, Anthropic for AI features) under data processing agreements.</li>
  <li><b>Authorities</b> when legally required.</li>
</ul>
<p>We do <b>not</b> sell personal data, ever.</p>

<h2>5. AI Processing</h2>
<p>Student queries sent to the AI Doubt Solver are processed by Anthropic's Claude model. Anthropic does not train models on this data per their API terms. We retain chat history on our servers so you, your teachers, and your school can review past conversations; you can delete sessions at any time. AI usage is metered with a daily per-student token allowance set by your school or the platform.</p>

<h2>6. Retention</h2>
<p>We retain account data while your account is active and for up to 12 months after closure for legal/audit purposes. Anonymised analytics may be retained longer.</p>

<h2>7. Security</h2>
<ul>
  <li>HTTPS in transit, AES-256 at rest.</li>
  <li>Passwords stored as bcrypt hashes.</li>
  <li>Sessions are HttpOnly and SameSite=Lax cookies.</li>
  <li>Role-based access control on every endpoint.</li>
</ul>

<h2>8. Your Rights</h2>
<p>You may:</p>
<ul>
  <li>Access your data via your profile page or by request.</li>
  <li>Correct inaccurate data.</li>
  <li>Delete your account.</li>
  <li>Withdraw consent for processing (may limit Service availability).</li>
  <li>File a grievance with our Data Protection Officer at <a href="mailto:dpo@bodhira.com">dpo@bodhira.com</a>.</li>
</ul>

<h2>9. Cookies</h2>
<p>We use session cookies for authentication and CSRF protection. We don't use third-party tracking cookies.</p>

<h2>10. Contact</h2>
<p>Privacy concerns? Email our Data Protection Officer at <a href="mailto:dpo@bodhira.com">dpo@bodhira.com</a>.</p>
      </LegalPage>
    </>
  );
}
