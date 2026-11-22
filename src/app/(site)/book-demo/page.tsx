import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { Icon } from "@/components/site/icons";
import { KfFocusResult } from "@/components/site/kit-forms-focus";
import { KfAlert, KfPhoto } from "@/components/site/kit-forms-fields";
import { CheckList, Eyebrow } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, settingResolver, siteMetadata } from "@/lib/site";
import { getSiteFlash } from "@/lib/site-flash";
import { SITE_STATS } from "@/lib/site-stats";
import { DemoForm } from "./demo-form";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/book-demo", "Book a Demo · Bodhira.ai");
}

/** What the walkthrough covers: the homepage FAQ's answers, shortened. not in legacy */
const COVERS = [
  "How we set up your school and its School Admin account",
  "Attendance, live classes, assignments and quiz results for teachers",
  "What parents see: lessons watched, quiz scores and attendance",
  "“Ask AI” explanations based on the lesson a student is studying",
  "Encrypted lesson videos that can't be downloaded",
  "Works in any browser and the Bodhira mobile app, in English, Hindi and Telugu",
];

/**
 * Legacy DemoController::form (book-demo.blade.php); ?as=school|student
 * preselects the tab. Redesigned in 2026 with the page design kit (not in
 * legacy; docs/site-design-kit.md): same form, action, fields, toggle and
 * `demo_success` flash; new split layout with a photo
 * (public/assets/img/pages/forms/CREDITS.md), a "what we'll show you" list
 * (homepage FAQ copy), the support phone from the `contact.phone` setting, and
 * the school / student counts from SITE_STATS. The inline <style> block is
 * gone (styles in site-ui-forms.css).
 */
export default function BookDemoPage({ searchParams }: PageProps<"/book-demo">) {
  return (
    <div className="bh-page kf-page">
      <SeoSchema path="book-demo" />
      <PageHero
        eyebrow="Book a Demo"
        title="See Bodhira.ai in"
        highlight="Action"
        lead="Tell us who you are and we'll set up a personalised walkthrough."
        breadcrumbs={[{ label: "Book a Demo" }]}
      >
        <ul className="bp-chips kf-hero-chips" aria-label="Bodhira.ai in numbers">
          <li><span className="bp-chip"><Icon name="school" size={16} />{SITE_STATS.schools.label} partner schools</span></li>
          <li><span className="bp-chip"><Icon name="users" size={16} />{SITE_STATS.students.label} students</span></li>
          <li><span className="bp-chip"><Icon name="bookOpen" size={16} />{SITE_STATS.subjects.label} subjects</span></li>
        </ul>
      </PageHero>

      <section className="bp-section kf-section" aria-labelledby="demo-form-title">
        <div className="bh-container kf-layout">
          <div className="bp-form-card kf-card" id="book-demo-form" data-reveal>
            <div className="kf-card__head">
              <Eyebrow>Book a Demo</Eyebrow>
              <h2 id="demo-form-title" className="kf-card__title">Request your walkthrough</h2>
              <p>Choose who you are, then fill in a few details.</p>
            </div>
            <Form searchParams={searchParams} />
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
    <aside className="kf-aside" aria-labelledby="demo-covers">
      <KfPhoto
        src={img(null, "assets/img/pages/forms/demo-smartboard.jpg")}
        alt="A teacher standing in front of an interactive smart board during a lesson"
        chip={
          <span className="bp-glass kf-photo__chip">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><Icon name="presentation" size={20} /></span>
            <span><strong>Personalised</strong><span>Walkthrough for your school</span></span>
          </span>
        }
      />
      <div className="bp-card kf-benefits" data-reveal>
        <h2 id="demo-covers" className="kf-side-title">What we&apos;ll show you</h2>
        <p>One walkthrough of the whole platform, for your school or your child.</p>
        <CheckList items={COVERS} />
      </div>
      <div className="kf-help bp-on-dark" data-reveal>
        <span className="bp-tile bp-tile--sm bp-tile--light"><Icon name="phone" size={20} /></span>
        <div>
          <span className="kf-help__label">Prefer to talk?</span>
          <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a>
        </div>
      </div>
    </aside>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/book-demo">, "searchParams">) {
  await connection();
  const [flash, q] = await Promise.all([getSiteFlash(), searchParams]);
  const as = q.as === "student" ? "student" : "school";
  const old = flash.old ?? {};
  const errors = flash.errors ?? {};
  // old('type', $preselect)
  const type = old.type === "student" || old.type === "school" ? old.type : as;
  const success = flash.messages?.demo_success;
  const ids: Record<string, string> = {
    name: "demo-name", email: "demo-email", phone: "demo-phone", city: "demo-city",
    organization: type === "school" ? "demo-organization" : "demo-current-school",
    designation: "demo-designation", student_count: "demo-student-count", grade: "demo-grade",
    board: "demo-board", message: "demo-message",
  };
  return (
    <>
      {/* key: a new flash remounts these, so each one is cleared and focused */}
      {(success || flash.errors) && <Fragment key={JSON.stringify(flash)}><FlashClear /><KfFocusResult /></Fragment>}
      <KfAlert status={success} errors={errors} fieldIds={ids} />
      <DemoForm key={JSON.stringify(old)} initialType={type} old={old} errors={errors} />
    </>
  );
}
