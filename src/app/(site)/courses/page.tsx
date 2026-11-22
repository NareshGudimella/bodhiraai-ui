import type { Metadata } from "next";
import { connection } from "next/server";
import { CIcon, type AnyIconName } from "@/components/site/kit-content-icons";
import { BTN_FOCUS, COLS, GRID, HeroBadge, LIST, P, PAGE, card, h3, section, tile } from "@/components/site/kit-content-ui";
import { SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx } from "@/components/site/ui";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, siteMetadata } from "@/lib/site";
import { SITE_STATS } from "@/lib/site-stats";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

const SUBJECTS: [AnyIconName, string, string][] = [
  ["calculator", "Mathematics", "Concepts, practice & tests"],
  ["flask", "Science", "Physics • Chemistry • Biology"],
  ["bookOpen", "English", "Reading, grammar & writing"],
  ["pen", "Hindi", "व्याकरण एवं साहित्य"],
  ["globe", "Social Studies", "History, Civics & Geography"],
  ["code", "Computer Science", "Coding & digital skills"],
  ["sprout", "EVS / GK", "Environment & awareness"],
  ["languages", "Sanskrit", "Language & grammar"],
  ["lightbulb", "Mental Maths", "Speed & reasoning"],
];

/** Class levels with a photo each (new; no legacy image keys). */
const CLASSES: [AnyIconName, string, string, string, string][] = [
  ["shapes", "Class 1 – 5", "Primary", "assets/img/pages/content/courses-primary.jpg", "Young children sitting together on a classroom floor, listening to their teacher"],
  ["bookOpen", "Class 6 – 8", "Middle", "assets/img/pages/content/courses-middle.jpg", "A smiling schoolgirl in uniform with her school bag"],
  ["cap", "Class 9 – 10", "Secondary", "assets/img/pages/content/courses-secondary.jpg", "Secondary students in uniform writing notes at their desks"],
  ["cap", "Class 11 – 12", "Sr. Secondary", "assets/img/pages/content/courses-senior.jpg", "A senior student reading her textbook at a library desk"],
];

const INSIDE: [AnyIconName, string, string][] = [
  ["clapperboard", "Visual Video Lessons", "Short, topic-wise videos that explain concepts visually so students understand, not memorise."],
  ["fileText", "Notes & PDFs", "Downloadable notes and summaries for revision, anytime — even offline."],
  ["clipboardCheck", "Quizzes After Each Topic", "Auto-graded quizzes flag weak areas instantly so students know what to revise."],
  ["bot", "AI Learning Assistant", "Ask a doubt right inside the lesson and get an instant, simple explanation 24/7."],
];

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/courses", 'Courses · Bodhira.ai');
}

/**
 * Legacy resources/views/courses.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same copy, subjects,
 * class levels, lesson features and buttons (/book-demo, /register/student).
 * The section intro ("Every Major Subject…") is now the hero's h1 and lead,
 * so the subjects grid got a short heading of its own ("Choose a Subject").
 * Added: hero photo, a photo per class level and a subjects-count badge (from
 * SITE_STATS); photos in public/assets/img/pages/content (CREDITS.md there).
 * Tailwind since the migration's phase 2 (was `.bh-page` kit classes and
 * site-ui-content.css).
 */
