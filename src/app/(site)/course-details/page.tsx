import type { Metadata } from "next";
import { connection } from "next/server";
import { Avatar, Stars } from "@/components/site/kit-content-cards";
import { CIcon, type AnyIconName } from "@/components/site/kit-content-icons";
import { KitTabs } from "@/components/site/kit-content-tabs";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getChrome } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** The theme's demo curriculum: the same three lessons under each module. */
const LESSONS: [AnyIconName, string, string, boolean][] = [
  ["video", "Mastering Pronunciation and Intonation", "54.23", true],
  ["video", "Building a Strong Vocabulary for Everyday Communication", "45.05", true],
  ["fileText", "Understanding Basic Sentence Structure and Grammar", "1.6hr", false],
];
const MODULES = ["Foundations of Fluent English Speaking", "User Research Techniques", "Course Key Features"];

const INSTRUCTORS: [string, string][] = [
  ["Mason D. Logan", "assets/img/team/team-men-1.png"],
  ["Scarlett Hannah", "assets/img/team/team-men-2.png"],
  ["Chloe Smith", "assets/img/team/team-men-3.png"],
];

const REVIEWS: [string, string, string][] = [
  ["Eleanor Fant", "assets/img/shop/review-list-1.jpg", "Mauris non dignissim purus, ac commodo diam. Donec sit amet lacinia nulla. Aliquam quis purus in justo pulvinar tempor."],
  ["Haliey White", "assets/img/shop/review-list-2.jpg", "Designed very similarly to the nearly double priced Galaxy tab S6, with the only removal being.Mauris non dignissim purus, ac commodo diam. Donec sit amet lacinia nulla. Aliquam quis purus in justo pulvinar tempor."],
];

const INFO: [AnyIconName, string, string][] = [
  ["home", "Instructor", "Kevin Perry"],
  ["bookOpen", "Lessons", "8"],
  ["clock", "Duration", "15h 30m 36s"],
  ["tag", "Course level", "Beginners"],
  ["globe", "Language", "English"],
  ["puzzle", "Quizzes", "04"],
];

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/course-details", 'Bodhira.ai - Modern Digital Learning Infrastructure');
}

/**
 * Legacy resources/views/course-details.blade.php (the theme's demo course
 * page), redesigned in 2026 with the page design kit (not in legacy;
 * docs/site-design-kit.md). Same demo content, prices and links (/cart for
 * Add to Cart and Buy Now, team-details.html on instructor names; both are
 * demo-theme links with no page behind them). The Bootstrap tabs and accordion
 * are now a small client component (`KitTabs`) and native <details>. The main
 * image is a new photo (public/assets/img/pages/content, CREDITS.md there);
 * a replacement saved under a legacy key (course-details-img, team-men-N,
 * review-list-N, course-details-author) still wins, otherwise people show
 * initials. Differences from legacy: typos fixed ("De1sign", "Limted",
 * "Curriculam", "Coursed", "IT Trainier"); the instructors' "#" social links
 * (no targets) are dropped.
 */
