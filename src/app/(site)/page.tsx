import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon, type IconName } from "@/components/site/icons";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { HomeBanner, type BannerArt, type BannerSlide } from "@/components/site/home-banner";
import { HomeRequestForm } from "@/components/site/home-request-form";
import { SiteStatus } from "@/components/site/site-status";
import { initials } from "@/components/site/initials";
import { QuoteCard, Testimonials, type Testimonial } from "@/components/site/testimonials";
import { GLASS, btn, cx, eyebrowClass, h2Class, lead, textLink } from "@/components/site/ui";
import { HomeVideo } from "@/components/site/home-video";
import { mediaUrl } from "@/lib/media";
import { assetResolver, fmtDate, settingResolver, siteMetadata } from "@/lib/site";
import { getBlog, getChrome, getCollections, getPricing, type PostCard } from "@/lib/site-api";
import { SITE_STATS } from "@/lib/site-stats";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/", "Bodhira.ai — Modern Digital Learning for Schools");
}

const SUBJECTS: [IconName, string, string][] = [
  ["calculator", "Mathematics", "Concepts, practice & tests"],
  ["flask", "Science", "Physics • Chemistry • Biology"],
  ["bookOpen", "English", "Reading, grammar & writing"],
  ["pen", "Hindi", "व्याकरण एवं साहित्य"],
  ["globe", "Social Studies", "History, Civics & Geography"],
  ["code", "Computer Science", "Coding & digital skills"],
  ["sprout", "EVS / GK", "Environment & awareness"],
  ["languages", "Sanskrit", "Language & grammar"],
  ["zap", "Mental Maths", "Speed & reasoning"],
];
const CLASSES: [IconName, string][] = [
  ["layers", "Class 1 – 5 (Primary)"],
  ["bookOpen", "Class 6 – 8 (Middle)"],
  ["cap", "Class 9 – 10 (Secondary)"],
  ["award", "Class 11 – 12 (Sr. Secondary)"],
];
/**
 * Official counts only (SITE_STATS). Compliance pass (not in legacy, 2026-11-22):
 * "15,485+ Classes Completed" and "97.55% Satisfaction Rate" were removed (no
 * data behind them); parents and subjects take their place.
 */
const COUNTERS: [IconName, string, string][] = [
  ["users", SITE_STATS.students.label, SITE_STATS.students.noun],
  ["heart", SITE_STATS.parents.label, SITE_STATS.parents.noun],
  ["bookOpen", SITE_STATS.subjects.label, SITE_STATS.subjects.noun],
  ["school", SITE_STATS.schools.label, SITE_STATS.schools.noun],
];
/** One question each for schools, teachers and parents first; the full list lives on /faq (CMS). */
const FAQS = [
  ["How does our school get started?", "Request a walkthrough below. We set up your school and its School Admin account, and the admin then adds teachers, students and parents, creates classes and chooses which Bodhira.ai curricula the school uses. Teachers and parents can also sign up with your school code and join once the admin approves them."],
  ["What will our teachers use it for day to day?", "Teachers take attendance, schedule live classes, set and grade assignments, and see quiz results for each class. A class-wise view shows which students have watched each lesson and where they are struggling, so teachers can step in early."],
  ["What can parents see?", "Each parent gets their own login, linked to their child by the school. They see lessons watched, quiz scores, attendance, assignments and upcoming live classes, and can message the child's teachers. A parent with more than one child switches between them in the same account."],
  ["How does “Ask AI” help students?", "While studying a lesson, a student can ask a question in their own words and get a short, clear explanation based on that lesson, so the answer matches what they are learning. Chapter quizzes then show instantly what they have understood."],
  ["Are our lessons and students' files protected?", "Yes. Lesson videos are encrypted and can't be downloaded; each viewer's name is watermarked on the video, and the Android app blocks screenshots and screen recording. Assignments, photos and other student files are private and open only through short-lived secure links."],
  ["Which devices and languages are supported?", "Bodhira.ai works in any modern browser on a phone, tablet or laptop, and in the Bodhira mobile app for students, teachers, parents and School Admins. The app is available in English, Hindi and Telugu."],
];
const IMPACT: [IconName, string, string][] = [
  ["users", SITE_STATS.students.label, SITE_STATS.students.noun],
  ["bookOpen", SITE_STATS.subjects.label, "Subjects & Topics"],
  ["layers", "1 – 12", "Classes covered"],
  ["dashboard", "3", "Connected dashboards"],
];
const BLOG_FALLBACKS = ["assets/img/home/blog-fallback-1.jpg", "assets/img/home/blog-fallback-2.jpg", "assets/img/home/blog-fallback-3.jpg"];

/** The three newest published posts (featured included), or none if the blog can't be read. */
async function latestPosts(): Promise<PostCard[]> {
  try {
    const { posts, featured } = await getBlog("", 1);
    const all = featured && !posts.some((p) => p.id === featured.id) ? [featured, ...posts] : posts;
    return [...all].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? "")).slice(0, 3);
  } catch {
    return [];
  }
}

/**
 * The homepage hero card (2026, not in legacy): Bodhira's own banner artwork
 * (public/assets/img/home/hero-banner-N-{desktop,mobile}.webp, credits in
 * CREDITS.md), each file replaceable in the Site Image Manager. The words baked
 * into each picture are repeated as visually hidden text: slide 1's headline is
 * the page's only <h1>, slides 2 and 3 use <h2>. The buttons under the card
 * follow the active slide.
 */
const ART = {
  desktop: { width: 1672, height: 941, small: 1200 },
  mobile: { width: 941, height: 1672, small: 640 },
} as const;

