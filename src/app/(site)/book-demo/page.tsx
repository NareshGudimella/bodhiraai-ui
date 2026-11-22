import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { FlashClear } from "@/components/site/flash-clear";
import { KfFocusResult } from "@/components/site/kit-forms-focus";
import { KF_PAGE, KfAlert, KfAside, KfChip, KfFormCard, KfHelp, KfHeroChips, KfLayout, KfPhoto, KfSideCard, kfSection } from "@/components/site/kit-forms-fields";
import { CheckList } from "@/components/site/page-kit";
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
  return siteMetadata("/book-demo", "Book a Demo · Bodhira.ai", {
    description: "Book a demo of Bodhira.ai. Tell us who you are and we'll set up a personalised walkthrough for your school.",
  });
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
 * gone; Tailwind since the migration's phase 2 (kit-forms-fields.tsx).
 */
export default function BookDemoPage({ searchParams }: PageProps<"/book-demo">) {
  return (
    <div className={KF_PAGE}>
      <SeoSchema path="book-demo" />
      <PageHero
        eyebrow="Book a Demo"
        title="See Bodhira.ai in"
        highlight="Action"
        lead="Tell us who you are and we'll set up a personalised walkthrough."
        breadcrumbs={[{ label: "Book a Demo" }]}
      >
        <KfHeroChips label="Bodhira.ai in numbers">
          <KfChip icon="school">{SITE_STATS.schools.label} partner schools</KfChip>
          <KfChip icon="users">{SITE_STATS.students.label} students</KfChip>
          <KfChip icon="bookOpen">{SITE_STATS.subjects.label} subjects</KfChip>
        </KfHeroChips>
      </PageHero>

      <section className={kfSection({ flushTop: true })} aria-labelledby="demo-form-title">
        <KfLayout>
          <KfFormCard id="book-demo-form" eyebrow="Book a Demo" titleId="demo-form-title" title="Request your walkthrough" intro="Choose who you are, then fill in a few details.">
            <Form searchParams={searchParams} />
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
    <KfAside labelledBy="demo-covers">
      <KfPhoto
        src={img(null, "assets/img/pages/forms/demo-smartboard.jpg")}
        alt="A teacher standing in front of an interactive smart board during a lesson"
        chip={{ icon: "presentation", title: "Personalised", text: "Walkthrough for your school" }}
      />
      <KfSideCard titleId="demo-covers" title={<>What we&apos;ll show you</>} intro="One walkthrough of the whole platform, for your school or your child." introMargin="mb-5">
        <CheckList items={COVERS} gap="gap-3.5" />
      </KfSideCard>
      <KfHelp label="Prefer to talk?" phone={phone} />
    </KfAside>
  );
}

async function Form({ searchParams }: Pick<PageProps<"/book-demo">, "searchParams">) {
  await connection();
  const [flash, q] = await Promise.all([getSiteFlash(), searchParams]);
  const as = q.as === "student" ? "student" : "school";
  // Not the footer newsletter's errors (its own bag).
  const old = flash.bag ? {} : flash.old ?? {};
  const errors = flash.bag ? {} : flash.errors ?? {};
  // old('type', $preselect)
  const type = old.type === "student" || old.type === "school" ? old.type : as;
  const success = flash.messages?.demo_success;
  const ids: Record<string, string> = {
    name: "demo-name", email: "demo-email", phone: "demo-phone", city: "demo-city",
    organization: type === "school" ? "demo-organization" : "demo-current-school",
    designation: "demo-designation", student_count: "demo-student-count", grade: "demo-grade",
    board: "demo-board", message: "demo-message", consent: "demo-consent",
  };
  return (
    <>
      {/* key: a new flash remounts these, so each one is cleared and focused */}
      {(success || Object.keys(errors).length > 0) && <Fragment key={JSON.stringify(flash)}><FlashClear /><KfFocusResult /></Fragment>}
      <KfAlert status={success} errors={errors} fieldIds={ids} />
      <DemoForm key={JSON.stringify(old)} initialType={type} old={old} errors={errors} />
    </>
  );
}
