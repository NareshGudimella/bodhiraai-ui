import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { Icon } from "@/components/site/icons";
import { KfFocusResult } from "@/components/site/kit-forms-focus";
import { KfAlert, KfInput, KfPhoto, KfRequiredNote, KfSelect, KfTextarea } from "@/components/site/kit-forms-fields";
import { CheckList, Eyebrow } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, settingResolver, siteMetadata } from "@/lib/site";
import { enquiryStore } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { SITE_STATS } from "@/lib/site-stats";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/student-registration", "Student Registration — Bodhira.ai");
}

/** Why learn with Bodhira.ai: the homepage FAQ's answers, shortened. not in legacy */
const BENEFITS = [
  "Video lessons broken down by subject, lesson and topic",
  "A short quiz after each lesson shows what you've understood",
  "“Ask AI” explains a lesson in your own words",
  "Parents follow lessons watched, quiz scores and attendance",
  "Study in any browser or the Bodhira mobile app, in English, Hindi and Telugu",
];

/**
 * Legacy PageController::enquiryForm (student-registration.blade.php),
 * redesigned in 2026 with the page design kit (not in legacy;
 * docs/site-design-kit.md). Same form (enquiryStore action; name, email,
 * phone, city, grade, board, school_name, message with the same option values
 * and `required` attributes), same `status` flash and old input. New: split
 * layout with a photo (public/assets/img/pages/forms/CREDITS.md), labels and
 * per-field errors, a benefits list (homepage FAQ copy), the support phone
 * from the `contact.phone` setting and counts from SITE_STATS.
 */
export default function StudentRegistrationPage() {
  return (
    <div className="bh-page kf-page">
      <SeoSchema path="student-registration" />
      <PageHero
        eyebrow="Student Registration"
        title="Interested in learning with"
        highlight="Bodhira.ai?"
        lead="Fill in your details below and our team will get in touch to help you get started."
        breadcrumbs={[{ label: "Student Registration" }]}
      >
        <ul className="bp-chips kf-hero-chips" aria-label="Bodhira.ai in numbers">
          <li><span className="bp-chip"><Icon name="users" size={16} />{SITE_STATS.students.label} students</span></li>
          <li><span className="bp-chip"><Icon name="heart" size={16} />{SITE_STATS.parents.label} parents</span></li>
          <li><span className="bp-chip"><Icon name="bookOpen" size={16} />{SITE_STATS.subjects.label} subjects</span></li>
        </ul>
      </PageHero>

      <section className="bp-section kf-section" aria-labelledby="registration-form-title">
        <div className="bh-container kf-layout">
          <div className="bp-form-card kf-card" id="registration-form" data-reveal>
            <div className="kf-card__head">
              <Eyebrow>Your details</Eyebrow>
              <h2 id="registration-form-title" className="kf-card__title">Student Registration</h2>
              <p>Our team will get in touch to help you get started.</p>
            </div>
            <WithFlash />
          </div>
          <Aside />
        </div>
      </section>
      <RevealOnScroll />
    </div>
  );
}

async function Aside() {
  await connection();
  const [img, setting] = await Promise.all([imageResolver(), settingResolver()]);
  const phone = setting("contact.phone", "+91 99852 52786");
  return (
    <aside className="kf-aside" aria-labelledby="registration-why">
      <KfPhoto
        src={img(null, "assets/img/pages/forms/registration-family.jpg")}
        alt="A mother and her daughter reading a book together on the sofa at home"
        chip={
          <span className="bp-glass kf-photo__chip">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><Icon name="heart" size={20} /></span>
            <span><strong>{SITE_STATS.parents.label} parents</strong><span>Following their child&rsquo;s progress</span></span>
          </span>
        }
      />
      <div className="bp-card kf-benefits" data-reveal>
        <h2 id="registration-why" className="kf-side-title">Why students learn with Bodhira.ai</h2>
        <p>Lessons are understood, not memorized.</p>
        <CheckList items={BENEFITS} />
      </div>
      <div className="kf-help bp-on-dark" data-reveal>
        <span className="bp-tile bp-tile--sm bp-tile--light"><Icon name="phone" size={20} /></span>
        <div>
          <span className="kf-help__label">Questions? Call us</span>
          <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a>
        </div>
      </div>
    </aside>
  );
}

const IDS = { name: "reg-name", email: "reg-email", phone: "reg-phone", city: "reg-city", grade: "reg-grade", board: "reg-board", school_name: "reg-school", message: "reg-message" };

/** Status, errors and old input flashed by the last submit. */
async function WithFlash() {
  await connection();
  const flash = await getSiteFlash();
  const status = flash.messages?.status;
  const errors = flash.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;
  return (
    <>
      {/* key: a new flash remounts these, so each one is cleared and focused */}
      {(status || hasErrors) && <Fragment key={JSON.stringify(flash)}><FlashClear /><KfFocusResult /></Fragment>}
      <KfAlert status={status} errors={errors} fieldIds={IDS} />
      <EnquiryForm key={JSON.stringify(flash.old ?? {})} old={flash.old ?? {}} errors={errors} />
    </>
  );
}

const GRADES = Array.from({ length: 12 }, (_, i) => String(i + 1)).map((g): [string, string] => [g, `Grade ${g}`]);
const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"];

function EnquiryForm({ old, errors }: { old: Record<string, string>; errors: Record<string, string[]> }) {
  const e = (k: string) => errors[k]?.[0];
  return (
    <form action={enquiryStore} className="bp-form kf-form">
      <div className="bp-form__row">
        <KfInput id={IDS.name} name="name" type="text" label="Student Full Name" req required icon="user" autoComplete="name" defaultValue={old.name} placeholder="e.g. Aarav Kumar" error={e("name")} />
        <KfInput id={IDS.email} name="email" type="email" label="Email Address" req required icon="mail" autoComplete="email" inputMode="email" defaultValue={old.email} placeholder="you@example.com" error={e("email")} />
      </div>
      <div className="bp-form__row">
        <KfInput id={IDS.phone} name="phone" type="text" label="Phone Number" req required icon="phone" autoComplete="tel" inputMode="tel" defaultValue={old.phone} placeholder="+91 98765 43210" hint="A parent's number is fine." error={e("phone")} />
        <KfInput id={IDS.city} name="city" type="text" label="City" icon="mapPin" autoComplete="address-level2" defaultValue={old.city} placeholder="e.g. Vijayawada" error={e("city")} />
      </div>
      <div className="bp-form__row">
        <KfSelect id={IDS.grade} name="grade" label="Grade / Class" icon="cap" placeholder="Select Grade / Class" options={GRADES} defaultValue={old.grade ?? ""} error={e("grade")} />
        <KfSelect id={IDS.board} name="board" label="Board" icon="bookOpen" placeholder="Select Board" options={BOARDS} defaultValue={old.board ?? ""} error={e("board")} />
      </div>
      <KfInput id={IDS.school_name} name="school_name" type="text" label="Current School" icon="school" defaultValue={old.school_name} placeholder="Optional" error={e("school_name")} />
      <KfTextarea id={IDS.message} name="message" label="Anything you'd like us to know?" rows={5} defaultValue={old.message} placeholder="Optional: subjects you need help with, a good time to call…" error={e("message")} />
      <div className="kf-submit">
        <button className="bh-btn bh-btn--maroon bh-btn--lg" type="submit">Submit Registration <Icon name="arrowRight" size={18} /></button>
        <KfRequiredNote />
      </div>
    </form>
  );
}
