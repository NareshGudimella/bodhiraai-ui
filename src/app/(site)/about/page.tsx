import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon, type IconName } from "@/components/site/icons";
import { initials } from "@/components/site/initials";
import { CtaBand, Eyebrow, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import {
  BTN_FOCUS,
  BTN_FOCUS_DARK,
  COLS,
  COVER_IMG,
  Counters,
  GRID,
  HeroBadge,
  LIST,
  MEDIA_BODY,
  MEDIA_CARD,
  MEDIA_IMG,
  MEDIA_THUMB,
  P,
  PAGE,
  PEOPLE,
  PERSON,
  PERSON_BODY,
  PERSON_IMG,
  PERSON_NAME,
  PERSON_PHOTO,
  PERSON_ROLE,
  PLAY,
  PersonPlaceholder,
  card,
  h3,
  section,
  tile,
} from "@/components/site/kit-content-ui";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx, h2Class, lead } from "@/components/site/ui";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { Testimonials, type Testimonial } from "@/components/site/testimonials";
import { mediaUrl } from "@/lib/media";
import { imageResolver, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getChrome, getCollections } from "@/lib/site-api";
import { CONTACT_FALLBACK } from "@/lib/site-business";
import { SITE_STATS } from "@/lib/site-stats";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/about", 'About Bodhira.ai — Built for Schools, Students & Parents');
}

const VIDEO = "https://youtu.be/JwC-Qx1lJso";

const VALUES: [IconName, string, string][] = [
  ["eye", "Our Vision", "To create a world where every child can understand, enjoy, and excel in learning through technology-driven, visual, and accessible education."],
  ["target", "Our Mission", "To empower schools, teachers, students and parents with a unified platform that turns complex concepts into engaging experiences through visual content, AI assistance and personalized learning pathways."],
  ["lightbulb", "Understood, Not Memorized", "Students learn better when they can see, experience and interact with concepts. We turn lessons into visual experiences that improve comprehension, retention and confidence."],
];

/**
 * Official counts only (SITE_STATS). Compliance pass (not in legacy, 2026-11-22):
 * "15,485+ Lessons Delivered" and "97.55% School Satisfaction" were removed (no
 * data behind them); parents and subjects take their place.
 */
const COUNTERS: [IconName, string, string][] = [
  ["users", SITE_STATS.students.label, "Students Onboarded"],
  ["heart", SITE_STATS.parents.label, SITE_STATS.parents.noun],
  ["bookOpen", SITE_STATS.subjects.label, SITE_STATS.subjects.noun],
  ["school", SITE_STATS.schools.label, "Partner Schools"],
];

/** Shown when the CMS has no team: the four dashboards (legacy team-men-N.png keys still override the photos). */
const ROLES: [string, string, string][] = [
  ["Student", "assets/img/pages/role-student.jpg", "A schoolgirl in uniform reading a textbook in the school library"],
  ["Teacher", "assets/img/pages/role-teacher.jpg", "A teacher explaining something to a group of schoolboys"],
  ["Parent", "assets/img/pages/role-parent.jpg", "A mother singing with her children at the harmonium at home"],
  ["School Admin", "assets/img/pages/role-admin.jpg", "A school administrator at her desk in the school office"],
];

const VIDEOS: [string, string, string, string, string][] = [
  [
    "assets/img/images/video-img-1.png",
    "assets/img/pages/video-lessons.jpg",
    "Students in uniform watching a lesson together on a laptop",
    "Watch Lessons by Topic",
    "Every subject is broken down into lessons and topics — students pick a topic, watch the video, and finish a short quiz right after.",
  ],
  [
    "assets/img/images/video-img-2.png",
    "assets/img/pages/video-feedback.jpg",
    "A teacher going over a student's answers with him at his desk",
    "Take a Quiz, Get Feedback",
    // not in legacy: legacy repeated the first card's text here.
    "Each lesson ends with a short, auto-graded quiz, so students see straight away what they have understood, and the scores reach their teacher and parents.",
  ],
];

