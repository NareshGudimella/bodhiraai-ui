import type { Metadata } from "next";
import { connection } from "next/server";
import { CIcon, cmsIcon, type AnyIconName } from "@/components/site/kit-content-icons";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getCollections } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** Shown when the CMS has no features. */
const KEY_FEATURES: [AnyIconName, string, string][] = [
  ["sparkles", "Visual Learning Experiences", "Every concept is taught through engaging visual explanations, illustrations, animations and interactive content — easier to understand and remember."],
  ["bot", "AI Learning Assistant", "Instant academic support — answers, concept explanations and guidance that encourage independent learning, 24/7."],
  ["clipboardCheck", "Smart Assessments & Evaluations", "Quizzes, tests, assignments and exams with automated evaluation and real-time performance tracking."],
  ["userCheck", "Attendance Management", "Track attendance digitally with real-time monitoring and reports for teachers, admins and parents."],
  ["fileText", "Assignment & Homework", "Create, distribute, submit, review and evaluate assignments through one streamlined digital workflow."],
  ["users", "Parent Engagement Portal", "Keep parents informed with attendance, performance reports, assignment tracking, announcements and direct messaging."],
  ["presentation", "Teacher Productivity Tools", "Lesson planning, a digital content library, student tracking, engagement tools and academic reporting in one place."],
  ["chart", "Student Performance Analytics", "Actionable insight into progress, strengths, weak areas, attendance patterns and academic growth."],
  ["smartphone", "Mobile Learning Access", "Learn anytime, anywhere across mobile, tablet and web — built for modern learners."],
];

const STATS: [AnyIconName, string, string][] = [
  ["users", "5-in-1", "Student · Teacher · Parent · Admin · School"],
  ["bot", "24/7", "AI doubt-solving assistant"],
  ["layers", "100%", "Digital academic workflow"],
  ["chart", "Real-time", "Progress & performance insight"],
];

const STEPS: [string, string][] = [
  ["School Signs Up", "The school joins Bodhira.ai. We set up classes, sections and a school admin login."],
  ["Students & Teachers Added", "Admins add students and map teachers to subjects and sections in minutes."],
  ["Learning Happens", "Students watch lessons, read notes, ask the AI, take quizzes and join live classes."],
  ["Everyone Sees Progress", "Teachers spot who needs help, parents see scores, schools get big-picture reports."],
];

const ENTERPRISE: [AnyIconName, string, string][] = [
  ["userShield", "Role-Based Access", "Granular permissions for students, teachers, parents, school admins and platform admins — everyone sees exactly what they should."],
  ["lock", "Secure & Private", "Token-based authentication, encrypted sessions and school-scoped data isolation keep student information protected."],
  ["server", "Scales With You", "A multi-tenant architecture that supports thousands of students and multiple schools without compromising performance."],
  ["gauge", "Real-Time Insights", "Live dashboards surface attendance, performance and engagement the moment they change — no waiting for end-of-term."],
  ["smartphone", "Native Mobile Apps", "Dedicated Android & iOS experiences for every role, alongside a full-featured web platform."],
  ["headset", "Onboarding & Support", "Guided school setup and responsive support help your team go live quickly and stay productive."],
];

/** 4 or 8 cards in rows of four, 2 in two columns, anything else in threes. */
const gridFor = (n: number) => (n === 2 ? "bp-grid--2" : n % 4 === 0 && n % 3 !== 0 ? "bp-grid--4" : "bp-grid--3");

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/features", 'Platform Features · Bodhira.ai');
}

/**
 * Legacy resources/views/features.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same sections and copy,
 * same CMS features (fallback list when empty) and services (section hidden
 * when empty), same links (/register/student, /contact, /pricing). The page's
 * own inline <style> block and Font Awesome icons are gone: kit classes plus
 * site-ui-content.css, line icons (CMS icon names are mapped by `cmsIcon()`).
 * Added: hero and closing-card photos (public/assets/img/pages/content,
 * credits in CREDITS.md there).
 */