function bannerSlides(asset: (path: string) => string, trialDays: number): BannerSlide[] {
  /** The artwork file, plus its smaller copy unless the Site Image Manager replaced it (the copy would show the old art). */
  const art = (n: number, kind: keyof typeof ART, width: number = ART[kind].width): BannerArt => {
    const path = `assets/img/home/hero-banner-${n}-${kind}.webp`;
    const src = asset(path);
    const { height, small } = ART[kind];
    return src === `/${path}` ? { src, width, height, small: { src: `/${path.replace(".webp", `-${small}.webp`)}`, width: small } } : { src, width, height };
  };
  const demo = <a href="/book-demo" className={btn("maroon", "md", BTN_FOCUS)}>Book a Demo <Icon name="arrowRight" size={18} /></a>;
  return [
    {
      id: "learning",
      desktop: art(1, "desktop"),
      mobile: art(1, "mobile"),
      alt: "Every Child’s Learning Begins Here. A complete learning ecosystem with visual learning, AI-powered insights and interactive digital experiences. A smiling schoolgirl at her desk, with an AI tutor, a video lesson and a learning-progress chart around her; Visual Learning, AI-Powered Insights, Track Progress, Learn Anywhere.",
      text: (
        <>
          <h1>Every Child&rsquo;s Learning Begins Here</h1>
          <p>A complete learning ecosystem with visual learning, AI-powered insights and interactive digital experiences.</p>
        </>
      ),
      actions: (
        <>
          {demo}
          <a href="/register/student" className={btn("ghost", "md", BTN_FOCUS)}>Get Started</a>
        </>
      ),
    },
    {
      id: "ai",
      desktop: art(2, "desktop", 1671),
      mobile: art(2, "mobile"),
      alt: "AI-Powered Smart Learning for Better Results. Personalized learning, real-time insights and interactive lessons powered by advanced AI technology. A schoolboy working on a laptop with an AI learning assistant that explains concepts, gives practice questions, doubt support and revision notes.",
      text: (
        <>
          <h2>AI-Powered Smart Learning for Better Results</h2>
          <p>Personalized learning, real-time insights and interactive lessons powered by advanced AI technology.</p>
        </>
      ),
      actions: (
        <>
          {demo}
          <a href="/pricing" className={btn("ghost", "md", BTN_FOCUS)}>See Plans</a>
        </>
      ),
    },
    {
      id: "classroom",
      desktop: art(3, "desktop"),
      mobile: art(3, "mobile"),
      alt: "A Complete Digital Classroom for Modern Education. Engaging lessons, smart assessments, real-time progress and seamless learning for students, teachers and parents. A laptop showing the Bodhira dashboard with live classes, assignments and assessments, connected to a student, a teacher and parents.",
      text: (
        <>
          <h2>A Complete Digital Classroom for Modern Education</h2>
          <p>Engaging lessons, smart assessments, real-time progress and seamless learning for students, teachers and parents.</p>
        </>
      ),
      actions: (
        <>
          <a href="/register/student" className={btn("maroon", "md", BTN_FOCUS)}>{trialDays > 0 ? "Start Free Trial" : "Get Started"} <Icon name="arrowRight" size={18} /></a>
          <a href="/courses" className={btn("ghost", "md", BTN_FOCUS)}>Explore Courses</a>
        </>
      ),
    },
  ];
}

/** The longest student-plan free trial in days (0 = none, or pricing can't be read). */
async function studentTrialDays(): Promise<number> {
  try {
    const { individual } = await getPricing();
    return Math.max(0, ...individual.map((p) => p.trial_days));
  } catch {
    return 0;
  }
}

/*
 * Tailwind classes for the homepage (the migration's phase 1; they reproduce the rules that
 * were in public/assets/css/home.css, scoped to `.bh-home`). Shared type and buttons: ui.ts.
 */
/*
 * Never put two utilities for the same property in one class list (`text-body` and
 * `text-white`): Tailwind orders them itself, not by their order in the string. So these
 * shared strings leave out what call sites change (size, colour, margins).
 */
/** Paragraph font (was `.bh-home p`: 16px, body colour, margin 0 0 16px; add those). */
const P = "font-sans leading-[1.6] font-normal";
/** Headings reset (was `.bh-home h1, h2, h3`; add the colour). */
const H = "font-sans m-0 transition-none";
/** Maroon focus ring with 8px corners on the light sections (`.bh-home a:focus-visible`). */
const FOCUS = "focus-visible:rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-maroon";
/** Same ring for buttons (their own ring is gold). */
const BTN_FOCUS = "focus-visible:rounded-[8px] focus-visible:outline-maroon!";
/** Section padding: 112 → 88 → 72 → 64px. */
const SECTION = "py-28 max-xl:py-[88px] max-lg:py-[72px] max-sm:py-16";
/** Bottom-only padding for the blocks that follow a section of the same colour. */
const SECTION_B = "pb-28 max-xl:pb-[88px] max-lg:pb-[72px] max-sm:pb-16";
/** Two-column section grid that stacks under 992px. */
const GRID_2 = "grid items-center *:min-w-0 max-xl:gap-12 max-lg:grid-cols-1 max-lg:gap-14";
/** Images fill their box (`.bh-home img` + object-fit cover). */
const COVER = "block h-full w-full max-w-full object-cover";
/** Icon tile on cards. */
const TILE = "grid h-11 w-11 flex-none place-items-center rounded-sm";
const HEAD_SPLIT = "mb-10 grid grid-cols-[1.2fr_1fr] items-end gap-12 max-lg:grid-cols-1 max-lg:gap-2";
/** Card hover lift with the legacy theme's `article:hover` shadow (site-layout.css, !important there). */
const ARTICLE_HOVER = "[transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh)] hover:[transform:translateY(-4px)] hover:shadow-[0_26px_50px_-26px_rgba(42,14,19,.45)]";

/** Short section label (replaces the theme's bolt-icon sub-headings). */
function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return <p className={eyebrowClass(light)}>{children}</p>;
}

/** Section heading with the gradient highlight. */
function H2({ id, light, flush, children }: { id?: string; light?: boolean; flush?: boolean; children: React.ReactNode }) {
  return <h2 id={id} className={h2Class(light, flush)}>{children}</h2>;
}

