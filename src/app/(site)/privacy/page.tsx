import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { LegalPage } from "@/components/site/legal-page";
import { CompanyFacts, GrievanceFacts, Tba, TbaEmail } from "@/components/site/tba";
import { siteMetadata } from "@/lib/site";
import { businessDetails } from "@/lib/site-business";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/privacy", 'Privacy Policy · Bodhira.ai', { description: "The Bodhira.ai Privacy Policy for schools, teachers, students, parents and website visitors." });
}

/** The date this text last changed (shown as "Last updated"). */
const UPDATED = "November 22, 2026";

/**
 * Legacy resources/views/legal/privacy.blade.php; the 2026 design-kit layout
 * (contents list, prose) comes from `LegalPage`. Differences from legacy
 * (not in legacy, 2026-11-22, compliance pass; needs a lawyer's review before
 * launch): rewritten for the DPDP Act 2023 (purposes, consent, rights
 * including nomination, children's data, retention, processors and transfers
 * outside India, breach notice, Grievance Officer, withdrawal of consent);
 * matches what the product does today (the forms' fields, video
 * watermarks, Cloudflare R2 / AWS hosting, analytics only with cookie
 * consent); drops claims the code doesn't back ("AES-256 at rest" for
 * everything, students deleting AI sessions themselves, "no third-party
 * cookies"). Company and grievance details come from the Web Studio settings
 * (`businessDetails()`), with "[to be added]" while empty; the dpo@bodhira.com
 * address is gone (unverified domain). Fixed "Last updated" date instead of
 * today's date.
 */
