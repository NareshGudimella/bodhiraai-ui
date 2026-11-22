import type { Metadata } from "next";
import { connection } from "next/server";
import { CIcon, type AnyIconName } from "@/components/site/kit-content-icons";
import { SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
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
 */
export default async function CoursesPage() {
  await connection();
  const img = await imageResolver();
  return (
    <div className="bh-page">
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
            <a href="/book-demo" className="bh-btn bh-btn--maroon bh-btn--lg">Book a Demo <CIcon name="arrowRight" size={18} /></a>
            <a href="/register/student" className="bh-btn bh-btn--ghost bh-btn--lg">Get Started</a>
          </>
        }
        badge={
          <span className="bp-glass">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><CIcon name="bookOpen" size={20} /></span>
            <span><strong>{SITE_STATS.subjects.label}</strong><span>{SITE_STATS.subjects.noun}</span></span>
          </span>
        }
      />

      {/* Subjects */}
      <section className="bp-section" aria-labelledby="courses-subjects">
        <div className="bh-container">
          <SectionHead id="courses-subjects" eyebrow="Subjects Available" title="Choose a" highlight="Subject" align="center" />
          <ul className="bpc-subjects">
            {SUBJECTS.map(([icon, name, sub]) => (
              <li key={name} className="bpc-subject" data-reveal>
                <span className="bp-tile"><CIcon name={icon} size={24} /></span>
                <span>
                  <h3 className="bpc-subject__name">{name}</h3>
                  <span className="bpc-subject__sub" lang={name === "Hindi" ? "hi" : undefined}>{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Class levels */}
      <section className="bp-section bp-section--cream" aria-labelledby="courses-classes">
        <div className="bh-container">
          <SectionHead id="courses-classes" eyebrow="Class Levels" title="Built for Every Stage of" highlight="School" align="center" />
          <ul className="bp-grid bp-grid--4 bpc-levels">
            {CLASSES.map(([icon, label, stage, src, alt]) => (
              <li key={label} className="bpc-level" data-reveal>
                <img src={img(null, src)} alt={alt} width={600} height={720} loading="lazy" decoding="async" />
                <div className="bpc-level__body">
                  <span className="bp-tile bp-tile--sm bp-tile--gold"><CIcon name={icon} size={20} /></span>
                  <h3 className="bp-h3">{label}</h3>
                  <p>{stage}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inside every course */}
      <section className="bp-section" aria-labelledby="courses-inside">
        <div className="bh-container">
          <SectionHead id="courses-inside" eyebrow="Inside Every Course" title="What Each Lesson Gives" highlight="Your Child" align="center" />
          <ol className="bp-grid bp-grid--4 bpc-inside">
            {INSIDE.map(([icon, title, text], i) => (
              <li key={title} className="bp-card bp-card--hover" data-reveal>
                <span className="bpc-inside__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="bp-tile"><CIcon name={icon} size={24} /></span>
                <h3 className="bp-h3">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="bp-actions bpc-center" data-reveal>
            <a href="/book-demo" className="bh-btn bh-btn--maroon bh-btn--lg">Book a Demo <CIcon name="arrowRight" size={18} /></a>
            <a href="/register/student" className="bh-btn bh-btn--ghost bh-btn--lg">Get Started</a>
          </div>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