/**
 * Legacy resources/views/about.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same sections, copy,
 * links, CMS team and testimonials, and YouTube pop-ups (VideoPopup on
 * `.video-popup`, was the theme's VenoBox); new layout and photos (public/assets/img/pages, credits in
 * CREDITS.md). A replacement saved in the Site Image Manager under a legacy
 * image key still wins over the new photo. Differences from legacy: counts
 * come from SITE_STATS and are not animated; the support number comes from the
 * `contact.phone` setting (legacy hard-coded a placeholder, kept as fallback);
 * the second video card no longer repeats the first card's text.
 * Tailwind since the migration's phase 2 (was `.bh-page` kit classes).
 */
/** Two columns that stack under 992px (was `bp-split`; `media` = `--media-wide`). */
const split = (media?: boolean) =>
  cx("grid items-center gap-20 *:min-w-0 max-xl:gap-12 max-lg:grid-cols-1", media ? "grid-cols-[1.05fr_1fr]" : "grid-cols-2");
/** A card's closing paragraph. */
const CARD_P = cx(P, "mb-0 text-base text-body");

export default async function AboutPage() {
  await connection();
  const [img, setting, { images }, { team, testimonials }] = await Promise.all([imageResolver(), settingResolver(), getChrome(), getCollections()]);
  const phone = setting("contact.phone", CONTACT_FALLBACK.phone);
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const quotes: Testimonial[] = testimonials
    .filter((t) => t.quote)
    .map((t) => ({ id: t.id, name: t.name, role: t.role, company: t.company || null, quote: t.quote ?? "", avatar: mediaUrl(t.avatar_url ?? null) ?? null, rating: t.rating ? Math.max(1, Math.min(5, t.rating)) : null }));

  return (
    <div className={PAGE}>
      <SeoSchema path="about" />

      <PageHero
        eyebrow="About Us"
        title="Made for Schools. Built Around Students, Teachers &"
        highlight="Parents."
        lead="Bodhira.ai is not just another LMS platform — it is a complete digital learning infrastructure built for schools and educational institutions that want to modernize learning, streamline operations, and improve student engagement."
        breadcrumbs={[{ label: "About Us" }]}
        image={{ src: img(null, "assets/img/pages/about-hero.jpg"), alt: "Two students in maroon school blazers reading together in a bright school library", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="/login" className={btn("maroon", "lg", BTN_FOCUS)}>Sign In <Icon name="arrowRight" size={18} /></a>
            <a href="/book-demo" className={btn("ghost", "lg", BTN_FOCUS)}>Book a Demo</a>
          </>
        }
        badge={
          <HeroBadge icon={<Icon name="school" size={20} />} value={SITE_STATS.schools.label} label="Partner schools" />
        }
      />

      {/* How Bodhira.ai works, with the overview video */}
      <section className={section()} aria-labelledby="about-how">
        <div className={cx("site-container", split(true))}>
          {/* Two-photo collage with the video button and a floating support chip */}
          <div className="relative pr-16 pb-[72px] max-lg:mx-auto max-lg:w-full max-lg:max-w-[640px] max-sm:pr-0 max-sm:pb-24" data-reveal>
            <div className="relative aspect-[10/7] overflow-hidden rounded-lg bg-cream-2 shadow-lg after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_45%,rgba(31,11,16,.35))] after:content-['']">
              <img src={img("assets/img/images/about-img-1.jpg", "assets/img/pages/about-classroom.jpg")} alt="Schoolgirls in uniform listening closely during a class" width={1200} height={840} loading="lazy" decoding="async" className={COVER_IMG} />
              <a className={cx("video-popup", PLAY)} data-autoplay="true" data-vbtype="video" href={VIDEO} aria-label="Play the Bodhira.ai overview video">
                <Icon name="play" size={26} className="fill-current" />
              </a>
            </div>
            <div className="absolute right-0 bottom-0 aspect-[4/3] w-[46%] overflow-hidden rounded-[20px] border-6 border-white shadow-lg max-sm:w-[52%]">
              <img src={img("assets/img/images/about-img-2.jpg", "assets/img/pages/about-map.jpg")} alt="A young student pointing to a map of India during a geography lesson" width={640} height={480} loading="lazy" decoding="async" className={COVER_IMG} />
            </div>
            <a
              className="absolute bottom-4 left-6 z-3 flex items-center gap-3 rounded-md bg-grad-maroon py-3 pr-5 pl-3 text-white shadow-[0_20px_40px_-16px_rgba(92,26,38,.7)] [transition:transform_.2s_var(--ease-bh)] hover:[transform:translateY(-2px)] hover:text-white focus-visible:rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright max-sm:bottom-2 max-sm:left-0 max-sm:py-2.5 max-sm:pr-3.5 max-sm:pl-2.5"
              href={tel}
            >
              <span className={tile("light", { sm: true })}><Icon name="phone" size={20} /></span>
              <span>
                <span className="block text-[11.5px] font-bold tracking-[.1em] text-gold-bright uppercase">Institutional Support</span>
                <span className="block text-[17px] font-bold tracking-[-.01em] whitespace-nowrap text-white max-sm:text-[15px]">{phone}</span>
              </span>
            </a>
          </div>
          <div data-reveal>
            <Eyebrow>How Bodhira.ai works</Eyebrow>
            <h2 id="about-how" className={h2Class()}>One Integrated Environment for <span>Your Whole School</span></h2>
            <p className={lead()}>
              The platform brings learning management, academic workflows, performance analytics, AI-powered tools, parent engagement, and
              institution administration together in one integrated environment.
            </p>
            <div className="mb-8 grid grid-cols-2 gap-4 *:min-w-0 max-sm:grid-cols-1">
              {(
                [
                  ["users", SITE_STATS.students.label, "Students learning across partner schools"],
                  ["heart", SITE_STATS.parents.label, "Parents following their child’s progress"],
                ] as const
              ).map(([icon, num, text]) => (
                <div key={icon} className="flex items-start gap-3.5 rounded-md border border-line bg-cream p-5">
                  <span className={tile("white", { sm: true })}><Icon name={icon} size={22} /></span>
                  <span>
                    <strong className="mb-1 block text-[28px] leading-[1.05] font-extrabold tracking-[-.03em] text-ink tabular-nums">{num}</strong>
                    <span className="block text-[14px] leading-[1.45] text-muted">{text}</span>
                  </span>
                </div>
              ))}
            </div>
            <a href="/login" className={btn("maroon", "md", BTN_FOCUS)}>Sign In <Icon name="arrowRight" size={18} /></a>
          </div>
        </div>
      </section>

      {/* What drives us */}
      <section className={section("cream")} aria-labelledby="about-values">
        <div className="site-container">
          <SectionHead id="about-values" eyebrow="What drives us" title="Built on a Simple Belief About" highlight="Learning" align="center" />
          <ul className={cx(LIST, GRID, COLS[3])}>
            {VALUES.map(([icon, title, text]) => (
              <li key={title} className={card({ cream: true, hover: true })} data-reveal>
                <span className={tile("default", { hover: true, extra: "mb-5" })}><Icon name={icon} size={24} /></span>
                <h3 className={h3()}>{title}</h3>
                <p className={CARD_P}>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Counters */}
      <section className={section("cream", { tight: true, flushTop: true })} aria-label="Bodhira.ai in numbers">
        <div className="site-container">
          <Counters items={COUNTERS.map(([icon, num, label]) => ({ key: label, icon: <Icon name={icon} size={24} />, value: num, label }))} />
        </div>
      </section>

      {/* Team (CMS), or the four dashboards when there is no team */}
      <section className={section()} aria-labelledby="about-team">
        <div className="site-container">
          {team.length ? (
            <SectionHead id="about-team" eyebrow="The people behind Bodhira.ai" title="Meet the" highlight="Team" align="center" />
          ) : (
            <SectionHead id="about-team" eyebrow="Dashboards built for each role" title="Designed Around the People Who" highlight="Use It Every Day" align="center" />
          )}
          <ul className={cx(LIST, GRID, PEOPLE)}>
            {team.length
              ? team.map((m, i) => {
                  const photo = mediaUrl(m.photo_url ?? null) ?? images[`assets/img/team/team-men-${(i % 4) + 1}.png`] ?? null;
                  return (
                    <li key={m.id} className={PERSON} data-reveal>
                      <div className={PERSON_PHOTO}>
                        {photo ? (
                          <img src={photo} alt={m.name} width={600} height={720} loading="lazy" decoding="async" className={PERSON_IMG} />
                        ) : (
                          <PersonPlaceholder initials={initials(m.name)} />
                        )}
                      </div>
                      <div className={PERSON_BODY}>
                        <h3 className={PERSON_NAME}>{m.name}</h3>
                        {m.role && <span className={PERSON_ROLE}>{m.role}</span>}
                        {m.bio && <p className="mt-2.5 mb-0 font-sans text-[14px] leading-[1.6] font-normal text-muted max-sm:text-[13px]">{strLimit(m.bio, 110)}</p>}
                      </div>
                    </li>
                  );
                })
              : ROLES.map(([name, src, alt], i) => (
                  <li key={name} className={PERSON} data-reveal>
                    <div className={PERSON_PHOTO}>
                      <img src={img(`assets/img/team/team-men-${i + 1}.png`, src)} alt={alt} width={600} height={720} loading="lazy" decoding="async" className={PERSON_IMG} />
                    </div>
                    <div className={PERSON_BODY}>
                      <h3 className={PERSON_NAME}>{name}</h3>
                      <span className={PERSON_ROLE}>See Their View</span>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </section>

      {/* What schools say: CMS testimonials only, hidden when there are none (compliance pass,
          not in legacy, 2026-11-22: the invented "Mrs. Sharma" fallback quote and the
          unattributed quote-style lead are gone). */}
      {quotes.length > 0 && (
      <section className={section("dark")} aria-labelledby="about-quotes">
        <div className={cx("site-container", split())}>
          <div data-reveal>
            <Eyebrow light>Why Bodhira.ai</Eyebrow>
            <h2 id="about-quotes" className={h2Class(true)}>What Schools <span>Say About Bodhira.ai</span></h2>
            <p className={cx(lead().replace(" text-body", ""), "text-[rgba(255,244,230,.82)]")}>
              In their own words: schools, teachers and parents on using Bodhira.ai.
            </p>
          </div>
          <div data-reveal>
            <Testimonials items={quotes} />
          </div>
        </div>
      </section>
      )}

      {/* How learning happens (videos) */}
      <section className={section("cream")} aria-labelledby="about-videos">
        <div className="site-container">
          <SectionHead id="about-videos" eyebrow="Our features" title="How Learning Happens on" highlight="Bodhira.ai" align="center" />
          <ul className={cx(LIST, GRID, COLS[2])}>
            {VIDEOS.map(([legacyKey, src, alt, title, text]) => (
              <li key={title} className={MEDIA_CARD} data-reveal>
                <div className={MEDIA_THUMB}>
                  <img src={img(legacyKey, src)} alt={alt} width={1200} height={750} loading="lazy" decoding="async" className={MEDIA_IMG} />
                  <a className={cx("video-popup", PLAY)} data-autoplay="true" data-vbtype="video" href={`${VIDEO}?feature=shared`} aria-label={`Play video: ${title}`}>
                    <Icon name="play" size={24} className="fill-current" />
                  </a>
                </div>
                <div className={MEDIA_BODY}>
                  <h3 className={h3()}>{title}</h3>
                  <p className={CARD_P}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={section("cream", { flushTop: true })} aria-label="Get started">
        <div className="site-container">
          <CtaBand
            title="See Bodhira.ai in Your School"
            text="Book a walkthrough for your school, or talk to our team about getting your students, teachers and parents started."
            actions={
              <>
                <a href="/book-demo" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Book a Demo <Icon name="arrowRight" size={18} /></a>
                <a href="/contact" className={btn("glass", "lg", BTN_FOCUS_DARK)}>Contact Us</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