export default async function CourseDetailsPage() {
  await connection();
  const [img, { images }] = await Promise.all([imageResolver(), getChrome()]);

  const overview = (
    <div className="bpc-prose">
      <h3 className="bp-h3">Description</h3>
      <p>
        Rapidiously develop parallel e-markets via worldwide paradigms. Quickly synergize cutting-edge scenarios and professional results.
        Assertively deliver cross-media results before client-centric results. Uniquely initiate intuitive communities through process-centric
        internal or &quot;organic&quot; sources. Energistically reinvent distinctive value via parallel services. Phosfluorescently deploy extensive
        paradigms vis-a-vis cross-unit manufactured products. Uniquely coordinate impactful services whereas team building e-services. Globally
        grow multimedia based benefits vis-a-vis client-based niches.
      </p>
      <p>
        Professionally expedite synergistic technology without out-of-the-box human capital. Enthusiastically coordinate state of the art
        leadership after professional manufactured products. Distinctively enhance future-proof e-services whereas functionalized partnerships.
        Quickly streamline focused paradigms via orthogonal &quot;outside the box&quot; thinking. Rapidiously administrate 2.0 total linkage for
        cross-platform channels.
      </p>
      <h3 className="bp-h3">What Will You Learn?</h3>
      <p>
        Quickly synergize cutting-edge scenarios and professional results. Assertively deliver cross-media results before client-centric results.
        Uniquely initiate intuitive communities through process-centric internal or &quot;organic&quot; sources. Energistically reinvent distinctive
        value via parallel services extensive paradigms cross-unit manufactured products.
      </p>
    </div>
  );

  const curriculum = (
    <div className="bp-accordion">
      {MODULES.map((m, i) => (
        <details key={m} name="curriculum" open={i === 0}>
          <summary>
            <span className="bp-accordion__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="bp-accordion__q">{m}</span>
            <CIcon name="chevronDown" className="bp-accordion__chev" />
          </summary>
          <div className="bp-accordion__a">
            <ul className="bpc-lessons">
              {LESSONS.map(([icon, title, time, open]) => (
                <li key={title}>
                  <span className="bpc-lessons__title"><CIcon name={icon} size={18} />{title}</span>
                  <span className="bpc-lessons__time">
                    {time}
                    <CIcon name={open ? "unlock" : "lock"} size={16} />
                    <span className="bh-sr-only">{open ? "Unlocked" : "Locked"}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      ))}
    </div>
  );

  const instructors = (
    <ul className="bp-grid bp-grid--3 bpc-instructors">
      {INSTRUCTORS.map(([name, key]) => (
        <li key={name} className="bpc-instructor">
          <Avatar name={name} src={images[key] ?? null} size={72} />
          <h3 className="bpc-instructor__name"><a href="team-details.html">{name}</a></h3>
          <span className="bp-person__role">IT Trainer</span>
        </li>
      ))}
    </ul>
  );

  const reviews = (
    <ul className="bpc-reviews">
      {REVIEWS.map(([name, key, text]) => (
        <li key={name} className="bpc-review">
          <Avatar name={name} src={images[key] ?? null} size={56} />
          <div>
            <div className="bpc-review__top">
              <h3 className="bpc-review__name">{name} <span>06 March, 2023</span></h3>
              <Stars value={5} />
            </div>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bh-page">
      <SeoSchema path="course-details" />

      <PageHero
        id="course-details-title"
        eyebrow="Course Details"
        title="User Experience Design Essentials - Adobe XD UI UX Design Course For"
        highlight="Limited Time"
        breadcrumbs={[{ label: "Course Page", href: "/course" }, { label: "Course Details" }]}
        image={{ src: img("assets/img/service/course-details-img.png", "assets/img/pages/content/course-details.jpg"), alt: "A designer working on a laptop at a long desk", width: 1200, height: 750 }}
        badge={
          <span className="bp-glass">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><CIcon name="star" size={20} /></span>
            <span><strong>4.88</strong><span>Course rating</span></span>
          </span>
        }
      >
        <ul className="bp-chips bpc-hero-meta">
          <li><span className="bp-badge bp-badge--maroon">Best Seller</span></li>
          <li><span className="bp-badge bp-badge--gold">Latest</span></li>
        </ul>
        <ul className="bpc-hero-facts">
          <li>
            <Avatar name="Kevin Perry" src={images["assets/img/service/course-details-author.png"] ?? null} size={36} />
            <span><span className="bp-muted">Instructor:</span> Kevin Perry</span>
          </li>
          <li><CIcon name="tag" size={18} />Web Development</li>
          <li><CIcon name="calendar" size={18} />04 April, 2022</li>
          <li><Stars value={5} label="Rated 4.88 out of 5" /> (4.88)</li>
        </ul>
      </PageHero>

      <section className="bp-section bp-section--cream" aria-label="Course content">
        <div className="bh-container bpc-detail">
          <div className="bpc-detail__main" data-reveal>
            <KitTabs
              label="Course sections"
              tabs={[
                { label: "Overview", icon: <CIcon name="bookmark" size={18} /> },
                { label: "Curriculum", icon: <CIcon name="bookOpen" size={18} /> },
                { label: "Instructor", icon: <CIcon name="user" size={18} /> },
                { label: "Reviews", icon: <CIcon name="star" size={18} /> },
              ]}
              panels={[overview, curriculum, instructors, reviews]}
            />
          </div>

          <aside className="bpc-detail__side" aria-label="Course purchase and information">
            <div className="bpc-side-card bpc-price-card" data-reveal>
              <p className="bpc-price-card__price">$90.00 <span className="bp-badge bp-badge--success">25% off</span></p>
              <a href="/cart" className="bh-btn bh-btn--maroon bh-btn--lg">Add to Cart <CIcon name="cart" size={18} /></a>
              <a href="/cart" className="bh-btn bh-btn--ghost bh-btn--lg">Buy Now</a>
            </div>
            <div className="bpc-side-card" data-reveal>
              <h2 className="bpc-side-card__title">Course Information</h2>
              <ul className="bpc-info">
                {INFO.map(([icon, label, value]) => (
                  <li key={label}>
                    <span><CIcon name={icon} size={18} />{label}:</span>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>
              <button type="button" className="bh-btn bh-btn--ghost bpc-share"><CIcon name="share" size={18} /> Share This Course</button>
            </div>
          </aside>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
