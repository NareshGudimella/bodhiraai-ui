import type { Metadata } from "next";
import { connection } from "next/server";
import { CIcon, cmsIcon, type AnyIconName } from "@/components/site/kit-content-icons";
import { BTN_FOCUS, BTN_FOCUS_DARK, CHIP, CHIPS, COLS, Counters, GRID, HeroBadge, LIST, P, PAGE, card, h3, section, tile } from "@/components/site/kit-content-ui";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx } from "@/components/site/ui";
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
  // Was "100%" (not a measured figure; compliance pass, not in legacy, 2026-11-22).
  ["layers", "One platform", "Digital academic workflow"],
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
const gridFor = (n: number) => cx(LIST, GRID, COLS[n === 2 ? 2 : n % 4 === 0 && n % 3 !== 0 ? 4 : 3]);

/** A feature card's text (its last line: no bottom margin). */
const FEATURE_P = cx(P, "mb-0 text-[15.5px] text-body");

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
 * credits in CREDITS.md there). Tailwind since the migration's phase 2 (was
 * `.bh-page` kit classes and site-ui-content.css).
 */
export default async function FeaturesPage() {
  await connection();
  const [img, { features, services }] = await Promise.all([imageResolver(), getCollections()]);
  return (
    <div className={PAGE}>
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
            <a href="/register/student" className={btn("maroon", "lg", BTN_FOCUS)}>Get Started Free <CIcon name="arrowRight" size={18} /></a>
            <a href="/contact" className={btn("ghost", "lg", BTN_FOCUS)}><CIcon name="headset" size={18} /> Talk to Sales</a>
          </>
        }
        badge={
          <HeroBadge icon={<CIcon name="bot" size={20} />} value="24/7" label="AI doubt-solving assistant" />
        }
      >
        <ul className={CHIPS}>
          {["One platform, five roles", "AI tutor, 24/7", "Web, tablet & mobile"].map((t) => (
            <li key={t} className={CHIP}><CIcon name="check" size={16} />{t}</li>
          ))}
        </ul>
      </PageHero>

      {/* Stats band */}
      <section className={section("white", { tight: true })} aria-label="The platform at a glance">
        <div className="site-container">
          <Counters
            items={STATS.map(([icon, num, label]) => ({ key: num, icon: <CIcon name={icon} size={24} />, value: num, label }))}
            strong="text-[length:clamp(28px,1.6vw_+_14px,38px)]"
            label="max-w-[220px]"
          />
        </div>
      </section>

      {/* What Bodhira.ai does (CMS features, or the fallback list) */}
      <section className={section("white", { flushTop: true })} aria-labelledby="features-what">
        <div className="site-container">
          <SectionHead
            id="features-what"
            eyebrow="What Bodhira.ai Does"
            title="Everything to run digital learning —"
            highlight="in one place"
            lead="A complete academic operating system that connects students, teachers, parents and administrators around a single source of truth."
            align="center"
          />
          <ul className={gridFor(features.length || KEY_FEATURES.length)}>
            {features.length
              ? features.map((kf) => (
                  <li key={kf.id} className={card({ hover: true })} data-reveal>
                    <span className={tile("default", { hover: true, extra: "mb-5" })}><CIcon name={cmsIcon(kf.icon)} size={24} /></span>
                    <h3 className={h3({ size: "text-[20px]" })}>{kf.title}</h3>
                    {kf.description && <p className={FEATURE_P}>{kf.description}</p>}
                  </li>
                ))
              : KEY_FEATURES.map(([icon, title, text]) => (
                  <li key={title} className={card({ hover: true })} data-reveal>
                    <span className={tile("default", { hover: true, extra: "mb-5" })}><CIcon name={icon} size={24} /></span>
                    <h3 className={h3({ size: "text-[20px]" })}>{title}</h3>
                    <p className={FEATURE_P}>{text}</p>
                  </li>
                ))}
          </ul>
        </div>
      </section>

      {/* How it comes together */}
      <section className={section("cream")} aria-labelledby="features-steps">
        <div className="site-container">
          <SectionHead id="features-steps" eyebrow="How It Comes Together" title="From school sign-up to parent report —" highlight="in four steps" align="center" />
          <ol className={cx(LIST, "relative grid grid-cols-4 gap-6 *:min-w-0 max-lg:grid-cols-2 max-lg:gap-y-12 max-sm:grid-cols-1 max-sm:gap-y-8")}>
            {STEPS.map(([title, text], i) => (
              <li
                key={title}
                className={cx(
                  "relative px-3 text-center",
                  // dashed connector to the next step (desktop)
                  "not-last:after:absolute not-last:after:top-8 not-last:after:left-[calc(50%+44px)] not-last:after:h-0.5 not-last:after:w-[calc(100%-88px+24px)] not-last:after:bg-[repeating-linear-gradient(90deg,rgba(196,149,96,.6)_0_8px,transparent_8px_16px)] not-last:after:content-[''] max-lg:not-last:after:hidden",
                )}
                data-reveal
              >
                <span className="relative z-1 mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-grad-maroon text-[22px] font-extrabold text-white shadow-[0_0_0_8px_#fff,0_16px_30px_-12px_rgba(92,26,38,.55)]" aria-hidden="true">{i + 1}</span>
                <h3 className={h3({ size: "text-[19px]" })}>{title}</h3>
                <p className={cx(P, "m-0 text-[15px] text-body")}>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we offer (CMS services) */}
      {services.length > 0 && (
        <section className={section()} aria-labelledby="features-offer">
          <div className="site-container">
            <SectionHead id="features-offer" eyebrow="What We Offer" title="Everything your school gets with" highlight="Bodhira.ai" align="center" />
            <ul className={gridFor(services.length)}>
              {services.map((sv) => (
                <li key={sv.id} className={card({ hover: true })} data-reveal>
                  <span className={tile("gold", { hover: true, extra: "mb-5" })}><CIcon name={cmsIcon(sv.icon)} size={24} /></span>
                  <h3 className={h3({ size: "text-[20px]" })}>{sv.title}</h3>
                  {sv.excerpt && <p className={FEATURE_P}>{sv.excerpt}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Built for scale */}
      <section className={section("dark")} aria-labelledby="features-scale">
        <div className="site-container">
          <SectionHead
            id="features-scale"
            eyebrow="Built for Scale"
            title="Enterprise-ready for schools of"
            highlight="every size"
            lead="Reliable, secure and built to grow — from a single campus to a multi-school group."
            align="center"
            light
          />
          <ul className={cx(LIST, GRID, COLS[3])}>
            {ENTERPRISE.map(([icon, title, text]) => (
              <li
                key={title}
                className="h-full rounded-lg border border-[rgba(226,184,115,.22)] bg-[rgba(255,255,255,.05)] p-8 [transition:background_.3s,border-color_.3s,transform_.3s_var(--ease-bh)] hover:border-[rgba(226,184,115,.45)] hover:bg-[rgba(255,255,255,.09)] hover:[transform:translateY(-4px)] max-sm:p-6"
                data-reveal
              >
                <span className={tile("light", { extra: "mb-5" })}><CIcon name={icon} size={24} /></span>
                <h3 className={h3({ size: "text-[19px]", color: "text-ivory" })}>{title}</h3>
                <p className={cx(P, "m-0 text-[15px] text-[rgba(255,244,230,.82)]")}>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={section()} aria-label="Get started">
        <div className="site-container">
          <CtaBand
            image={img(null, "assets/img/pages/content/features-cta.jpg")}
            title="Ready to modernize your school?"
            text="Join Bodhira.ai and give your students, teachers and parents one connected place to learn, teach and track progress."
            actions={
              <>
                <a href="/register/student" className={btn("gold", "lg", BTN_FOCUS_DARK)}><CIcon name="rocket" size={18} /> Get Started Free</a>
                <a href="/pricing" className={btn("glass", "lg", BTN_FOCUS_DARK)}><CIcon name="tag" size={18} /> View Pricing</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
