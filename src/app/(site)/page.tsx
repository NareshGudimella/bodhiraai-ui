import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon, type IconName } from "@/components/site/icons";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { SiteStatus } from "@/components/site/site-status";
import { initials } from "@/components/site/initials";
import { QuoteCard, Testimonials, type Testimonial } from "@/components/site/testimonials";
import { VdoPlayer } from "@/components/site/vdo-player";
import { mediaUrl } from "@/lib/media";
import { assetResolver, fmtDate, settingResolver, siteMetadata } from "@/lib/site";
import { getBlog, getChrome, getCollections, type PostCard } from "@/lib/site-api";
import { contactSubmit } from "@/lib/site-actions";
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
const COUNTERS: [IconName, string, string][] = [
  ["users", SITE_STATS.students.label, SITE_STATS.students.noun],
  ["presentation", "15,485+", "Classes Completed"],
  ["smile", "97.55%", "Satisfaction Rate"],
  ["school", SITE_STATS.schools.label, SITE_STATS.schools.noun],
];
const FAQS = [
  ["Does Bodhira.ai work on a mobile phone?", "Yes. Bodhira.ai is mobile-first. Students watch lessons, take quizzes, and ask the AI on a phone, tablet or laptop — videos resume where they paused, even on a different device."],
  ["How does the “Ask AI” feature work?", "While watching a lesson, a student can click “Ask AI”, type a question, and get a clear explanation in plain words. The AI uses only that lesson’s content, so the answer always matches what the student is studying."],
  ["Do parents get their own login?", "Yes. Each parent gets a separate login linked to their child. They see lessons watched, quiz scores, weak subjects, attendance and teacher notes — in real time."],
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

/** Short section label (replaces the theme's bolt-icon sub-headings). */
function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`bh-eyebrow${light ? " bh-eyebrow--light" : ""}`}>{children}</p>;
}

/**
 * Homepage. Legacy resources/views/home.blade.php, redesigned in 2026 (not in
 * legacy): every legacy section is kept (hero, about + video, subjects, why
 * schools choose, counters, FAQ, team, "what every student gets", school
 * onboarding form, blog) with a new layout, new photos (public/assets/img/home,
 * credits in CREDITS.md) and the styles in public/assets/css/home.css, scoped
 * to `.bh-home`. Added from the 2026 reference: impact stats + CMS
 * testimonials, the "Build a better learning future" card, real blog posts.
 * Images go through the Site Image Manager: a replacement saved under the
 * legacy key of an image with the same role still wins, else the new file
 * (itself replaceable under its own key).
 */