export default async function FeaturesPage() {
  await connection();
  const [img, { features, services }] = await Promise.all([imageResolver(), getCollections()]);
  return (
    <div className="bh-page">
      <SeoSchema path="features" />

      <PageHero
        eyebrow="The Bodhira.ai Platform"
        title="Everything a school needs to run"
        highlight="digital learning"
        lead="From the first student added to the term-end parent report — video lessons, quizzes, an AI doubt-solver, attendance and analytics, all in one connected platform."
        breadcrumbs={[{ label: "Features" }]}
        image={{ src: img(null, "assets/img/pages/content/features-hero.jpg"), alt: "A teacher explaining a circuit diagram on an interactive smart board", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="/register/student" className="bh-btn bh-btn--maroon bh-btn--lg">Get Started Free <CIcon name="arrowRight" size={18} /></a>
            <a href="/contact" className="bh-btn bh-btn--ghost bh-btn--lg"><CIcon name="headset" size={18} /> Talk to Sales</a>
          </>
        }
        badge={
          <span className="bp-glass">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><CIcon name="bot" size={20} /></span>
            <span><strong>24/7</strong><span>AI doubt-solving assistant</span></span>
          </span>
        }
      >
        <ul className="bp-chips">
          {["One platform, five roles", "AI tutor, 24/7", "Web, tablet & mobile"].map((t) => (
            <li key={t} className="bp-chip"><CIcon name="check" size={16} />{t}</li>
          ))}
        </ul>
      </PageHero>

      {/* Stats band */}
      <section className="bp-section bp-section--tight bpc-overlap" aria-label="The platform at a glance">
        <div className="bh-container">
          <ul className="bp-counters bpc-counters" data-reveal>
            {STATS.map(([icon, num, label]) => (
              <li key={num}>
                <span className="bp-tile bp-tile--light"><CIcon name={icon} size={24} /></span>
                <strong>{num}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What Bodhira.ai does (CMS features, or the fallback list) */}
      <section className="bp-section bp-section--flush-top" aria-labelledby="features-what">
        <div className="bh-container">
          <SectionHead
            id="features-what"
            eyebrow="What Bodhira.ai Does"
            title="Everything to run digital learning —"
            highlight="in one place"
            lead="A complete academic operating system that connects students, teachers, parents and administrators around a single source of truth."
            align="center"
          />
          <ul className={`bp-grid ${gridFor(features.length || KEY_FEATURES.length)}`}>
            {features.length
              ? features.map((kf) => (
                  <li key={kf.id} className="bp-card bp-card--hover bpc-feature" data-reveal>
                    <span className="bp-tile"><CIcon name={cmsIcon(kf.icon)} size={24} /></span>
                    <h3 className="bp-h3">{kf.title}</h3>
                    {kf.description && <p>{kf.description}</p>}
                  </li>
                ))
              : KEY_FEATURES.map(([icon, title, text]) => (
                  <li key={title} className="bp-card bp-card--hover bpc-feature" data-reveal>
                    <span className="bp-tile"><CIcon name={icon} size={24} /></span>
                    <h3 className="bp-h3">{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
          </ul>
        </div>
      </section>

      {/* How it comes together */}
      <section className="bp-section bp-section--cream" aria-labelledby="features-steps">
        <div className="bh-container">
          <SectionHead id="features-steps" eyebrow="How It Comes Together" title="From school sign-up to parent report —" highlight="in four steps" align="center" />
          <ol className="bpc-steps">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="bpc-step" data-reveal>
                <span className="bpc-step__num" aria-hidden="true">{i + 1}</span>
                <h3 className="bp-h3">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we offer (CMS services) */}
      {services.length > 0 && (
        <section className="bp-section" aria-labelledby="features-offer">
          <div className="bh-container">
            <SectionHead id="features-offer" eyebrow="What We Offer" title="Everything your school gets with" highlight="Bodhira.ai" align="center" />
            <ul className={`bp-grid ${gridFor(services.length)}`}>
              {services.map((sv) => (
                <li key={sv.id} className="bp-card bp-card--hover bpc-feature" data-reveal>
                  <span className="bp-tile bp-tile--gold"><CIcon name={cmsIcon(sv.icon)} size={24} /></span>
                  <h3 className="bp-h3">{sv.title}</h3>
                  {sv.excerpt && <p>{sv.excerpt}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Built for scale */}
      <section className="bp-section bp-section--dark bp-on-dark" aria-labelledby="features-scale">
        <div className="bh-container">
          <SectionHead
            id="features-scale"
            eyebrow="Built for Scale"
            title="Enterprise-ready for schools of"
            highlight="every size"
            lead="Reliable, secure and built to grow — from a single campus to a multi-school group."
            align="center"
            light
          />
          <ul className="bp-grid bp-grid--3">
            {ENTERPRISE.map(([icon, title, text]) => (
              <li key={title} className="bpc-glass-card" data-reveal>
                <span className="bp-tile bp-tile--light"><CIcon name={icon} size={24} /></span>
                <h3 className="bp-h3">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bp-section" aria-label="Get started">
        <div className="bh-container">
          <CtaBand
            image={img(null, "assets/img/pages/content/features-cta.jpg")}
            title="Ready to modernize your school?"
            text="Join Bodhira.ai and give your students, teachers and parents one connected place to learn, teach and track progress."
            actions={
              <>
                <a href="/register/student" className="bh-btn bh-btn--gold bh-btn--lg"><CIcon name="rocket" size={18} /> Get Started Free</a>
                <a href="/pricing" className="bh-btn bh-btn--glass bh-btn--lg"><CIcon name="tag" size={18} /> View Pricing</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
