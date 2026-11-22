import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { Icon } from "@/components/site/icons";
import { KfFocusResult } from "@/components/site/kit-forms-focus";
import { KfAlert, KfInfoItem, KfInput, KfPhoto, KfRequiredNote, KfSelect, KfTextarea } from "@/components/site/kit-forms-fields";
import { Eyebrow, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, settingResolver, siteMetadata } from "@/lib/site";
import { contactSubmit } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/contact", 'Contact Bodhira.ai · Bring It to Your School');
}

/** Legacy contact.blade.php's details, used when the Web Studio setting is empty. */
const FALLBACK = {
  phone: "+91 99852 52786",
  email: "bodhira.ai.pvt.ltd@gmail.com",
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
 * set (as the CMS contact block does).
 */
export default async function ContactPage() {
  await connection();
  const [img, setting] = await Promise.all([imageResolver(), settingResolver()]);
  const phone = setting("contact.phone", FALLBACK.phone);
  const email = setting("contact.email", FALLBACK.email);
  const address = setting("contact.address", FALLBACK.address);
  const hours = setting("contact.hours", FALLBACK.hours);
  const map = setting("contact.map_embed");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/\s*\n\s*/g, ", "))}`;

  return (
    <div className="bh-page kf-page">
      <SeoSchema path="contact" />

      <PageHero
        eyebrow="Get in touch"
        title="Contact"
        highlight="Us"
        lead="Reach our team to set up a school demo, discuss subject plans, or onboard students."
        breadcrumbs={[{ label: "Contact Us" }]}
      >
        <ul className="bp-chips kf-hero-chips" aria-label="Ways to reach us">
          <li><a className="bp-chip" href={tel}><Icon name="phone" size={16} />{phone}</a></li>
          <li><a className="bp-chip" href={`mailto:${email}`}><Icon name="mail" size={16} />{email}</a></li>
          <li><span className="bp-chip"><Icon name="clock" size={16} />We respond within one business day</span></li>
        </ul>
      </PageHero>

      <section className="bp-section kf-section" aria-labelledby="contact-form-title">
        <div className="bh-container kf-layout">
          <div className="bp-form-card kf-card" id="contact-form" data-reveal>
            <div className="kf-card__head">
              <Eyebrow>Send a message</Eyebrow>
              <h2 id="contact-form-title" className="kf-card__title">Bring Bodhira.ai to Your School</h2>
              <p>Tell us about your school. We&apos;ll set up a walkthrough and help your students get started in a week.</p>
            </div>
            <ContactForm />
          </div>

          <aside className="kf-aside" aria-labelledby="contact-reach">
            <KfPhoto
              src={img(null, "assets/img/pages/forms/contact-support.jpg")}
              alt="A smiling member of the support team answering a call at her desk"
              chip={
                <span className="bp-glass kf-photo__chip">
                  <span className="bp-tile bp-tile--sm bp-tile--solid"><Icon name="clock" size={20} /></span>
                  <span><strong>1 business day</strong><span>Our response time</span></span>
                </span>
              }
            />
            <div className="bp-card kf-reach" data-reveal>
              <h2 id="contact-reach" className="kf-reach__title">Reach Bodhira.ai</h2>
              <p>We respond within one business day.</p>
              <ul className="kf-infos">
                <KfInfoItem icon="phone" title="Phone Number & Email">
                  <a href={tel}>{phone}</a>
                  <a href={`mailto:${email}`}>{email}</a>
                </KfInfoItem>
                <KfInfoItem icon="mapPin" title="Our Office Address">
                  <address className="kf-pre">{address}</address>
                  <a className="bp-link kf-link" href={directions} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps <Icon name="arrowRight" size={16} />
                    <span className="bh-sr-only"> (opens in a new tab)</span>
                  </a>
                </KfInfoItem>
                <KfInfoItem icon="clock" title="Official Work Time">
                  <span className="kf-pre">{hours}</span>
                </KfInfoItem>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {map && (
        <section className="bp-section bp-section--flush-top" aria-label="Map">
          <div className="bh-container">
            <div className="kf-map" data-reveal dangerouslySetInnerHTML={{ __html: map }} />
          </div>
        </section>
      )}

      <section className="bp-section bp-section--cream" aria-labelledby="contact-next">
        <div className="bh-container">
          <SectionHead id="contact-next" eyebrow="What happens next" title="From first message to" highlight="first lesson" align="center" />
          <ol className="kf-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="kf-step" data-reveal>
                <span className="kf-step__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="bp-h3">{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
          <div className="kf-steps__cta" data-reveal>
            <a href="/book-demo" className="bh-btn bh-btn--maroon bh-btn--lg">Book a Demo <Icon name="arrowRight" size={18} /></a>
            <a href="/pricing" className="bh-btn bh-btn--ghost bh-btn--lg">See Pricing</a>
          </div>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}

const SUBJECTS = ["CBSE / ICSE School", "State Board School", "Tuition / Coaching Centre"];
const IDS = { name: "name", email: "email", subject: "subject", message: "message" };

/**
 * Fixed legacy bug: this form posted to /contact-submit without a CSRF token
 * (always 419) and named its first field `fullname`. It now posts through the
 * contactSubmit action like the home page's form, and the subject is saved as
 * its label (legacy's option values were 2, 3, 4).
 */
async function ContactForm() {
  const flash = await getSiteFlash();
  const status = flash.messages?.status;
  const errors = flash.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;
  const old = flash.old ?? {};
  const e = (k: string) => errors[k]?.[0];
  return (
    <>
      {/* key: a new flash remounts these, so each one is cleared and focused */}
      {(status || hasErrors) && <Fragment key={JSON.stringify(flash)}><FlashClear /><KfFocusResult /></Fragment>}
      <KfAlert status={status} errors={errors} fieldIds={IDS} />
      {/* key: remount after a redirect back, so the old input repopulates */}
      <form key={JSON.stringify(old)} action={contactSubmit} className="bp-form kf-form">
        <div className="bp-form__row">
          <KfInput id="name" name="name" type="text" label="Your Name" req icon="user" autoComplete="name" defaultValue={old.name} placeholder="e.g. Priya Sharma" error={e("name")} />
          <KfInput id="email" name="email" type="email" label="Your Email" req icon="mail" autoComplete="email" inputMode="email" defaultValue={old.email} placeholder="you@school.edu.in" error={e("email")} />
        </div>
        <KfSelect id="subject" name="subject" label="Subject" icon="school" placeholder="Select Subject" options={SUBJECTS} defaultValue={old.subject ?? ""} hint="Which best describes your school?" error={e("subject")} />
        <KfTextarea id="message" name="message" label="Message" rows={5} defaultValue={old.message} placeholder="Number of students, classes, boards or anything else we should know." error={e("message")} />
        <div className="kf-submit">
          <button id="submit" className="bh-btn bh-btn--maroon bh-btn--lg" type="submit">Submit Message <Icon name="send" size={18} /></button>
          <KfRequiredNote />
        </div>
      </form>
    </>
  );
}
