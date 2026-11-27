import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { Icon } from "@/components/site/icons";
import { KfFocusResult } from "@/components/site/kit-forms-focus";
import {
  KF_FOCUS_A, KF_FORM, KF_INFO_LINK, KF_P, KF_PAGE, KF_ROW, KF_SUBMIT_BTN, KfAlert, KfAside, KfChip, KfConsent, KfFormCard, KfHeroChips,
  KfInfoItem, KfInput, KfLayout, KfPhoto, KfSelect, KfSideCard, KfSubmit, KfTextarea, kfBtnLink, kfSection,
} from "@/components/site/kit-forms-fields";
import { SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { Tba } from "@/components/site/tba";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { cx } from "@/components/site/ui";
import { imageResolver, settingResolver, siteMetadata } from "@/lib/site";
import { businessDetails, CONTACT_FALLBACK } from "@/lib/site-business";
import { contactSubmit } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { sanitizeMap } from "@/lib/sanitize-html";
import { L, NAME_PATTERN, NAME_TITLE, emailProps } from "@/lib/input-limits";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/contact", 'Contact Bodhira.ai · Bring It to Your School');
}

/** Legacy contact.blade.php's details, used when the Web Studio setting is empty. */
const FALLBACK = {
  ...CONTACT_FALLBACK,
  address: "Plot No. 1438, 3rd Floor, Apuroopa Township,\nPragathi Nagar, Bachupally PO, Rangareddi,\nAndhra Pradesh – 500090",
  hours: "Monday – Friday: 09:30 – 18:30\nSaturday: 10:00 – 14:00 · Sunday: Closed",
};

/** Homepage FAQ copy ("How does our school get started?"), as steps. not in legacy */
const STEPS: [string, string][] = [
  ["Request a walkthrough", "Tell us about your school with the form above, or book a demo. We respond within one business day."],
  ["We set up your school", "We set up your school and its School Admin account, and help your students get started in a week."],
  ["Your admin adds everyone", "The admin adds teachers, students and parents, creates classes and chooses which Bodhira.ai curricula the school uses."],
];

/**
 * Legacy resources/views/contact.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same form (contactSubmit
 * action; fields name, email, subject, message; same ids), same flash status
 * and old input, same copy. New: split layout with a photo
 * (public/assets/img/pages/forms/CREDITS.md), labels, per-field errors and an
 * error list that links to the fields, a "what happens next" strip (homepage
 * FAQ copy) and a Google Maps link. Differences from legacy: phone, email,
 * address and hours come from the Web Studio contact settings (`contact.phone`,
 * `contact.email`, `contact.address`, `contact.hours`; legacy hard-coded them,
 * kept as fallbacks), and `contact.map_embed` is shown under the details when
 * set (as the CMS contact block does). Compliance pass (not in legacy,
 * 2026-11-22): a required consent checkbox with a notice of purpose
 * (`KfConsent`, checked again in contactSubmit), and the company name and
 * registered office from the settings (`company.*`, "[to be added]" while
 * empty). Tailwind since the migration's phase 2 (was `.bh-page` + `kf-*`).
 */
