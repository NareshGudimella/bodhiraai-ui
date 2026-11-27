import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { Icon } from "@/components/site/icons";
import { KfFocusResult } from "@/components/site/kit-forms-focus";
import {
  KF_FORM, KF_PAGE, KF_ROW, KF_SUBMIT_BTN, KfAlert, KfAside, KfChip, KfConsent, KfFormCard, KfHelp, KfHeroChips, KfInput, KfLayout, KfPhoto,
  KfSelect, KfSideCard, KfSubmit, KfTextarea, kfSection,
} from "@/components/site/kit-forms-fields";
import { CheckList } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, settingResolver, siteMetadata } from "@/lib/site";
import { enquiryStore } from "@/lib/site-actions";
import { getSiteFlash } from "@/lib/site-flash";
import { SITE_STATS } from "@/lib/site-stats";
import { L, NAME_PATTERN, NAME_TITLE, emailProps, phoneProps } from "@/lib/input-limits";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/student-registration", "Student Registration — Bodhira.ai", {
    description: "Interested in learning with Bodhira.ai? Fill in your details and our team will get in touch to help you get started.",
  });
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
 * from the `contact.phone` setting and counts from SITE_STATS. Compliance
 * pass (not in legacy, 2026-11-22): a required consent checkbox with a notice
 * of purpose and a parent/guardian statement (`KfConsent`; enquiryStore
 * checks `consent=1`). Tailwind since the migration's phase 2
 * (kit-forms-fields.tsx).
 */
export default function StudentRegistrationPage() {
  return (
    <div className={KF_PAGE}>
      <SeoSchema path="student-registration" />
      <PageHero
        eyebrow="Student Registration"
        title="Interested in learning with"
        highlight="Bodhira.ai?"
        lead="Fill in your details below and our team will get in touch to help you get started."
        breadcrumbs={[{ label: "Student Registration" }]}
      >
        <KfHeroChips label="Bodhira.ai in numbers">
          <KfChip icon="users">{SITE_STATS.students.label} students</KfChip>
          <KfChip icon="heart">{SITE_STATS.parents.label} parents</KfChip>
          <KfChip icon="bookOpen">{SITE_STATS.subjects.label} subjects</KfChip>
        </KfHeroChips>
      </PageHero>

      <section className={kfSection({ flushTop: true })} aria-labelledby="registration-form-title">
        <KfLayout>
          <KfFormCard id="registration-form" eyebrow="Your details" titleId="registration-form-title" title="Student Registration" intro="Our team will get in touch to help you get started.">
            <WithFlash />
          </KfFormCard>
          <Aside />
        </KfLayout>
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
    <KfAside labelledBy="registration-why">
      <KfPhoto
        src={img(null, "assets/img/pages/forms/registration-family.jpg")}
        alt="A mother and her daughter reading a book together on the sofa at home"
        chip={{ icon: "heart", title: <>{SITE_STATS.parents.label} parents</>, text: <>Following their child&rsquo;s progress</> }}
      />
      <KfSideCard titleId="registration-why" title="Why students learn with Bodhira.ai" intro="Lessons are understood, not memorized." introMargin="mb-5">
        <CheckList items={BENEFITS} gap="gap-3.5" />
      </KfSideCard>
      <KfHelp label="Questions? Call us" phone={phone} />
    </KfAside>
  );
}

const IDS = { name: "reg-name", email: "reg-email", phone: "reg-phone", city: "reg-city", grade: "reg-grade", board: "reg-board", school_name: "reg-school", message: "reg-message", consent: "reg-consent" };

/** Status, errors and old input flashed by the last submit. */
async function WithFlash() {
  await connection();
  const flash = await getSiteFlash();
  const status = flash.messages?.status;
  // Not the footer newsletter's errors (its own bag).
  const errors = flash.bag ? {} : flash.errors ?? {};
  const old = flash.bag ? {} : flash.old ?? {};
  const hasErrors = Object.keys(errors).length > 0;
  return (
    <>
      {/* key: a new flash remounts these, so each one is cleared and focused */}
      {(status || hasErrors) && <Fragment key={JSON.stringify(flash)}><FlashClear /><KfFocusResult /></Fragment>}
      <KfAlert status={status} errors={errors} fieldIds={IDS} />
      <EnquiryForm key={JSON.stringify(old)} old={old} errors={errors} />
    </>
  );
}

const GRADES = Array.from({ length: 12 }, (_, i) => String(i + 1)).map((g): [string, string] => [g, `Grade ${g}`]);
const BOARDS = ["CBSE", "ICSE", "State Board", "IB", "Cambridge", "Other"];

function EnquiryForm({ old, errors }: { old: Record<string, string>; errors: Record<string, string[]> }) {
  const e = (k: string) => errors[k]?.[0];
  return (
    <form action={enquiryStore} className={KF_FORM}>
      <div className={KF_ROW}>
        <KfInput id={IDS.name} name="name" type="text" label="Student Full Name" req required maxLength={L.name} pattern={NAME_PATTERN} title={NAME_TITLE} icon="user" autoComplete="name" defaultValue={old.name} placeholder="e.g. Aarav Kumar" error={e("name")} />
        <KfInput id={IDS.email} name="email" label="Email Address" req required {...emailProps(L.email)} icon="mail" defaultValue={old.email} placeholder="you@example.com" error={e("email")} />
      </div>
      <div className={KF_ROW}>
        <KfInput id={IDS.phone} name="phone" label="Phone Number" req required {...phoneProps()} icon="phone" defaultValue={old.phone} placeholder="9876543210" hint="10-digit mobile number. A parent's number is fine." error={e("phone")} />
        <KfInput id={IDS.city} name="city" type="text" label="City" maxLength={L.city} icon="mapPin" autoComplete="address-level2" defaultValue={old.city} placeholder="e.g. Vijayawada" error={e("city")} />
      </div>
      <div className={KF_ROW}>
        <KfSelect id={IDS.grade} name="grade" label="Grade / Class" icon="cap" placeholder="Select Grade / Class" options={GRADES} defaultValue={old.grade ?? ""} error={e("grade")} />
        <KfSelect id={IDS.board} name="board" label="Board" icon="bookOpen" placeholder="Select Board" options={BOARDS} defaultValue={old.board ?? ""} error={e("board")} />
      </div>
      <KfInput id={IDS.school_name} name="school_name" type="text" label="Current School" maxLength={L.organization} icon="school" defaultValue={old.school_name} placeholder="Optional" error={e("school_name")} />
      <KfTextarea id={IDS.message} name="message" label="Anything you'd like us to know?" rows={5} maxLength={2000} defaultValue={old.message} placeholder="Optional: subjects you need help with, a good time to call…" error={e("message")} />
      <KfConsent
        id={IDS.consent}
        checked={old.consent === "1"}
        error={e("consent")}
        purpose="We use these details only to contact you about learning with Bodhira.ai and to help you get started. We don't add you to any mailing list."
        minor="If the student is under 18, a parent or guardian must fill in this form and give consent."
      >
        , and I am the student&apos;s parent or guardian or am 18 or older. I agree to Bodhira.ai using these details for the purpose above.
      </KfConsent>
      <KfSubmit>
        <button className={KF_SUBMIT_BTN} type="submit">Submit Registration <Icon name="arrowRight" size={18} /></button>
      </KfSubmit>
    </form>
  );
}