export default async function PrivacyPage() {
  await connection();
  const b = await businessDetails();
  return (
    <>
      <SeoSchema path="privacy" />
      <LegalPage heading="Privacy Policy" path="/privacy" updated={UPDATED}>
<p>This Privacy Policy explains how <Tba value={b.legalName} /> (&ldquo;{b.siteName}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, shares and protects personal data when you visit our website, fill in one of our forms, or use the {b.siteName} platform and mobile app as a school, teacher, student, parent or administrator. We process personal data in line with India&apos;s Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;) and the rules made under it. Effective date: {UPDATED}.</p>

<h2>1. Who We Are</h2>
<p>We are the Data Fiduciary for the personal data described here, except where a school decides how its students&apos; and staff&apos;s data is used; for that data we also act on the school&apos;s instructions.</p>
<CompanyFacts b={b} />

<h2>2. Data We Collect</h2>
<p><b>When you fill in a form on our website</b> (we ask only for what we need to reply):</p>
<ul>
  <li><b>Contact form and &ldquo;Set up your school&rdquo;:</b> name (or school name), email, the subject you pick and your message.</li>
  <li><b>Book a Demo:</b> name, email, phone, and optionally city, board and a message; for a school also the school name and optionally your designation and number of students; for a student or parent the class/grade and optionally the current school.</li>
  <li><b>Student Registration enquiry:</b> name, email, phone, and optionally city, grade, board, current school and a message.</li>
  <li><b>Newsletter:</b> your email address.</li>
  <li>With each form we also record the time, and for contact messages and newsletter sign-ups your IP address, browser (user agent) and the page you came from, to prevent spam and abuse.</li>
</ul>
<p><b>When you have an account:</b></p>
<ul>
  <li><b>Account data:</b> name, email, phone (optional for self sign-up), username, password (stored only as a hash), role, school, board and grade, and, where your school provides them, date of birth, gender and profile photo; language preference; for parents, the children linked to the account.</li>
  <li><b>Learning data:</b> lessons watched and progress, quiz attempts and scores, assignments and submitted files, attendance, live classes joined, badges, and AI tutor conversations with daily AI usage.</li>
  <li><b>Messages:</b> conversations between parents and teachers, and notifications sent to you.</li>
  <li><b>Payment data:</b> plan, billing cycle, invoices and the payment reference from our payment gateway. Card, UPI and bank details are entered on Razorpay&apos;s or Stripe&apos;s own pages; we never see or store full card numbers.</li>
  <li><b>Technical data:</b> IP address, browser and device information, sign-in times, security logs, and the cookies described in our <a href="/cookies">Cookie Policy</a>.</li>
</ul>

<h2>3. Why We Use It (Purposes)</h2>
<ul>
  <li>To reply to your enquiry, arrange a demo or onboard your school (form data).</li>
  <li>To send the newsletter you asked for (email only; you can unsubscribe at any time).</li>
  <li>To create and run your account and provide the Service: lessons, quizzes, assignments, live classes, progress reports for teachers and parents, and the AI tutor.</li>
  <li>To take payments, issue invoices and keep accounting records.</li>
  <li>To send service messages about your account (for example password resets, assignment and grade notifications).</li>
  <li>To keep the Service secure: preventing spam, fraud and misuse, rate limiting, and protecting lesson videos (watermarking).</li>
  <li>With your permission only: website analytics, to understand how our website is used.</li>
  <li>To meet legal obligations, such as tax records and lawful requests from authorities.</li>
</ul>
<p>We do not sell personal data, and we do not use it for advertising to students.</p>

<h2>4. Legal Basis and Consent</h2>
<p>We process personal data on the basis of your consent (DPDP Act, section 6), which you give by ticking the consent box on our forms or when you create an account, or on the basis of legitimate uses allowed by section 7 (for example, where a school provides its students&apos; data to us to deliver the Service it has asked for, or where the law requires us to keep records). Each form tells you what the details are for. You can withdraw consent at any time (section 10 below); this does not affect processing that took place before you withdrew it.</p>

<h2>5. Children&apos;s Data</h2>
<p>Many of our users are students under 18. Under section 9 of the DPDP Act we process a child&apos;s personal data only with the verifiable consent of a parent or lawful guardian:</p>
<ul>
  <li><b>School accounts:</b> the school collects the parent&apos;s or guardian&apos;s consent through its enrolment process before it creates the student&apos;s account.</li>
  <li><b>Individual sign-up and our forms:</b> a student under 18 must fill these in together with a parent or guardian, who gives the consent. If we learn that we hold a child&apos;s data without that consent, we will delete it or ask the parent or guardian to confirm.</li>
  <li>We do not track or monitor the behaviour of children for advertising, and we do not show targeted advertising to children. Analytics cookies are never set without consent, and they are not used inside student accounts.</li>
  <li>Parents and guardians may exercise all the rights in section 10 on their child&apos;s behalf.</li>
</ul>

<h2>6. AI Tutor</h2>
<p>When a student asks the AI tutor (&ldquo;Ask AI&rdquo;) a question, the question and the recent messages in that conversation are sent to Anthropic, PBC (United States), whose Claude models write the reply. We do not send the student&apos;s name or contact details, so please don&apos;t type personal details into a question. Under Anthropic&apos;s commercial terms, data sent through its API is not used to train its models. We keep the conversation history on our servers so the student can return to it; authorised school and platform staff may review it to support learning and keep the Service safe. AI usage is limited by a daily allowance set by the school or the platform. AI replies can be wrong; see our <a href="/terms">Terms of Service</a>.</p>

<h2>7. Who We Share It With</h2>
<p>We share personal data only as needed for the purposes above:</p>
<ul>
  <li><b>Your school</b>, for users it has enrolled (its administrators and teachers), and <b>linked parents</b>, who see their child&apos;s progress.</li>
  <li><b>Service providers (Data Processors)</b> acting on our instructions under contract:
    <ul>
      <li>Amazon Web Services (application servers and database) and Cloudflare (website delivery, security and file storage on Cloudflare R2; lesson videos are streamed from our own storage on Cloudflare R2, with the viewer&apos;s email shown as a watermark on the video);</li>
      <li>Anthropic (AI tutor, see section 6);</li>
      <li>Razorpay and Stripe (payments);</li>
      <li>our email delivery provider (account and service emails);</li>
      <li>only if you accept analytics cookies: Google (Google Analytics / Tag Manager) and, if we use it, Meta (Facebook Pixel). Our website&apos;s fonts and icons are served from our own servers, so no font or icon provider receives your IP address.</li>
    </ul>
  </li>
  <li><b>Authorities</b>, when the law requires it.</li>
  <li><b>A buyer or successor</b>, if our business is merged or sold, under the same protections.</li>
</ul>

<h2>8. Transfers Outside India</h2>
<p>Some of our providers process data outside India (for example Anthropic and Stripe in the United States, and the global networks of Cloudflare and AWS). Section 16 of the DPDP Act allows this except to countries the Government of India restricts by notification; we will not transfer data to such a country. Our providers are bound by contract to protect the data.</p>

<h2>9. How Long We Keep It</h2>
<ul>
  <li><b>Form enquiries and demo requests:</b> until we have dealt with your request and any follow-up, then deleted, unless you become a customer.</li>
  <li><b>Newsletter:</b> until you unsubscribe or withdraw consent.</li>
  <li><b>Accounts and learning data:</b> while the account is active, and for up to 12 months after it is closed (for example for school records and disputes), then deleted or anonymised. A school may ask us to delete its students&apos; data sooner.</li>
  <li><b>Invoices and payment records:</b> as long as tax and accounting laws require (generally 8 years).</li>
  <li><b>Security logs:</b> for a limited period, as needed to protect the Service and as the law requires.</li>
</ul>
<p>Anonymised statistics that can no longer identify anyone may be kept longer.</p>

<h2>10. Your Rights</h2>
<p>Under the DPDP Act you (or, for a child, the parent or guardian) have the right to:</p>
<ul>
  <li><b>Access</b> a summary of the personal data we process about you, the processing we do, and who we have shared it with (section 11).</li>
  <li><b>Correct, complete or update</b> inaccurate or incomplete data (section 12). Many details can be changed on your profile page.</li>
  <li><b>Erase</b> your data when it is no longer needed or when you withdraw consent, unless the law requires us to keep it (section 12).</li>
  <li><b>Withdraw consent</b> at any time, as easily as you gave it (section 6(4)): unsubscribe from the newsletter by emailing us, choose &ldquo;Only necessary&rdquo; in <a href="/cookies">Cookie settings</a>, or email the Grievance Officer to withdraw consent for anything else. Withdrawing consent for account data may mean we can no longer provide the Service to you.</li>
  <li><b>Grievance redressal</b>: complain to our Grievance Officer (section 13), and, if you are not satisfied with our reply, to the Data Protection Board of India.</li>
  <li><b>Nominate</b> another person to exercise your rights if you die or become unable to do so (section 14). Tell the Grievance Officer whom you nominate.</li>
</ul>
<p>To use any of these rights, email the Grievance Officer from the email address on your account (or tell us which school account it concerns). We may need to confirm your identity, or that you are the parent or guardian, before acting. We aim to reply within 30 days, and always within the time the DPDP rules require. School-managed accounts: we may pass your request to your school and act on its instructions.</p>

<h2>11. Security</h2>
<ul>
  <li>All traffic to the website, app and API is encrypted with HTTPS.</li>
  <li>Passwords are stored only as bcrypt hashes; sign-in cookies are HttpOnly, Secure and SameSite=Lax.</li>
  <li>Role-based access on every request: users see only their own, their school&apos;s or their linked child&apos;s data.</li>
  <li>Private files (assignments, submissions, photos) are stored on Cloudflare R2, which encrypts them at rest, and open only through short-lived signed links.</li>
  <li>Lesson videos are encrypted, watermarked and streamed from our own storage on Cloudflare R2.</li>
  <li>Rate limits and logging help us detect misuse.</li>
</ul>
<p>No system is perfectly secure. If a personal data breach occurs, we will inform the Data Protection Board of India and the affected users as the DPDP Act requires.</p>

<h2>12. Cookies</h2>
<p>We use necessary cookies to sign you in, remember your language and show form results, and analytics cookies only if you choose &ldquo;Accept all&rdquo;. The full list, and how to change your choice, is in our <a href="/cookies">Cookie Policy</a>.</p>

<h2>13. Grievance Officer and Contact</h2>
<p>For questions about this policy, to use your rights, or to make a complaint, contact our Grievance Officer:</p>
<GrievanceFacts b={b} />
<p>General enquiries: <TbaEmail value={b.email} />.</p>

<h2>14. Changes to This Policy</h2>
<p>We may update this policy when our Service or the law changes. We will change the &ldquo;Last updated&rdquo; date above and, for significant changes, tell account holders by email or in the app before the change applies.</p>
      </LegalPage>
    </>
  );
}