export default async function ContactPage() {
  await connection();
  const [img, setting, biz] = await Promise.all([imageResolver(), settingResolver(), businessDetails()]);
  const phone = setting("contact.phone", FALLBACK.phone);
  const email = setting("contact.email", FALLBACK.email);
  // One address: the registered office when set, else the contact address (not in legacy).
  const address = biz.address || setting("contact.address", FALLBACK.address);
  const hours = setting("contact.hours", FALLBACK.hours);
  const map = setting("contact.map_embed");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s*\n\s*/g, ", "))}`;

  return (
    <div className={KF_PAGE}>
      <SeoSchema path="contact" />

      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        highlight="Us"
        lead="Reach our team to set up a school demo, discuss subject plans, or onboard students."
        breadcrumbs={[{ label: "Contact Us" }]}
      >
        <KfHeroChips label="Ways to reach us">
          <KfChip icon="phone" href={tel}>{phone}</KfChip>
          <KfChip icon="mail" href={`mailto:${email}`}>{email}</KfChip>
          <KfChip icon="clock">We respond within one business day</KfChip>
        </KfHeroChips>
      </PageHero>

      <section className={kfSection({ flushTop: true })} aria-labelledby="contact-form-title">
        <KfLayout>
          <KfFormCard
            id="contact-form"
            eyebrow="Send a message"
            titleId="contact-form-title"
            title="Bring Bodhira.ai to Your School"
            intro={<>Tell us about your school. We&apos;ll set up a walkthrough and help your students get started in a week.</>}
          >
            <ContactForm />
          </KfFormCard>

          <KfAside labelledBy="contact-reach">
            <KfPhoto
              src={img(null, "assets/img/pages/forms/contact-support.jpg")}
              alt="A smiling member of the support team answering a call at her desk"
              chip={{ icon: "clock", title: "1 business day", text: "Our response time" }}
            />
            <KfSideCard titleId="contact-reach" title="Reach Bodhira.ai" intro="We respond within one business day." introMargin="mb-6">
              <ul className="m-0 grid list-none gap-5 p-0">
                <KfInfoItem icon="phone" title="Phone Number & Email">
                  <a className={KF_INFO_LINK} href={tel}>{phone}</a>
                  <a className={KF_INFO_LINK} href={`mailto:${email}`}>{email}</a>
                </KfInfoItem>
                <KfInfoItem icon="mapPin" title="Our Office Address">
                  <address className="m-0 whitespace-pre-line not-italic">{address}</address>
                  <a
                    className={cx("mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-bold text-wine hover:text-wine [&_.bh-icon]:transition-transform [&_.bh-icon]:duration-200 [&_.bh-icon]:ease-bh hover:[&_.bh-icon]:translate-x-[3px]", KF_FOCUS_A)}
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps <Icon name="arrowRight" size={16} />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </KfInfoItem>
                {/* Company name and CIN from the settings (not in legacy, 2026-11-22); the address is above. */}
                <KfInfoItem icon="school" title="Company">
                  <span><Tba value={biz.legalName} /></span>
                  {biz.cin && <span>CIN: {biz.cin}</span>}
                </KfInfoItem>
                <KfInfoItem icon="clock" title="Official Work Time">
                  <span className="whitespace-pre-line">{hours}</span>
                </KfInfoItem>
              </ul>
            </KfSideCard>
          </KfAside>
        </KfLayout>
      </section>

      {map && (
        <section className={kfSection({ flushTop: true })} aria-label="Map">
          <div className="site-container">
            <div
              className="overflow-hidden rounded-xl border border-line bg-cream-2 shadow-md [&_iframe]:block [&_iframe]:h-[420px] [&_iframe]:w-full! [&_iframe]:border-0 max-sm:[&_iframe]:h-[320px]"
              data-reveal
              dangerouslySetInnerHTML={{ __html: sanitizeMap(map) }}
            />
          </div>
        </section>
      )}

      <section className={kfSection({ cream: true })} aria-labelledby="contact-next">
        <div className="site-container">
          <SectionHead id="contact-next" eyebrow="What happens next" title="From first message to" highlight="first lesson" align="center" />
          {/* Left-aligned when it narrows to 640px: legacy `.bh-page ol { margin: 0 }` outranked the list's `margin-inline: auto`. */}
          <ol className="m-0 grid list-none grid-cols-3 gap-6 p-0 *:min-w-0 max-lg:max-w-[640px] max-lg:grid-cols-1">
            {STEPS.map(([t, d], i) => (
              <li
                key={t}
                className="relative rounded-lg border border-line bg-white p-8 shadow-sm max-lg:grid max-lg:grid-cols-[auto_1fr] max-lg:gap-x-5 max-sm:gap-x-4 max-sm:p-6"
                data-reveal
              >
                <span
                  className="mb-5 inline-grid h-12 w-12 place-items-center rounded-[14px] bg-grad-maroon text-base font-extrabold tracking-[-.01em] text-white max-lg:row-span-2 max-lg:m-0 max-sm:h-10 max-sm:w-10 max-sm:text-[14px]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 mb-2 font-sans text-[22px] leading-[1.3] font-bold tracking-[-.02em] text-ink transition-none max-lg:text-[20px]">{t}</h3>
                <p className={cx("m-0 text-[15.5px]", KF_P.replace(" text-base", ""))}>{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap justify-center gap-3" data-reveal>
            <a href="/book-demo" className={kfBtnLink("maroon")}>Book a Demo <Icon name="arrowRight" size={18} /></a>
            <a href="/pricing" className={kfBtnLink("ghost")}>See Pricing</a>
          </div>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}

const SUBJECTS = ["CBSE / ICSE School", "State Board School", "Tuition / Coaching Centre"];
const IDS = { name: "name", email: "email", subject: "subject", message: "message", consent: "contact-consent" };

/**
 * Fixed legacy bug: this form posted to /contact-submit without a CSRF token
 * (always 419) and named its first field `fullname`. It now posts through the
 * contactSubmit action like the home page's form, and the subject is saved as
 * its label (legacy's option values were 2, 3, 4).
 */
async function ContactForm() {
  const flash = await getSiteFlash();
  const status = flash.messages?.status;
  // Not the footer newsletter's errors (its own bag).
  const errors = flash.bag ? {} : flash.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;
  const old = flash.bag ? {} : flash.old ?? {};
  const e = (k: string) => errors[k]?.[0];
  return (
    <>
      {/* key: a new flash remounts these, so each one is cleared and focused */}
      {(status || hasErrors) && <Fragment key={JSON.stringify(flash)}><FlashClear /><KfFocusResult /></Fragment>}
      <KfAlert status={status} errors={errors} fieldIds={IDS} />
      {/* key: remount after a redirect back, so the old input repopulates */}
      <form key={JSON.stringify(old)} action={contactSubmit} className={KF_FORM}>
        <div className={KF_ROW}>
          <KfInput id="name" name="name" type="text" label="Your Name" req required maxLength={L.nameLead} pattern={NAME_PATTERN} title={NAME_TITLE} icon="user" autoComplete="name" defaultValue={old.name} placeholder="e.g. Priya Sharma" error={e("name")} />
          <KfInput id="email" name="email" label="Your Email" req required {...emailProps(L.emailLead)} icon="mail" defaultValue={old.email} placeholder="you@school.edu.in" error={e("email")} />
        </div>
        <KfSelect id="subject" name="subject" label="Subject" icon="school" placeholder="Select Subject" options={SUBJECTS} defaultValue={old.subject ?? ""} hint="Which best describes your school?" error={e("subject")} />
        <KfTextarea id="message" name="message" label="Message" rows={5} maxLength={5000} defaultValue={old.message} placeholder="Number of students, classes, boards or anything else we should know." error={e("message")} />
        <KfConsent
          id={IDS.consent}
          checked={old.consent === "1"}
          error={e("consent")}
          purpose="We use these details only to reply to your message and, if you ask, to set up a walkthrough for your school. We don't add you to any mailing list."
        />
        <KfSubmit>
          <button id="submit" className={KF_SUBMIT_BTN} type="submit">Submit Message <Icon name="send" size={18} /></button>
        </KfSubmit>
      </form>
    </>
  );
}
