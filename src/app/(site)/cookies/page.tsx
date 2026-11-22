import type { Metadata } from "next";
import { connection } from "next/server";
import { CookieSettingsButton } from "@/components/site/cookie-consent";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn } from "@/components/site/ui";
import { LegalPage } from "@/components/site/legal-page";
import { GrievanceFacts } from "@/components/site/tba";
import { siteMetadata } from "@/lib/site";
import { businessDetails } from "@/lib/site-business";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/cookies", "Cookie Policy · Bodhira.ai", {
    description: "Which cookies the Bodhira.ai website and platform use, why, for how long, and how to change your choice.",
  });
}

const UPDATED = "November 22, 2026";

/*
 * The cookie tables (were `.bp-table-wrap` / `.bp-table`, Tailwind since the migration's phase 2).
 * Inside the legal prose, whose table rules (site-blog.css) set the cells' padding, borders and
 * header colours; these add the rest.
 */
const TABLE_WRAP = "overflow-x-auto rounded-lg border border-line bg-white shadow-xs";
const TABLE = "w-full border-collapse text-[15px] text-body";
const TH = "text-[13px] font-bold tracking-[.04em] whitespace-nowrap uppercase";
const TBODY = "[&>tr:hover>td]:bg-[#FFFCF8]";

/** [name, purpose, lifetime] — the cookies this app sets itself (src/lib/session.ts, i18n.ts, flash.ts, site-flash.ts, cookie-consent.tsx). */
const NECESSARY: [string, string, string][] = [
  ["bodhira_token", "Keeps you signed in (a random sign-in token; HttpOnly, not readable by scripts).", "30 days, or until you sign out"],
  ["bodhira_role", "Sends you to the right dashboard after sign-in. Not used to grant access.", "30 days, or until you sign out"],
  ["bodhira_locale", "Remembers the language you picked (English, Hindi or Telugu).", "Until you close the browser"],
  ["bodhira_flash, bodhira_site_flash", "Shows a one-time message after a form is sent (for example “Thanks, we received your message” or what to correct).", "60 seconds"],
  ["bh_consent", "Remembers your cookie choice (“all” or “necessary”).", "1 year"],
];

/** Set only after “Accept all”, and only when the tag is configured in the Web Studio (Settings → SEO & Analytics). */
const ANALYTICS: [string, string, string, string][] = [
  ["Google Analytics", "_ga, _ga_<ID>", "Counts visits and shows which pages are used, so we can improve the website.", "Up to 2 years"],
  ["Google Tag Manager", "(none of its own)", "Loads the analytics tags above.", "—"],
  ["Meta (Facebook) Pixel", "_fbp", "Measures visits from our Facebook / Instagram posts. Only if we enable it; never inside student accounts.", "Up to 3 months"],
];

/**
 * Cookie Policy (not in legacy, 2026-11-22, compliance pass; needs a lawyer's
 * review before launch). Lists the cookies the app sets (checked against the
 * code), the consent-gated analytics tags from the Web Studio SEO settings,
 * and third parties' own cookies; "Cookie settings" reopens the banner
 * (`CookieConsent`), which stores `bh_consent`.
 */
export default async function CookiesPage() {
  await connection();
  const b = await businessDetails();
  return (
    <>
      <SeoSchema path="cookies" />
      <LegalPage heading="Cookie Policy" path="/cookies" updated={UPDATED}>
<p>This Cookie Policy explains which cookies {b.siteName} uses on this website, the platform and its dashboards, why, and how you can change your choice. It complements our <a href="/privacy">Privacy Policy</a>.</p>

<h2>1. What Cookies Are</h2>
<p>Cookies are small text files a website stores in your browser. Some are needed for the site to work (for example to keep you signed in); others, such as analytics cookies, are optional and are only used if you agree.</p>

<h2>2. Your Choice</h2>
<p>When you first visit, a banner asks you to choose <b>Accept all</b> (necessary and analytics cookies) or <b>Only necessary</b>. Until you choose, and if you choose &ldquo;Only necessary&rdquo;, we do not load analytics. You can change your mind at any time:</p>
<p><CookieSettingsButton className={btn("maroon", "md", "focus-visible:outline-maroon!")}>Open cookie settings</CookieSettingsButton></p>
<p>You can also delete cookies or block them in your browser settings. Blocking necessary cookies will stop sign-in and forms from working.</p>

<h2>3. Necessary Cookies</h2>
<p>These are set by {b.siteName} itself and are needed to provide the Service you ask for, so they don&apos;t need consent. None of them is used for advertising.</p>
<div className={TABLE_WRAP}>
  <table className={TABLE}>
    <thead><tr><th scope="col" className={TH}>Cookie</th><th scope="col" className={TH}>Purpose</th><th scope="col" className={TH}>Kept for</th></tr></thead>
    <tbody className={TBODY}>
      {NECESSARY.map(([name, purpose, life]) => (
        <tr key={name}><td className="align-top"><code>{name}</code></td><td className="align-top">{purpose}</td><td className="align-top">{life}</td></tr>
      ))}
    </tbody>
  </table>
</div>
<p>The dashboards also store your display preferences (light or dark theme, card style) in your browser&apos;s local storage. They never leave your device.</p>

<h2>4. Analytics Cookies (Only With Your Consent)</h2>
<p>Only if you choose &ldquo;Accept all&rdquo;, and only on the public website (never inside student, teacher or parent dashboards):</p>
<div className={TABLE_WRAP}>
  <table className={TABLE}>
    <thead><tr><th scope="col" className={TH}>Provider</th><th scope="col" className={TH}>Cookies</th><th scope="col" className={TH}>Purpose</th><th scope="col" className={TH}>Kept for</th></tr></thead>
    <tbody className={TBODY}>
      {ANALYTICS.map(([who, names, purpose, life]) => (
        <tr key={who}><td className="align-top">{who}</td><td className="align-top"><code>{names}</code></td><td className="align-top">{purpose}</td><td className="align-top">{life}</td></tr>
      ))}
    </tbody>
  </table>
</div>
<p>We do not use cookies to track children or to show them targeted advertising.</p>

<h2>5. Third-Party Services</h2>
<p>Some features are provided by other companies, which may set their own cookies or similar storage under their own policies when you use that feature:</p>
<ul>
  <li><b>Payments</b>: Razorpay and Stripe, on their checkout pages and windows, for security and fraud prevention.</li>
  <li><b>Lesson videos</b>: VdoCipher&apos;s video player.</li>
  <li><b>Overview videos</b>: YouTube, when you play a video on our About page.</li>
  <li><b>Security</b>: Cloudflare, which protects our website, may set a short-lived security cookie (for example to tell people from bots).</li>
</ul>

<h2>6. Changes and Contact</h2>
<p>We update this policy when we add or remove cookies, and change the &ldquo;Last updated&rdquo; date above. Questions? Contact our Grievance Officer:</p>
<GrievanceFacts b={b} />
      </LegalPage>
    </>
  );
}