/** Frosted chip with an icon (photos' badges). */
function Glass({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={cx(GLASS, "inline-flex items-center gap-3 text-[14px] font-bold", className)}>{children}</span>;
}

/**
 * Homepage. Legacy resources/views/home.blade.php, redesigned in 2026 (not in
 * legacy): every legacy section is kept (hero, about + video, subjects, why
 * schools choose, counters, FAQ, team, "what every student gets", school
 * onboarding form, blog) with a new layout, new photos (public/assets/img/home,
 * credits in CREDITS.md) and Tailwind utilities (the Tailwind migration's phase 1;
 * home.css is gone, same look). Added from the 2026 reference: impact stats + CMS
 * testimonials, the "Build a better learning future" card, real blog posts.
 * Images go through the Site Image Manager: a replacement saved under the
 * legacy key of an image with the same role still wins, else the new file
 * (itself replaceable under its own key).
 */
export default async function HomePage() {
  await connection();
  const [asset, setting, { images }, { team: allTeam, testimonials }, posts, trialDays] = await Promise.all([
    assetResolver(),
    settingResolver(),
    getChrome(),
    getCollections(),
    latestPosts(),
    studentTrialDays(),
  ]);
  const homeVideo = setting("home.video_url");
  /** A Site Image Manager replacement under the legacy key, else the new default (through asset()). */
  const img = (legacyKey: string, fallback: string) => images[legacyKey] ?? asset(fallback);
  const team = allTeam.slice(0, 3);
  const phone = setting("contact.phone", "+91 99852 52786");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const banner = bannerSlides(asset, trialDays);
  const trust = (
    <div className="flex flex-nowrap items-center gap-2.5">
      <ul className="m-0 flex flex-none list-none p-0" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className="not-first:-ml-2 max-[401px]:nth-4:hidden">
            <img src={img(`assets/img/images/hero-author-${n}.png`, `assets/img/home/avatar-${n}.jpg`)} alt="" width={32} height={32} className="block h-8 w-8 max-w-full rounded-full border-2 border-white object-cover" />
          </li>
        ))}
      </ul>
      <p className="m-0 font-sans text-[14px] leading-[1.35] font-normal text-muted max-md:text-[13px] max-[401px]:text-[12.5px] [&_strong]:font-extrabold [&_strong]:text-ink">
        <strong>{SITE_STATS.students.label}</strong> Students Learning <span aria-hidden="true">·</span> Used by <strong>{SITE_STATS.schools.label}</strong> schools across India
      </p>
    </div>
  );
  const quotes: Testimonial[] = testimonials
    .filter((t) => t.quote)
    .map((t) => ({ id: t.id, name: t.name, role: t.role, company: t.company || null, quote: t.quote ?? "", avatar: mediaUrl(t.avatar_url ?? null) ?? null, rating: t.rating ? Math.max(1, Math.min(5, t.rating)) : null }));

  return (
    <div className="overflow-x-clip font-sans text-base leading-[1.625] text-body antialiased reduce-motion-tree">
      <SeoSchema path="home" />

      {/* 1. Hero card: Bodhira's banner artwork as a slider (2026, not in legacy; replaces the photo-and-chips hero) */}
      <HomeBanner label="Bodhira.ai highlights" slides={banner} trust={trust} />

      {/* 2. About: how it works, with the marketing video */}
      <section className={cx(SECTION, "bg-white")} aria-labelledby="bh-about-title">
        <div className={cx("site-container grid-cols-[1.05fr_1fr] gap-20", GRID_2)}>
          <div className="relative pr-16 pb-[72px] max-lg:mx-auto max-lg:w-full max-lg:max-w-[640px] max-sm:p-0 max-sm:pb-24" data-reveal>
            <div className="relative aspect-[3/2.1] overflow-hidden rounded-lg shadow-lg after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_40%,rgba(31,11,16,.35))] after:content-['']">
              <img
                src={img("assets/img/images/about-img-1.jpg", "assets/img/home/how-it-works-classroom.jpg")}
                alt="A mother and her son following a lesson together on a tablet at home"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className={COVER}
              />
              {/* `home-video-play`: HomeVideo opens `home.video_url`; no URL, no button. */}
              {homeVideo && (
              <button
                type="button"
                className={cx(
                  "home-video-play absolute top-1/2 left-1/2 z-2 grid h-20 w-20 cursor-pointer place-items-center rounded-full bg-[rgba(255,255,255,.92)] p-0 pl-1 text-maroon [transform:translate(-50%,-50%)] max-sm:h-16 max-sm:w-16",
                  "shadow-[0_0_0_10px_rgba(255,255,255,.25),0_20px_40px_-12px_rgba(0,0,0,.5)] transition-[transform] duration-250 ease-bh hover:[transform:translate(-50%,-50%)_scale(1.07)]",
                  "before:absolute before:-inset-2.5 before:animate-pulse-ring before:rounded-full before:border-2 before:border-[rgba(255,255,255,.7)] before:content-[''] motion-reduce:before:animate-none!",
                  FOCUS,
                )}
                aria-label="Play the Bodhira.ai overview video"
              >
                <Icon name="play" size={26} className="fill-current" />
              </button>
              )}
            </div>
            <div className="absolute right-0 bottom-0 aspect-[4/3] w-[46%] overflow-hidden rounded-[20px] border-[6px] border-white shadow-lg max-sm:w-[52%]">
              <img
                src={img("assets/img/images/about-img-2.jpg", "assets/img/home/about-smart-classroom.jpg")}
                alt="A teacher leading a biology lesson with anatomy models for students in uniform"
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
                className={COVER}
              />
            </div>
            <a
              className={cx(
                "absolute bottom-4 left-6 z-3 flex items-center gap-3 rounded-md bg-grad-maroon py-3 pr-5 pl-3 text-white shadow-[0_20px_40px_-16px_rgba(92,26,38,.7)] transition-[translate] duration-200 ease-bh hover:-translate-y-0.5 hover:text-white",
                "max-sm:bottom-2 max-sm:left-0 max-sm:max-w-[58%] max-sm:py-2.5 max-sm:pr-3.5 max-sm:pl-2.5",
                FOCUS,
              )}
              href={tel}
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-sm bg-[rgba(255,255,255,.14)] text-gold-bright max-sm:h-[38px] max-sm:w-[38px]"><Icon name="phone" size={20} /></span>
              <span>
                <span className="block text-[11.5px] font-bold tracking-[.1em] text-gold-bright uppercase">School Support</span>
                <span className="block text-[17px] font-bold tracking-[-.01em] text-white max-sm:text-[15px]">{phone}</span>
              </span>
            </a>
          </div>
          <div data-reveal>
            <Eyebrow>How Bodhira.ai works</Eyebrow>
            <H2 id="bh-about-title">How Bodhira.ai Works for Your <span>School, Students &amp; Parents</span></H2>
            <p className={lead()}>
              Bodhira.ai brings learning management, academic workflows, AI-powered tools, performance analytics, parent engagement and
              institution-wide administration together in a single integrated environment &mdash; empowering students to learn smarter,
              teachers to teach efficiently and institutions to operate effortlessly.
            </p>
            <div className="mb-8 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
              {[
                ["users", SITE_STATS.students.label, "Students learning across partner schools"],
                ["heart", SITE_STATS.parents.label, <>Parents following their child&rsquo;s progress</>],
              ].map(([icon, num, label]) => (
                <div key={icon as string} className="flex items-start gap-3.5 rounded-md border border-line bg-cream p-5">
                  <span className={cx(TILE, "bg-white text-wine shadow-sm")}><Icon name={icon as IconName} size={22} /></span>
                  <span>
                    <strong className="mb-1 block text-[28px] leading-[1.05] font-extrabold tracking-[-.03em] text-ink">{num}</strong>
                    <span className="block text-[14px] leading-[1.45] text-muted">{label}</span>
                  </span>
                </div>
              ))}
            </div>
            <a href="/login" className={btn("maroon", "md", BTN_FOCUS)}>Sign In <Icon name="arrowRight" size={18} /></a>
          </div>
        </div>
      </section>

      {/* 3. Subjects and classes */}
      <section className={cx(SECTION, "bg-cream")} aria-labelledby="bh-subjects-title">
        <div className="site-container">
          <div className={cx("grid-cols-[360px_1fr] gap-[72px] max-xl:grid-cols-[300px_1fr]", GRID_2)}>
            <div className="relative before:absolute before:inset-[32px_-20px_-20px_32px] before:rounded-[200px_200px_32px_32px] before:bg-[linear-gradient(160deg,#F2D7A8,rgba(196,149,96,.25))] before:content-[''] max-lg:mx-auto max-lg:max-w-[300px]" data-reveal>
              <img
                src={img("assets/img/images/subjects-student.webp", "assets/img/home/subjects-student.jpg")}
                alt="A science student in a lab coat examining a flask in the school laboratory"
                width={600}
                height={760}
                loading="lazy"
                decoding="async"
                className="relative block aspect-[600/760] w-full max-w-full rounded-[200px_200px_32px_32px] object-cover shadow-lg"
              />
              <Glass className="absolute bottom-10 -left-4 px-[18px] py-3 max-sm:-left-1"><Icon name="layers" size={18} className="text-wine" /> Class 1 to 12</Glass>
            </div>
            <div data-reveal>
              <div className="mb-10">
                <Eyebrow>Subjects available</Eyebrow>
                <H2 id="bh-subjects-title">Every Major Subject. Every Class. <span>One Platform.</span></H2>
              </div>
              <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 *:min-w-0 max-xl:grid-cols-2 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                {SUBJECTS.map(([icon, name, sub]) => (
                  <li
                    key={name}
                    className="group/subject flex items-center gap-3.5 rounded-md border border-line bg-white p-4 shadow-xs transition-[translate,box-shadow,border-color] duration-250 ease-bh hover:-translate-y-[3px] hover:border-[rgba(122,36,55,.18)] hover:shadow-md"
                  >
                    <span className={cx(TILE, "bg-[linear-gradient(135deg,#FBEFDD,#F5E1C2)] text-wine transition-[background,color] duration-250 group-hover/subject:bg-grad-maroon group-hover/subject:text-white")}>
                      <Icon name={icon} size={22} />
                    </span>
                    <span>
                      <span className="block text-[15.5px] leading-[1.3] font-bold tracking-[-.01em] text-ink">{name}</span>
                      <span className="mt-0.5 block text-[13px] leading-[1.4] text-muted" lang={name === "Hindi" ? "hi" : undefined}>{sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-6">
                <span className="text-[12px] font-bold tracking-[.12em] text-muted uppercase">Browse by class</span>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {CLASSES.map(([icon, label]) => (
                    <li key={label}>
                      <a
                        href="/courses"
                        className={cx(
                          "group/chip inline-flex items-center gap-2 rounded-full border border-line-2 bg-white px-3.5 py-2 text-[13.5px] font-semibold text-ink transition-[background,color,border-color,translate] duration-200 hover:-translate-y-px hover:border-maroon hover:bg-maroon hover:text-white",
                          FOCUS,
                        )}
                      >
                        <Icon name={icon} size={16} className="text-wine group-hover/chip:text-gold-bright" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why schools choose Bodhira.ai (bento) */}
      <section className={cx(SECTION, "bg-white")} aria-labelledby="bh-why-title">
        <div className="site-container">
          <div className={HEAD_SPLIT} data-reveal>
            <div>
              <Eyebrow>Why schools choose Bodhira.ai</Eyebrow>
              <H2 id="bh-why-title" flush>Built Around the Way Your School <span>Already Teaches</span></H2>
            </div>
            <p className={lead("mb-5")}>No new routine to learn: lessons, quizzes, notes and reports follow your syllabus, your timetable and your teachers.</p>
          </div>
          <div className="grid grid-cols-4 grid-rows-[repeat(2,minmax(250px,auto))] gap-4 *:min-w-0 max-lg:grid-cols-2 max-lg:grid-rows-none max-sm:grid-cols-1">
            <article className={cx("group/hero relative col-span-2 row-span-2 min-h-[520px] overflow-hidden rounded-lg border-0 bg-cream max-lg:col-span-full max-lg:row-auto max-lg:min-h-[440px] max-sm:min-h-[420px]", ARTICLE_HOVER)} data-reveal>
              <img
                src={img("assets/img/images/promo-img-1.png", "assets/img/home/why-video-lessons.jpg")}
                alt=""
                width={1000}
                height={760}
                loading="lazy"
                decoding="async"
                className={cx(COVER, "absolute inset-0 transition-[scale] duration-[600ms] ease-bh group-hover/hero:scale-[1.04]")}
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(180deg,rgba(31,11,16,0)_30%,rgba(31,11,16,.55)_60%,rgba(31,11,16,.9))] p-8 max-sm:p-6">
                <span className={cx(TILE, "border border-[rgba(255,255,255,.3)] bg-[rgba(255,255,255,.16)] text-white backdrop-blur-[8px]")}><Icon name="play" size={20} /></span>
                <h3 className={cx(H, "mt-4 mb-2 text-[28px] leading-[1.25] font-bold tracking-[-.02em] text-white max-sm:text-[23px]")}>Video Lessons + Ask AI</h3>
                <p className={cx(P, "m-0 max-w-[440px] text-[15px] text-[rgba(255,255,255,.85)]")}>Students watch lessons by topic and click &ldquo;Ask AI&rdquo; whenever something is unclear.</p>
                <span className="mt-5 inline-flex items-center gap-3 self-start rounded-md border border-[rgba(255,255,255,.25)] bg-[rgba(255,255,255,.14)] px-3.5 py-2.5 text-[13.5px] font-semibold text-white [-webkit-backdrop-filter:blur(14px)_saturate(160%)] [backdrop-filter:blur(14px)_saturate(160%)]">
                  <Icon name="sparkles" size={16} className="text-gold-bright" /> &ldquo;Why does ice float?&rdquo; &rarr; answered from this lesson
                </span>
              </div>
            </article>
            <article className={cx("relative col-span-2 grid grid-cols-[1.1fr_1fr] overflow-hidden rounded-lg border border-line bg-cream max-xl:grid-cols-1 max-lg:col-span-1", ARTICLE_HOVER)} data-reveal>
              <div className="flex flex-col justify-center p-7">
                <span className={cx(TILE, "bg-white text-wine shadow-sm")}><Icon name="listChecks" size={20} /></span>
                <h3 className={cx(H, "mt-4 mb-2 text-[22px] leading-[1.25] font-bold tracking-[-.02em] text-ink")}>Quizzes, Notes &amp; Discussions</h3>
                <p className={cx(P, "m-0 text-[15px] text-body")}>Auto-graded chapter quizzes, with notes and class discussions in the same place.</p>
              </div>
              <img src={img("assets/img/images/promo-img-2.png", "assets/img/home/why-quizzes.jpg")} alt="" width={800} height={560} loading="lazy" decoding="async" className={cx(COVER, "min-h-[240px] max-xl:max-h-[220px] max-xl:min-h-[180px]")} />
            </article>
            <article className={cx("relative col-span-2 grid grid-cols-[1.1fr_1fr] overflow-hidden rounded-lg border-0 bg-grad-maroon max-xl:grid-cols-1 max-lg:col-span-1", ARTICLE_HOVER)} data-reveal>
              <div className="flex flex-col justify-center p-7">
                <span className={cx(TILE, "bg-gold-bright text-maroon-deep")}><Icon name="dashboard" size={20} /></span>
                <h3 className={cx(H, "mt-4 mb-2 text-[22px] leading-[1.25] font-bold tracking-[-.02em] text-white")}>Teacher &amp; Parent Dashboards</h3>
                <p className={cx(P, "m-0 text-[15px] text-[rgba(255,244,230,.82)]")}>Teachers and parents see lessons watched, quiz scores and weak topics in real time.</p>
              </div>
              <img src={img("assets/img/images/promo-img-3.png", "assets/img/home/why-dashboards.jpg")} alt="" width={800} height={560} loading="lazy" decoding="async" className={cx(COVER, "min-h-[240px] max-xl:max-h-[220px] max-xl:min-h-[180px]")} />
            </article>
          </div>
        </div>
      </section>

      {/* 5. Counters */}
      <section className={cx(SECTION_B, "bg-white")} aria-label="Bodhira.ai in numbers">
        <div className="site-container">
          <ul
            className="relative m-0 grid list-none grid-cols-4 overflow-hidden rounded-xl bg-[radial-gradient(60%_120%_at_0%_0%,rgba(226,184,115,.18),transparent_60%),var(--grad-maroon)] px-6 py-12 shadow-lg max-lg:grid-cols-2 max-lg:gap-y-8 max-sm:rounded-lg max-sm:px-2 max-sm:py-8"
            data-reveal
          >
            {COUNTERS.map(([icon, num, label]) => (
              <li
                key={label}
                className="relative flex flex-col items-center px-4 py-2 text-center not-first:before:absolute not-first:before:top-[15%] not-first:before:bottom-[15%] not-first:before:left-0 not-first:before:w-px not-first:before:bg-[linear-gradient(transparent,rgba(255,255,255,.25),transparent)] not-first:before:content-[''] max-lg:nth-3:before:hidden max-sm:p-2"
              >
                <span className="mb-4 grid h-[52px] w-[52px] place-items-center rounded-[16px] border border-[rgba(255,255,255,.2)] bg-[rgba(255,255,255,.1)] text-gold-bright"><Icon name={icon} size={24} /></span>
                <strong className="text-[length:clamp(32px,2vw_+_16px,44px)] leading-none font-extrabold tracking-[-.03em] text-white tabular-nums">{num}</strong>
                <span className="mt-2 text-[14px] font-medium text-[rgba(255,244,230,.78)]">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className={cx(SECTION, "bg-cream")} aria-labelledby="bh-faq-title">
        <div className={cx("site-container grid-cols-[.85fr_1.15fr] gap-20", GRID_2)}>
          <div className="relative max-w-[440px] max-lg:mx-auto" data-reveal>
            <img
              src={img("assets/img/images/faq-img.png", "assets/img/home/faq-students.jpg")}
              alt="A teacher answering a student's question at his desk in a bright classroom"
              width={720}
              height={960}
              loading="lazy"
              decoding="async"
              className="block aspect-[3/4] w-full max-w-full rounded-xl object-cover shadow-lg"
            />
            <div className={cx(GLASS, "absolute -right-8 bottom-8 inline-flex flex-col items-start gap-2.5 px-[18px] py-4 max-sm:right-2 max-sm:bottom-4")}>
              <span className="text-[13px] font-bold text-ink">Total Students</span>
              <ul className="m-0 flex list-none items-center p-0">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="not-first:-ml-2.5">
                    <img src={img(`assets/img/images/faq-thumb-${n}.png`, `assets/img/home/faq-thumb-${n}.jpg`)} alt="" width={40} height={40} loading="lazy" decoding="async" className="block h-10 w-10 max-w-full rounded-full border-2 border-white object-cover" />
                  </li>
                ))}
                <li className="-ml-2.5 grid h-10 min-w-10 place-items-center rounded-full border-2 border-white bg-grad-maroon px-2.5 text-[12px] font-bold text-white">{SITE_STATS.students.label}</li>
              </ul>
            </div>
          </div>
          <div data-reveal>
            <Eyebrow>Frequently asked</Eyebrow>
            <H2 id="bh-faq-title">Everything Schools, Parents and Teachers <span>Ask Before They Sign Up</span></H2>
            <div className="mt-2 mb-6 grid gap-3">
              {FAQS.map(([q, a], i) => (
                <details
                  key={q}
                  name="home-faq"
                  open={i === 0}
                  className="group/faq rounded-md border border-line bg-white shadow-xs transition-[box-shadow,border-color] duration-250 open:border-[rgba(122,36,55,.18)] open:shadow-md"
                >
                  <summary className={cx("flex cursor-pointer list-none items-center gap-4 px-[22px] py-5 max-sm:gap-3 max-sm:p-4 [&::-webkit-details-marker]:hidden", FOCUS)}>
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-cream text-[13px] font-extrabold text-wine group-open/faq:bg-grad-maroon group-open/faq:text-white">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[17px] leading-[1.4] font-bold tracking-[-.01em] text-ink max-sm:text-[15.5px]">{q}</span>
                    <Icon name="chevronDown" size={20} className="text-muted transition-[rotate] duration-250 ease-bh group-open/faq:rotate-180 group-open/faq:text-wine" />
                  </summary>
                  <p className={cx(P, "m-0 pt-0 pr-[22px] pb-[22px] pl-[74px] text-[15.5px] text-body max-sm:px-4 max-sm:pb-[18px]")}>{a}</p>
                </details>
              ))}
            </div>
            <a href="/faq" className={cx(textLink(), FOCUS)}>See all questions <Icon name="arrowRight" size={16} /></a>
          </div>
        </div>
      </section>

      {/* Impact + testimonials (2026 reference) */}
      <section className={cx(SECTION, "bg-white")} aria-labelledby="bh-impact-title">
        <div className="site-container">
          <div className={cx(GRID_2, "gap-[72px]", team.length && quotes.length ? "grid-cols-[1fr_1.1fr]" : "grid-cols-1")}>
            <div data-reveal>
              <Eyebrow>Our impact</Eyebrow>
              <H2 id="bh-impact-title">A Growing Community <span>of Learners</span></H2>
              <p className={lead()}>Students, parents and schools across India learn and teach with Bodhira.ai.</p>
              <ul className={cx("mt-0 mb-8 grid list-none gap-3 p-0", team.length && quotes.length ? "grid-cols-2" : "grid-cols-4 max-lg:grid-cols-2")}>
                {IMPACT.map(([icon, num, label]) => (
                  <li key={label} className="rounded-md border border-line bg-cream p-5 max-sm:p-4">
                    <span className="mb-3.5 grid h-10 w-10 place-items-center rounded-sm bg-white text-wine shadow-sm"><Icon name={icon} size={20} /></span>
                    <strong className="block text-[30px] leading-[1.05] font-extrabold tracking-[-.03em] text-ink max-sm:text-[24px]">{num}</strong>
                    <span className="mt-1 block text-[14px] text-muted">{label}</span>
                  </li>
                ))}
              </ul>
              <a href="/success-stories" className={btn("maroon", "md", BTN_FOCUS)}>Discover More <Icon name="arrowRight" size={18} /></a>
            </div>
            {team.length > 0 && quotes.length > 0 && (
              <div
                className="relative overflow-hidden rounded-xl bg-grad-maroon p-10 shadow-lg after:absolute after:-top-[60px] after:-right-[60px] after:h-[220px] after:w-[220px] after:rounded-full after:bg-[radial-gradient(circle,rgba(226,184,115,.25),transparent_70%)] after:content-[''] max-md:p-6"
                data-reveal
              >
                <Eyebrow light>Testimonials</Eyebrow>
                <h3 className={cx(H, "mb-6 text-[24px] leading-[1.2] font-bold tracking-[-.02em] text-white")}>What Our Users Say</h3>
                <Testimonials items={quotes} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Team (CMS), or legacy's "In Their Words" when there is no team; with the reference's CTA card */}
      <section className={cx(SECTION, "bg-cream")} aria-labelledby="bh-team-title">
        <div className="site-container">
          {team.length > 0 ? (
            <>
              <div className="mx-auto mb-10 max-w-[760px] text-center" data-reveal>
                <Eyebrow>The people behind Bodhira.ai</Eyebrow>
                <H2 id="bh-team-title">Meet the Team</H2>
              </div>
              <ul className="mx-auto mt-0 mb-16 grid max-w-[960px] list-none grid-cols-3 gap-6 p-0 max-lg:gap-4 max-md:mb-12 max-md:max-w-none max-md:grid-cols-2 max-sm:gap-3" data-reveal>
                {team.map((m, i) => {
                  const photo = mediaUrl(m.photo_url ?? null) ?? images[`assets/img/team/team-${(i % 4) + 1}.png`] ?? null;
                  return (
                    <li key={m.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-xs transition-[translate,box-shadow] duration-300 ease-bh hover:-translate-y-1 hover:shadow-md">
                      <div className="aspect-square bg-[linear-gradient(160deg,#F8ECDA,#EED7B3)]">
                        {photo ? (
                          <img src={photo} alt={m.name} width={400} height={400} loading="lazy" decoding="async" className={COVER} />
                        ) : (
                          <span
                            className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.7),transparent_50%),repeating-linear-gradient(135deg,rgba(196,149,96,.1)_0_2px,transparent_2px_14px)]"
                            aria-hidden="true"
                          >
                            <span className="grid h-[88px] w-[88px] place-items-center rounded-full bg-white text-[28px] font-extrabold tracking-[-.02em] text-wine shadow-[0_0_0_8px_rgba(255,255,255,.45),0_1px_2px_rgba(31,11,16,.04),0_12px_32px_-12px_rgba(31,11,16,.18)] max-sm:h-16 max-sm:w-16 max-sm:text-[21px]">{initials(m.name)}</span>
                          </span>
                        )}
                      </div>
                      <div className="px-5 pt-[18px] pb-5 max-sm:p-3.5">
                        <h3 className={cx(H, "text-[17px] leading-[1.2] font-bold tracking-[-.01em] text-ink max-sm:text-[15px]")}>{m.name}</h3>
                        {m.role && <p className={cx(P, "mt-1 mb-0 text-[14px] text-muted")}>{m.role}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            quotes.length > 0 && (
              <>
                <div className="mx-auto mb-10 max-w-[760px] text-center" data-reveal>
                  <Eyebrow>In their words</Eyebrow>
                  <H2 id="bh-team-title">Schools, Teachers and Parents on Bodhira.ai</H2>
                </div>
                <div className="mb-16 grid grid-cols-3 gap-6 *:min-w-0 max-lg:gap-4 max-md:mx-auto max-md:max-w-[420px] max-md:grid-cols-1" data-reveal>
                  {quotes.slice(0, 3).map((t) => <QuoteCard key={t.id} t={t} />)}
                </div>
              </>
            )
          )}

          <div
            className="relative flex min-h-[360px] items-center overflow-hidden rounded-xl bg-maroon-deep shadow-lg before:absolute before:inset-0 before:z-1 before:bg-[linear-gradient(90deg,rgba(42,14,19,.96)_0%,rgba(70,18,30,.88)_40%,rgba(92,26,38,.35)_75%,rgba(92,26,38,.1)_100%)] before:content-[''] max-md:before:bg-[linear-gradient(180deg,rgba(42,14,19,.92)_0%,rgba(70,18,30,.85)_60%,rgba(92,26,38,.6))] max-sm:min-h-0"
            data-reveal
          >
            <img className={cx(COVER, "absolute inset-0 object-[70%_50%]")} src={asset("assets/img/home/cta-school-campus.jpg")} alt="" width={1000} height={700} loading="lazy" decoding="async" />
            <div className="relative z-2 max-w-[620px] p-14 max-md:px-7 max-md:py-10">
              <h2 className={cx(H, "mb-4 text-[length:clamp(28px,1.8vw_+_16px,40px)] leading-[1.12] font-extrabold tracking-[-.03em] text-balance text-white")}>Let&rsquo;s Build a Better Learning Future Together</h2>
              <p className={cx(P, "mt-0 mb-7 text-[17px] text-[rgba(255,244,230,.82)]")}>Partner with us to bring visual, AI-assisted learning to every classroom in your school.</p>
              <div className="flex flex-wrap gap-3">
                <a href="/contact" className={btn("gold", "md", "focus-visible:rounded-[8px] max-sm:flex-[1_1_100%]")}>Contact Us <Icon name="arrowRight" size={18} /></a>
                <a href="/book-demo" className={btn("glass", "md", "focus-visible:rounded-[8px] max-sm:flex-[1_1_100%]")}>Book a Demo</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. What every student gets */}
      <section className={cx(SECTION, "bg-white")} aria-labelledby="bh-content-title">
        <div className={cx("site-container grid-cols-2 gap-20", GRID_2)}>
          <div className="relative grid grid-cols-[1.15fr_1fr] grid-rows-[auto_auto] gap-4 max-lg:mx-auto max-lg:w-full max-lg:max-w-[600px]" data-reveal>
            <img className={cx(COLLAGE, "col-start-1 row-start-1 aspect-[4/3]")} src={img("assets/img/images/content-img-1.png", "assets/img/home/content-tablet.jpg")} alt="A smiling student with a headset watching a video lesson on a laptop" width={800} height={600} loading="lazy" decoding="async" />
            <img className={cx(COLLAGE, "col-start-1 row-start-2 aspect-[4/3]")} src={img("assets/img/images/content-img-2.png", "assets/img/home/content-student.jpg")} alt="Two students in uniform writing answers during a class quiz" width={800} height={600} loading="lazy" decoding="async" />
            <img className={cx(COLLAGE, "col-start-2 row-[1/span_2]")} src={img("assets/img/images/content-img-3.png", "assets/img/home/content-classroom.jpg")} alt="A teacher reviewing a student's progress and making notes beside a laptop" width={600} height={1000} loading="lazy" decoding="async" />
            <Glass className="absolute -bottom-5 left-1/2 px-[18px] py-3 whitespace-nowrap [transform:translateX(-50%)] max-sm:text-[13px]"><Icon name="award" size={18} className="text-gold-2" /> Badges for every milestone</Glass>
          </div>
          <div data-reveal>
            <Eyebrow>What every student gets</Eyebrow>
            <H2 id="bh-content-title">Lessons, Quizzes and Progress <span>All in One Place</span></H2>
            <p className={lead()}>
              Students unlock the subjects they study, watch curriculum-aligned lessons by topic, finish a short quiz at the end of each chapter,
              and earn badges as they progress. Parents and teachers see all of it.
            </p>
            <ul className="m-0 grid list-none gap-4 p-0">
              {[
                ["play", "Video Lessons + Ask AI", "Short, curriculum-aligned lessons by topic, with an AI tutor that answers from the lesson itself."],
                ["check", "Every Chapter Has a Quiz", "Auto-graded quizzes at the end of each chapter. Scores go straight to the teacher and parent."],
              ].map(([icon, title, text]) => (
                <li key={title} className="flex gap-4 rounded-md border border-line bg-cream p-5 [transition:translate_.25s_var(--ease-bh),box-shadow_.25s] hover:-translate-y-0.5 hover:shadow-md">
                  <span className={cx(TILE, "bg-grad-maroon text-white")}><Icon name={icon as IconName} size={20} /></span>
                  <span>
                    <strong className="mb-1 block text-[17px] font-bold tracking-[-.01em] text-ink">{title}</strong>
                    <span className="block text-[15px] leading-[1.55] text-body">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Set up your school (onboarding request) */}
      <section className={cx(SECTION_B, "scroll-mt-20 bg-white")} id="setup-school" aria-labelledby="bh-request-title">
        <div className="site-container">
          <div className="relative grid grid-cols-[.9fr_1.1fr] items-stretch overflow-hidden rounded-xl bg-[radial-gradient(70%_100%_at_100%_0%,rgba(226,184,115,.2),transparent_60%),var(--grad-maroon)] shadow-lg *:min-w-0 max-lg:grid-cols-1">
            <div className="relative min-h-[420px] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent_60%,rgba(92,26,38,.6))] after:content-[''] max-lg:min-h-[260px] max-lg:after:bg-[linear-gradient(180deg,transparent_50%,rgba(92,26,38,.7))]">
              <img className={cx(COVER, "absolute inset-0")} src={img("assets/img/images/req-photo.jpg", "assets/img/home/setup-school.jpg")} alt="Students in uniform exploring a globe together in a modern school library" width={900} height={700} loading="lazy" decoding="async" />
            </div>
            <div className="p-14 max-xl:p-10 max-sm:px-5 max-sm:py-8">
              <Eyebrow light>For schools</Eyebrow>
              <H2 id="bh-request-title" light>Set Up Your School on <span>Bodhira.ai</span></H2>
              <p className={cx(P, "mt-0 mb-6 text-[17px] text-[rgba(255,244,230,.82)]")}>Tell us your school name and email and we will reach out to schedule a walkthrough and onboard your students.</p>
              <SiteStatus name="status" className={cx(P, "mt-0 mb-5 text-base block rounded-sm border border-[rgba(226,184,115,.35)] bg-[rgba(226,184,115,.15)] px-4 py-3 font-semibold text-gold-bright")} />
              <HomeRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Blog */}
      {posts.length > 0 && (
        <section className={cx(SECTION, "bg-cream")} aria-labelledby="bh-blog-title">
          <div className="site-container">
            <div className={HEAD_SPLIT} data-reveal>
              <div>
                <Eyebrow>From the Bodhira.ai blog</Eyebrow>
                <H2 id="bh-blog-title" flush>Insights, Ideas <span>&amp; Updates</span></H2>
              </div>
              <a href="/blog" className={cx(textLink(), FOCUS, "mb-2 justify-self-end max-lg:justify-self-start")}>View all articles <Icon name="arrowRight" size={16} /></a>
            </div>
            <ul className="m-0 grid list-none grid-cols-3 gap-6 p-0 *:min-w-0 max-lg:grid-cols-2 max-md:grid-cols-1" data-reveal>
              {posts.map((post, i) => (
                <li key={post.id} className="group/post flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-xs transition-[translate,box-shadow] duration-300 ease-bh hover:-translate-y-1 hover:shadow-lg">
                  <a href={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-cream-2" tabIndex={-1} aria-hidden="true">
                    <img src={mediaUrl(post.cover_image_url) ?? asset(BLOG_FALLBACKS[i % BLOG_FALLBACKS.length])} alt="" width={800} height={520} loading="lazy" decoding="async" className={cx(COVER, "transition-[scale] duration-[600ms] ease-bh group-hover/post:scale-[1.05]")} />
                  </a>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted">
                      {post.category && <span className="rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold text-wine">{post.category.name}</span>}
                      {post.published_at && <time dateTime={post.published_at}>{fmtDate(post.published_at, "M d, Y")}</time>}
                    </div>
                    <h3 className={cx(H, "mb-2 text-[19px] leading-[1.35] font-bold tracking-[-.015em] text-ink")}><a href={`/blog/${post.slug}`} className={cx("text-ink hover:text-wine", FOCUS)}>{post.title}</a></h3>
                    {post.excerpt && <p className={cx(P, "mt-0 mb-4 text-[15px] text-muted")}>{post.excerpt}</p>}
                    <a href={`/blog/${post.slug}`} className={cx(textLink("sm"), FOCUS, "mt-auto")}>Read more<span className="sr-only">: {post.title}</span> <Icon name="arrowRight" size={14} /></a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {homeVideo && <HomeVideo url={homeVideo} />}
      <RevealOnScroll />
    </div>
  );
}

/** Photos in the "What every student gets" collage. */
const COLLAGE = "block h-full w-full max-w-full rounded-[20px] object-cover shadow-md";