export default async function CoursesPage() {
  await connection();
  const img = await imageResolver();
  return (
    <div className={PAGE}>
      <SeoSchema path="courses" />

      <PageHero
        eyebrow="Courses"
        title="Every Major Subject. Every Class."
        highlight="One Platform."
        lead="Each subject is organised into chapters and topics, with visual video lessons, downloadable notes, quizzes and an AI learning assistant built into every lesson."
        breadcrumbs={[{ label: "Courses" }]}
        image={{ src: img(null, "assets/img/pages/content/courses-hero.jpg"), alt: "Children laughing together beside a Hindi and English alphabet chart painted on their classroom wall", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="/book-demo" className={btn("maroon", "lg", BTN_FOCUS)}>Book a Demo <CIcon name="arrowRight" size={18} /></a>
            <a href="/register/student" className={btn("ghost", "lg", BTN_FOCUS)}>Get Started</a>
          </>
        }
        badge={
          <HeroBadge icon={<CIcon name="bookOpen" size={20} />} value={SITE_STATS.subjects.label} label={SITE_STATS.subjects.noun} />
        }
      />

      {/* Subjects */}
      <section className={section()} aria-labelledby="courses-subjects">
        <div className="site-container">
          <SectionHead id="courses-subjects" eyebrow="Subjects Available" title="Choose a" highlight="Subject" align="center" />
          <ul className={cx(LIST, "grid grid-cols-3 gap-4 *:min-w-0 max-lg:grid-cols-2 max-sm:grid-cols-1")}>
            {SUBJECTS.map(([icon, name, sub]) => (
              <li
                key={name}
                className="group/card flex items-center gap-4 rounded-lg border border-line bg-white px-[22px] py-5 shadow-xs [transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh),border-color_.3s] hover:[transform:translateY(-3px)] hover:border-[rgba(122,36,55,.16)] hover:shadow-md"
                data-reveal
              >
                <span className={tile("default", { hover: true })}><CIcon name={icon} size={24} /></span>
                <span>
                  <h3 className="m-0 mb-0.5 font-sans text-[18px] leading-[1.2] font-bold tracking-[-.01em] text-ink transition-none">{name}</h3>
                  <span className="block text-[14px] text-muted" lang={name === "Hindi" ? "hi" : undefined}>{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Class levels */}
      <section className={section("cream")} aria-labelledby="courses-classes">
        <div className="site-container">
          <SectionHead id="courses-classes" eyebrow="Class Levels" title="Built for Every Stage of" highlight="School" align="center" />
          <ul className={cx(LIST, "grid grid-cols-4 gap-6 *:min-w-0 max-xl:grid-cols-2 max-sm:gap-3")}>
            {CLASSES.map(([icon, label, stage, src, alt]) => (
              <li
                key={label}
                className="group/level relative aspect-[5/6] overflow-hidden rounded-lg bg-cream-2 shadow-md after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(31,11,16,0)_40%,rgba(31,11,16,.55)_68%,rgba(31,11,16,.92))] after:content-['']"
                data-reveal
              >
                <img src={img(null, src)} alt={alt} width={600} height={720} loading="lazy" decoding="async" className="absolute inset-0 block h-full w-full max-w-full object-cover [transition:transform_.6s_var(--ease-bh)] group-hover/level:scale-[1.05]" />
                <div className="absolute right-0 bottom-0 left-0 z-1 p-6 max-sm:p-3.5">
                  <span className={tile("gold", { sm: true, extra: "mb-3.5 max-sm:hidden" })}><CIcon name={icon} size={20} /></span>
                  <h3 className={h3({ size: "text-[22px] max-sm:text-[17px]", color: "text-white", mb: "mb-0.5" })}>{label}</h3>
                  <p className="m-0 font-sans text-[14px] leading-[1.65] font-bold tracking-[.08em] text-gold-bright uppercase max-sm:text-[11.5px]">{stage}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inside every course */}
      <section className={section()} aria-labelledby="courses-inside">
        <div className="site-container">
          <SectionHead id="courses-inside" eyebrow="Inside Every Course" title="What Each Lesson Gives" highlight="Your Child" align="center" />
          <ol className={cx(LIST, GRID, COLS[4])}>
            {INSIDE.map(([icon, title, text], i) => (
              <li key={title} className={card({ hover: true, extra: "pt-7 max-sm:pt-7" })} data-reveal>
                {/* gold-2, not 35% gold (1.4:1): large text needs 3:1. a11y pass, not in legacy */}
                <span className="absolute top-6 right-6 text-[28px] leading-none font-extrabold tracking-[-.03em] text-gold-2" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className={tile("default", { hover: true, extra: "mb-5" })}><CIcon name={icon} size={24} /></span>
                <h3 className={h3({ size: "text-[19px]" })}>{title}</h3>
                <p className={cx(P, "mb-0 text-[15px] text-body")}>{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap justify-center gap-3 max-sm:*:flex-[1_1_100%]" data-reveal>
            <a href="/book-demo" className={btn("maroon", "lg", BTN_FOCUS)}>Book a Demo <CIcon name="arrowRight" size={18} /></a>
            <a href="/register/student" className={btn("ghost", "lg", BTN_FOCUS)}>Get Started</a>
          </div>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
