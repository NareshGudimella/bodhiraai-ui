import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon, type IconName } from "@/components/site/icons";
import { initials } from "@/components/site/initials";
import { CtaBand, Eyebrow, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { Testimonials, type Testimonial } from "@/components/site/testimonials";
import { mediaUrl } from "@/lib/media";
import { imageResolver, settingResolver, siteMetadata, strLimit } from "@/lib/site";
import { getChrome, getCollections } from "@/lib/site-api";
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

const COUNTERS: [IconName, string, string][] = [
  ["users", SITE_STATS.students.label, "Students Onboarded"],
  ["presentation", "15,485+", "Lessons Delivered"],
  ["smile", "97.55%", "School Satisfaction"],
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
 * links, CMS team and testimonials, and YouTube pop-ups (theme VenoBox on
 * `.video-popup`); new layout and photos (public/assets/img/pages, credits in
 * CREDITS.md). A replacement saved in the Site Image Manager under a legacy
 * image key still wins over the new photo. Differences from legacy: counts
 * come from SITE_STATS and are not animated; the support number comes from the
 * `contact.phone` setting (legacy hard-coded a placeholder, kept as fallback);
 * the second video card no longer repeats the first card's text.
 */
export default async function AboutPage() {
  await connection();
  const [img, setting, { images }, { team, testimonials }] = await Promise.all([imageResolver(), settingResolver(), getChrome(), getCollections()]);
  const phone = setting("contact.phone", "+91 80000 00000");
  const tel = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const quotes: Testimonial[] = testimonials
    .filter((t) => t.quote)
    .map((t) => ({ id: t.id, name: t.name, role: t.role, company: t.company || null, quote: t.quote ?? "", avatar: mediaUrl(t.avatar_url ?? null) ?? null, rating: Math.max(1, Math.min(5, t.rating ?? 5)) }));

  return (
    <div className="bh-page">
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
            <a href="/login" className="bh-btn bh-btn--maroon bh-btn--lg">Sign In <Icon name="arrowRight" size={18} /></a>
            <a href="/book-demo" className="bh-btn bh-btn--ghost bh-btn--lg">Book a Demo</a>
          </>
        }
        badge={
          <span className="bp-glass">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><Icon name="school" size={20} /></span>
            <span><strong>{SITE_STATS.schools.label}</strong><span>Partner schools</span></span>
          </span>
        }
      />

      {/* How Bodhira.ai works, with the overview video */}
      <section className="bp-section" aria-labelledby="about-how">
        <div className="bh-container bp-split bp-split--media-wide">
          <div className="bp-collage" data-reveal>
            <div className="bp-photo bp-collage__main">
              <img src={img("assets/img/images/about-img-1.jpg", "assets/img/pages/about-classroom.jpg")} alt="Schoolgirls in uniform listening closely during a class" width={1200} height={840} loading="lazy" decoding="async" />
              <a className="video-popup bp-play" data-autoplay="true" data-vbtype="video" href={VIDEO} aria-label="Play the Bodhira.ai overview video">
                <Icon name="play" size={26} className="bh-icon--fill" />
              </a>
            </div>
            <div className="bp-collage__second">
              <img src={img("assets/img/images/about-img-2.jpg", "assets/img/pages/about-map.jpg")} alt="A young student pointing to a map of India during a geography lesson" width={640} height={480} loading="lazy" decoding="async" />
            </div>
            <a className="bp-collage__chip bp-on-dark" href={tel}>
              <span className="bp-tile bp-tile--sm bp-tile--light"><Icon name="phone" size={20} /></span>
              <span>
                <span className="bp-collage__label">Institutional Support</span>
                <span className="bp-collage__num">{phone}</span>
              </span>
            </a>
          </div>
          <div data-reveal>
            <Eyebrow>How Bodhira.ai works</Eyebrow>
            <h2 id="about-how" className="bp-h2">One Integrated Environment for <span>Your Whole School</span></h2>
            <p className="bp-lead">
              The platform brings learning management, academic workflows, performance analytics, AI-powered tools, parent engagement, and
              institution administration together in one integrated environment.
            </p>
            <div className="bp-stats">
              <div className="bp-stat">
                <span className="bp-tile bp-tile--sm bp-tile--white"><Icon name="users" size={22} /></span>
                <span><strong>{SITE_STATS.students.label}</strong><span>Students learning every day across partner schools</span></span>
              </div>
              <div className="bp-stat">
                <span className="bp-tile bp-tile--sm bp-tile--white"><Icon name="heart" size={22} /></span>
                <span><strong>{SITE_STATS.parents.label}</strong><span>Parents following their child&rsquo;s progress</span></span>
              </div>
            </div>
            <a href="/login" className="bh-btn bh-btn--maroon">Sign In <Icon name="arrowRight" size={18} /></a>
          </div>
        </div>
      </section>

      {/* What drives us */}
      <section className="bp-section bp-section--cream" aria-labelledby="about-values">
        <div className="bh-container">
          <SectionHead id="about-values" eyebrow="What drives us" title="Built on a Simple Belief About" highlight="Learning" align="center" />
          <ul className="bp-grid bp-grid--3">
            {VALUES.map(([icon, title, text]) => (
              <li key={title} className="bp-card bp-card--hover" data-reveal>
                <span className="bp-tile"><Icon name={icon} size={24} /></span>
                <h3 className="bp-h3">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Counters */}
      <section className="bp-section bp-section--tight bp-section--cream bp-section--flush-top" aria-label="Bodhira.ai in numbers">
        <div className="bh-container">
          <ul className="bp-counters" data-reveal>
            {COUNTERS.map(([icon, num, label]) => (
              <li key={label}>
                <span className="bp-tile bp-tile--light"><Icon name={icon} size={24} /></span>
                <strong>{num}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team (CMS), or the four dashboards when there is no team */}
      <section className="bp-section" aria-labelledby="about-team">
        <div className="bh-container">
          {team.length ? (
            <SectionHead id="about-team" eyebrow="The people behind Bodhira.ai" title="Meet the" highlight="Team" align="center" />
          ) : (
            <SectionHead id="about-team" eyebrow="Dashboards built for each role" title="Designed Around the People Who" highlight="Use It Every Day" align="center" />
          )}
          <ul className="bp-grid bp-grid--people">
            {team.length
              ? team.map((m, i) => {
                  const photo = mediaUrl(m.photo_url ?? null) ?? images[`assets/img/team/team-men-${(i % 4) + 1}.png`] ?? null;
                  return (
                    <li key={m.id} className="bp-person" data-reveal>
                      <div className="bp-person__photo">
                        {photo ? (
                          <img src={photo} alt={m.name} width={600} height={720} loading="lazy" decoding="async" />
                        ) : (
                          <span className="bp-person__placeholder" aria-hidden="true"><span>{initials(m.name)}</span></span>
                        )}
                      </div>
                      <div className="bp-person__body">
                        <h3 className="bp-person__name">{m.name}</h3>
                        {m.role && <span className="bp-person__role">{m.role}</span>}
                        {m.bio && <p className="bp-person__bio">{strLimit(m.bio, 110)}</p>}
                      </div>
                    </li>
                  );
                })
              : ROLES.map(([name, src, alt], i) => (
                  <li key={name} className="bp-person" data-reveal>
                    <div className="bp-person__photo">
                      <img src={img(`assets/img/team/team-men-${i + 1}.png`, src)} alt={alt} width={600} height={720} loading="lazy" decoding="async" />
                    </div>
                    <div className="bp-person__body">
                      <h3 className="bp-person__name">{name}</h3>
                      <span className="bp-person__role">See Their View</span>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      </section>

      {/* What schools say */}
      <section className="bp-section bp-section--dark bp-on-dark" aria-labelledby="about-quotes">
        <div className="bh-container bp-split">
          <div data-reveal>
            <Eyebrow light>Why Bodhira.ai</Eyebrow>
            <h2 id="about-quotes" className="bp-h2">What Schools <span>Say About Bodhira.ai</span></h2>
            <p className="bp-lead">
              A platform our students enjoy using, our teachers actually adopt, and our parents finally feel connected to — that is what
              Bodhira.ai delivered for us.
            </p>
          </div>
          <div data-reveal>
            {quotes.length ? (
              <Testimonials items={quotes} />
            ) : (
              <figure className="bp-quote">
                <Icon name="quote" size={34} className="bp-quote__mark" />
                <h3 className="bp-quote__title">From the Principal&rsquo;s Office</h3>
                <blockquote>
                  <p>&ldquo;In two months, our students stopped asking for video tutorials elsewhere and parents stopped asking us &lsquo;is my child studying?&rsquo; Bodhira.ai gave both sides answers.&rdquo;</p>
                </blockquote>
                <figcaption>
                  <span className="bp-avatar">
                    {images["assets/img/images/testi-author-3.png"] ? <img src={images["assets/img/images/testi-author-3.png"]} alt="" width={52} height={52} /> : <span aria-hidden="true">MS</span>}
                  </span>
                  <span><strong>Mrs. Sharma</strong><span>Principal, Partner School</span></span>
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* How learning happens (videos) */}
      <section className="bp-section bp-section--cream" aria-labelledby="about-videos">
        <div className="bh-container">
          <SectionHead id="about-videos" eyebrow="Our features" title="How Learning Happens on" highlight="Bodhira.ai" align="center" />
          <ul className="bp-grid bp-grid--2">
            {VIDEOS.map(([legacyKey, src, alt, title, text]) => (
              <li key={title} className="bp-media-card" data-reveal>
                <div className="bp-media-card__thumb">
                  <img src={img(legacyKey, src)} alt={alt} width={1200} height={750} loading="lazy" decoding="async" />
                  <a className="video-popup bp-play" data-autoplay="true" data-vbtype="video" href={`${VIDEO}?feature=shared`} aria-label={`Play video: ${title}`}>
                    <Icon name="play" size={24} className="bh-icon--fill" />
                  </a>
                </div>
                <div className="bp-media-card__body">
                  <h3 className="bp-h3">{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bp-section bp-section--flush-top bp-section--cream" aria-label="Get started">
        <div className="bh-container">
          <CtaBand
            title="See Bodhira.ai in Your School"
            text="Book a walkthrough for your school, or talk to our team about getting your students, teachers and parents started."
            actions={
              <>
                <a href="/book-demo" className="bh-btn bh-btn--gold bh-btn--lg">Book a Demo <Icon name="arrowRight" size={18} /></a>
                <a href="/contact" className="bh-btn bh-btn--glass bh-btn--lg">Contact Us</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