export default async function HomePage() {
  await connection();
  const [asset, setting, { images }, { team: allTeam, testimonials }, posts] = await Promise.all([
    assetResolver(),
    settingResolver(),
    getChrome(),
    getCollections(),
    latestPosts(),
  ]);
  /** A Site Image Manager replacement under the legacy key, else the new default (through asset()). */
  const img = (legacyKey: string, fallback: string) => images[legacyKey] ?? asset(fallback);
  const team = allTeam.slice(0, 3);
  const phone = setting("contact.phone", "+91 99852 52786");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const quotes: Testimonial[] = testimonials
    .filter((t) => t.quote)
    .map((t) => ({ id: t.id, name: t.name, role: t.role, company: t.company || null, quote: t.quote ?? "", avatar: mediaUrl(t.avatar_url ?? null) ?? null, rating: Math.max(1, Math.min(5, t.rating ?? 5)) }));

  return (
    <div className="bh-home">
      <SeoSchema path="home" />

      {/* 1. Hero */}
      <section className="bh-hero" aria-labelledby="bh-hero-title">
        <div className="bh-container bh-hero__grid">
          <div className="bh-hero__copy">
            <Eyebrow>Welcome to Bodhira.ai</Eyebrow>
            <h1 id="bh-hero-title" className="bh-hero__title">Every Child&rsquo;s Learning <span>Begins Here</span></h1>
            <p className="bh-hero__lead">
              Transforming education through visual learning, AI-powered insights and interactive digital experiences.
              Bodhira.ai is a complete learning ecosystem where every child can <strong>Learn. Visualize. Understand. Excel.</strong>
            </p>
            <div className="bh-hero__ctas">
              <a href="/book-demo" className="bh-btn bh-btn--maroon bh-btn--lg">Book a Demo <Icon name="arrowRight" size={18} /></a>
              <a href="/register/student" className="bh-btn bh-btn--ghost bh-btn--lg">Get Started</a>
            </div>
            <div className="bh-trust">
              <ul className="bh-trust__faces" aria-hidden="true">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n}><img src={img(`assets/img/images/hero-author-${n}.png`, `assets/img/home/avatar-${n}.jpg`)} alt="" width={44} height={44} /></li>
                ))}
              </ul>
              <div>
                <p className="bh-trust__big"><strong>{SITE_STATS.students.label}</strong> Students Learning</p>
                <p className="bh-trust__small">Trusted by <strong>{SITE_STATS.schools.label}</strong> schools across India</p>
              </div>
            </div>
          </div>

          <div className="bh-hero__visual">
            <div className="bh-hero__photo">
              <img
                src={img("assets/img/portrait-happy-cute-little-indian-260nw-2542824705.jpg", "assets/img/home/hero-students.jpg")}
                alt="A teacher using an interactive display with students in uniform in a bright, modern classroom"
                width={1400}
                height={1470}
                fetchPriority="high"
              />
            </div>
            <div className="bh-glass bh-hero__stat">
              <span className="bh-glass__ic"><Icon name="bookOpen" size={22} /></span>
              <span><strong>{SITE_STATS.subjects.label}</strong><span>Subjects &amp; Topics</span></span>
            </div>
            <div className="bh-glass bh-hero__ai">
              <span className="bh-glass__ic bh-glass__ic--gold"><Icon name="sparkles" size={20} /></span>
              <span><strong>Ask AI</strong><span>Doubts solved in every lesson</span></span>
            </div>
            <div className="bh-glass bh-hero__progress" aria-hidden="true">
              <span className="bh-hero__progress-head"><Icon name="chart" size={16} /> Weekly progress</span>
              <span className="bh-bars"><i style={{ height: "40%" }} /><i style={{ height: "62%" }} /><i style={{ height: "50%" }} /><i style={{ height: "78%" }} /><i style={{ height: "92%" }} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About: how it works, with the marketing video */}
      <section className="bh-section bh-about" aria-labelledby="bh-about-title">
        <div className="bh-container bh-about__grid">
          <div className="bh-about__media" data-reveal>
            <div className="bh-about__main">
              <img
                src={img("assets/img/images/about-img-1.jpg", "assets/img/home/how-it-works-classroom.jpg")}
                alt="A mother and her son following a lesson together on a tablet at home"
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
              />
              <button
                type="button"
                className="vdo-play bh-play"
                data-vdo-video={setting("media.home_video_id", "a69b203eb0fe4c5196ecf06e6261c66c")}
                aria-label="Play the Bodhira.ai overview video"
              >
                <Icon name="play" size={26} className="bh-icon--fill" />
              </button>
            </div>
            <div className="bh-about__second">
              <img
                src={img("assets/img/images/about-img-2.jpg", "assets/img/home/about-smart-classroom.jpg")}
                alt="A teacher leading a biology lesson with anatomy models for students in uniform"
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
              />
            </div>
            <a className="bh-support" href={tel}>
              <span className="bh-support__ic"><Icon name="phone" size={20} /></span>
              <span>
                <span className="bh-support__label">School Support</span>
                <span className="bh-support__num">{phone}</span>
              </span>
            </a>
          </div>
          <div className="bh-about__copy" data-reveal>
            <Eyebrow>How Bodhira.ai works</Eyebrow>
            <h2 id="bh-about-title" className="bh-h2">How Bodhira.ai Works for Your <span>School, Students &amp; Parents</span></h2>
            <p className="bh-lead">
              Bodhira.ai brings learning management, academic workflows, AI-powered tools, performance analytics, parent engagement and
              institution-wide administration together in a single integrated environment &mdash; empowering students to learn smarter,
              teachers to teach efficiently and institutions to operate effortlessly.
            </p>
            <div className="bh-about__stats">
              <div className="bh-stat">
                <span className="bh-stat__ic"><Icon name="users" size={22} /></span>
                <span><strong>{SITE_STATS.students.label}</strong><span>Students actively learning across partner schools</span></span>
              </div>
              <div className="bh-stat">
                <span className="bh-stat__ic"><Icon name="heart" size={22} /></span>
                <span><strong>{SITE_STATS.parents.label}</strong><span>Parents following their child&rsquo;s progress every week</span></span>
              </div>
            </div>
            <a href="/login" className="bh-btn bh-btn--maroon">Sign In <Icon name="arrowRight" size={18} /></a>
          </div>
        </div>
      </section>

      {/* 3. Subjects and classes */}
      <section className="bh-section bh-subjects" aria-labelledby="bh-subjects-title">
        <div className="bh-container">
          <div className="bh-subjects__layout">
            <div className="bh-subjects__media" data-reveal>
              <img
                src={img("assets/img/images/subjects-student.webp", "assets/img/home/subjects-student.jpg")}
                alt="A smiling schoolgirl in uniform with her school bag"
                width={600}
                height={760}
                loading="lazy"
                decoding="async"
              />
              <span className="bh-glass bh-subjects__badge"><Icon name="layers" size={18} /> Class 1 to 12</span>
            </div>
            <div data-reveal>
              <div className="bh-head">
                <Eyebrow>Subjects available</Eyebrow>
                <h2 id="bh-subjects-title" className="bh-h2">Every Major Subject. Every Class. <span>One Platform.</span></h2>
              </div>
              <ul className="bh-subject-grid">
                {SUBJECTS.map(([icon, name, sub]) => (
                  <li key={name} className="bh-subject">
                    <span className="bh-subject__ic"><Icon name={icon} size={22} /></span>
                    <span>
                      <span className="bh-subject__name">{name}</span>
                      <span className="bh-subject__sub" lang={name === "Hindi" ? "hi" : undefined}>{sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="bh-classes">
                <span className="bh-classes__label">Browse by class</span>
                <ul>
                  {CLASSES.map(([icon, label]) => (
                    <li key={label}><a href="/courses" className="bh-chip"><Icon name={icon} size={16} />{label}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why schools choose Bodhira.ai (bento) */}
      <section className="bh-section bh-why" aria-labelledby="bh-why-title">
        <div className="bh-container">
          <div className="bh-head bh-head--split" data-reveal>
            <div>
              <Eyebrow>Why schools choose Bodhira.ai</Eyebrow>
              <h2 id="bh-why-title" className="bh-h2">Built Around the Way Your School <span>Already Teaches</span></h2>
            </div>
            <p className="bh-lead">No new routine to learn: lessons, quizzes, notes and reports follow your syllabus, your timetable and your teachers.</p>
          </div>
          <div className="bh-bento">
            <article className="bh-bento__card bh-bento__card--hero" data-reveal>
              <img src={img("assets/img/images/promo-img-1.png", "assets/img/home/why-video-lessons.jpg")} alt="" width={1000} height={760} loading="lazy" decoding="async" />
              <div className="bh-bento__overlay">
                <span className="bh-bento__ic bh-bento__ic--light"><Icon name="play" size={20} /></span>
                <h3>Video Lessons + Ask AI</h3>
                <p>Students watch lessons by topic and click &ldquo;Ask AI&rdquo; whenever something is unclear.</p>
                <span className="bh-glass bh-bento__chip"><Icon name="sparkles" size={16} /> &ldquo;Why does ice float?&rdquo; &rarr; answered from this lesson</span>
              </div>
            </article>
            <article className="bh-bento__card bh-bento__card--split" data-reveal>
              <div className="bh-bento__text">
                <span className="bh-bento__ic"><Icon name="listChecks" size={20} /></span>
                <h3>Quizzes, Notes &amp; Discussions</h3>
                <p>Auto-graded quizzes after every lesson, with notes and class discussions in the same place.</p>
              </div>
              <img src={img("assets/img/images/promo-img-2.png", "assets/img/home/why-quizzes.jpg")} alt="" width={800} height={560} loading="lazy" decoding="async" />
            </article>
            <article className="bh-bento__card bh-bento__card--dark bh-bento__card--split" data-reveal>
              <div className="bh-bento__text">
                <span className="bh-bento__ic bh-bento__ic--gold"><Icon name="dashboard" size={20} /></span>
                <h3>Teacher &amp; Parent Dashboards</h3>
                <p>Teachers and parents see lessons watched, quiz scores and weak topics in real time.</p>
              </div>
              <img src={img("assets/img/images/promo-img-3.png", "assets/img/home/why-dashboards.jpg")} alt="" width={800} height={560} loading="lazy" decoding="async" />
            </article>
          </div>
        </div>
      </section>

      {/* 5. Counters */}
      <section className="bh-counters" aria-label="Bodhira.ai in numbers">
        <div className="bh-container">
          <ul className="bh-counters__grid" data-reveal>
            {COUNTERS.map(([icon, num, label]) => (
              <li key={label}>
                <span className="bh-counters__ic"><Icon name={icon} size={24} /></span>
                <strong>{num}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="bh-section bh-faq" aria-labelledby="bh-faq-title">
        <div className="bh-container bh-faq__grid">
          <div className="bh-faq__media" data-reveal>
            <img
              src={img("assets/img/images/faq-img.png", "assets/img/home/faq-students.jpg")}
              alt="School children in uniform at an outdoor assembly"
              width={720}
              height={960}
              loading="lazy"
              decoding="async"
            />
            <div className="bh-glass bh-faq__students">
              <span className="bh-faq__students-label">Total Students</span>
              <ul>
                {[1, 2, 3, 4].map((n) => (
                  <li key={n}><img src={img(`assets/img/images/faq-thumb-${n}.png`, `assets/img/home/faq-thumb-${n}.jpg`)} alt="" width={40} height={40} loading="lazy" /></li>
                ))}
                <li className="bh-faq__more">{SITE_STATS.students.label}</li>
              </ul>
            </div>
          </div>
          <div data-reveal>
            <Eyebrow>Frequently asked</Eyebrow>
            <h2 id="bh-faq-title" className="bh-h2">Everything Schools, Parents and Teachers <span>Ask Before They Sign Up</span></h2>
            <div className="bh-accordion">
              {FAQS.map(([q, a], i) => (
                <details key={q} name="home-faq" open={i === 0}>
                  <summary>
                    <span className="bh-accordion__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="bh-accordion__q">{q}</span>
                    <Icon name="chevronDown" size={20} className="bh-accordion__chev" />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
            <a href="/faq" className="bh-link">See all questions <Icon name="arrowRight" size={16} /></a>
          </div>
        </div>
      </section>

      {/* Impact + testimonials (2026 reference) */}
      <section className="bh-section bh-impact" aria-labelledby="bh-impact-title">
        <div className="bh-container">
          <div className={`bh-impact__grid${team.length && quotes.length ? "" : " bh-impact__grid--solo"}`}>
            <div className="bh-impact__intro" data-reveal>
              <Eyebrow>Our impact</Eyebrow>
              <h2 id="bh-impact-title" className="bh-h2">A Growing Community <span>of Learners</span></h2>
              <p className="bh-lead">Thousands of students, teachers and schools trust Bodhira.ai for better learning outcomes.</p>
              <ul className="bh-impact__stats">
                {IMPACT.map(([icon, num, label]) => (
                  <li key={label}>
                    <span className="bh-impact__ic"><Icon name={icon} size={20} /></span>
                    <strong>{num}</strong>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <a href="/success-stories" className="bh-btn bh-btn--maroon">Discover More <Icon name="arrowRight" size={18} /></a>
            </div>
            {team.length > 0 && quotes.length > 0 && (
              <div className="bh-impact__quotes" data-reveal>
                <Eyebrow>Testimonials</Eyebrow>
                <h3 className="bh-h3">What Our Users Say</h3>
                <Testimonials items={quotes} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Team (CMS), or legacy's "In Their Words" when there is no team; with the reference's CTA card */}
      <section className="bh-section bh-team" aria-labelledby="bh-team-title">
        <div className="bh-container">
          {team.length > 0 ? (
            <>
              <div className="bh-head bh-head--center" data-reveal>
                <Eyebrow>The people behind Bodhira.ai</Eyebrow>
                <h2 id="bh-team-title" className="bh-h2">Meet the Team</h2>
              </div>
              <ul className="bh-team__list" data-reveal>
                {team.map((m, i) => {
                  const photo = mediaUrl(m.photo_url ?? null) ?? images[`assets/img/team/team-${(i % 4) + 1}.png`] ?? null;
                  return (
                    <li key={m.id} className="bh-member">
                      <div className="bh-member__photo">
                        {photo ? (
                          <img src={photo} alt={m.name} width={400} height={400} loading="lazy" decoding="async" />
                        ) : (
                          <span className="bh-member__placeholder" aria-hidden="true"><span>{initials(m.name)}</span></span>
                        )}
                      </div>
                      <div className="bh-member__body">
                        <h3 className="bh-member__name">{m.name}</h3>
                        {m.role && <p className="bh-member__role">{m.role}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            quotes.length > 0 && (
              <>
                <div className="bh-head bh-head--center" data-reveal>
                  <Eyebrow>In their words</Eyebrow>
                  <h2 id="bh-team-title" className="bh-h2">Schools, Teachers and Parents on Bodhira.ai</h2>
                </div>
                <div className="bh-quote-grid" data-reveal>
                  {quotes.slice(0, 3).map((t) => <QuoteCard key={t.id} t={t} />)}
                </div>
              </>
            )
          )}

          <div className="bh-cta" data-reveal>
            <img className="bh-cta__bg" src={asset("assets/img/home/cta-school-campus.jpg")} alt="" width={1000} height={700} loading="lazy" decoding="async" />
            <div className="bh-cta__body">
              <h2 className="bh-cta__title">Let&rsquo;s Build a Better Learning Future Together</h2>
              <p>Partner with us to bring visual, AI-assisted learning to every classroom in your school.</p>
              <div className="bh-cta__actions">
                <a href="/contact" className="bh-btn bh-btn--gold">Contact Us <Icon name="arrowRight" size={18} /></a>
                <a href="/book-demo" className="bh-btn bh-btn--glass">Book a Demo</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. What every student gets */}
      <section className="bh-section bh-content" aria-labelledby="bh-content-title">
        <div className="bh-container bh-content__grid">
          <div className="bh-content__collage" data-reveal>
            <img className="bh-content__img1" src={img("assets/img/images/content-img-1.png", "assets/img/home/content-tablet.jpg")} alt="A student attending an online lesson on a laptop at home" width={800} height={600} loading="lazy" decoding="async" />
            <img className="bh-content__img2" src={img("assets/img/images/content-img-2.png", "assets/img/home/content-student.jpg")} alt="A schoolboy in uniform" width={600} height={600} loading="lazy" decoding="async" />
            <img className="bh-content__img3" src={img("assets/img/images/content-img-3.png", "assets/img/home/content-classroom.jpg")} alt="A student presenting the map of India in class" width={600} height={750} loading="lazy" decoding="async" />
            <span className="bh-glass bh-content__badge"><Icon name="award" size={18} /> Badges for every milestone</span>
          </div>
          <div data-reveal>
            <Eyebrow>What every student gets</Eyebrow>
            <h2 id="bh-content-title" className="bh-h2">Lessons, Quizzes and Progress <span>All in One Place</span></h2>
            <p className="bh-lead">
              Students unlock the subjects they study, watch curriculum-aligned lessons by topic, finish short quizzes after each lesson,
              and earn badges as they progress. Parents and teachers see all of it.
            </p>
            <ul className="bh-feature-list">
              <li>
                <span className="bh-feature-list__ic"><Icon name="play" size={20} /></span>
                <span><strong>Video Lessons + Ask AI</strong><span>Short, curriculum-aligned lessons by topic, with an AI tutor that answers from the lesson itself.</span></span>
              </li>
              <li>
                <span className="bh-feature-list__ic"><Icon name="check" size={20} /></span>
                <span><strong>Every Lesson Has a Quiz</strong><span>Auto-graded quizzes after every lesson. Scores go straight to the teacher and parent.</span></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Set up your school (onboarding request) */}
      <section className="bh-request" id="setup-school" aria-labelledby="bh-request-title">
        <div className="bh-container">
          <div className="bh-request__card">
            <div className="bh-request__photo">
              <img src={img("assets/img/images/req-photo.jpg", "assets/img/home/setup-school.jpg")} alt="Students in uniform exploring a globe together in a modern school library" width={900} height={700} loading="lazy" decoding="async" />
            </div>
            <div className="bh-request__body">
              <Eyebrow light>For schools</Eyebrow>
              <h2 id="bh-request-title" className="bh-h2 bh-h2--light">Set Up Your School on <span>Bodhira.ai</span></h2>
              <p className="bh-request__desc">Tell us your school name and email and we will reach out to schedule a walkthrough and onboard your students.</p>
              <SiteStatus name="status" className="bh-request__status" />
              <form action={contactSubmit} className="bh-form">
                <input type="hidden" name="subject" value="School onboarding request" />
                <div className="bh-form__row">
                  <label className="bh-field">
                    <span>School name</span>
                    <input type="text" id="name" name="name" placeholder="e.g. Sunrise Public School" required autoComplete="organization" />
                  </label>
                  <label className="bh-field">
                    <span>Email address</span>
                    <input type="email" id="email" name="email" placeholder="you@school.edu.in" required autoComplete="email" />
                  </label>
                </div>
                <button className="bh-btn bh-btn--gold bh-btn--lg" type="submit">Request a Walkthrough <Icon name="arrowRight" size={18} /></button>
                <p className="bh-form__note"><Icon name="shield" size={14} /> We only use these details to contact you about onboarding.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Blog */}
      {posts.length > 0 && (
        <section className="bh-section bh-blog" aria-labelledby="bh-blog-title">
          <div className="bh-container">
            <div className="bh-head bh-head--split" data-reveal>
              <div>
                <Eyebrow>From the Bodhira.ai blog</Eyebrow>
                <h2 id="bh-blog-title" className="bh-h2">Insights, Ideas <span>&amp; Updates</span></h2>
              </div>
              <a href="/blog" className="bh-link">View all articles <Icon name="arrowRight" size={16} /></a>
            </div>
            <ul className="bh-blog__list" data-reveal>
              {posts.map((post, i) => (
                <li key={post.id} className="bh-post">
                  <a href={`/blog/${post.slug}`} className="bh-post__thumb" tabIndex={-1} aria-hidden="true">
                    <img src={mediaUrl(post.cover_image_url) ?? asset(BLOG_FALLBACKS[i % BLOG_FALLBACKS.length])} alt="" width={800} height={520} loading="lazy" decoding="async" />
                  </a>
                  <div className="bh-post__body">
                    <div className="bh-post__meta">
                      {post.category && <span className="bh-post__cat">{post.category.name}</span>}
                      {post.published_at && <time dateTime={post.published_at}>{fmtDate(post.published_at, "M d, Y")}</time>}
                    </div>
                    <h3 className="bh-post__title"><a href={`/blog/${post.slug}`}>{post.title}</a></h3>
                    {post.excerpt && <p className="bh-post__excerpt">{post.excerpt}</p>}
                    <a href={`/blog/${post.slug}`} className="bh-link bh-link--sm">Read more<span className="bh-sr-only">: {post.title}</span> <Icon name="arrowRight" size={14} /></a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <VdoPlayer />
      <RevealOnScroll />
    </div>
  );
}
