import type { Metadata } from "next";
import { connection } from "next/server";
import { Avatar } from "@/components/site/kit-content-cards";
import { CIcon, type AnyIconName } from "@/components/site/kit-content-icons";
import { KitTabs } from "@/components/site/kit-content-tabs";
import { BTN_FOCUS, CHIPS, FOCUS, LIST, P, PAGE, PERSON_ROLE, badge, h3, section } from "@/components/site/kit-content-ui";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx } from "@/components/site/ui";
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

const INFO: [AnyIconName, string, string][] = [
  ["home", "Instructor", "Kevin Perry"],
  ["bookOpen", "Lessons", "8"],
  ["clock", "Duration", "15h 30m 36s"],
  ["tag", "Course level", "Beginners"],
  ["globe", "Language", "English"],
  ["puzzle", "Quizzes", "04"],
];

export async function generateMetadata(): Promise<Metadata> {
  // Theme demo page: kept out of search results and the sitemap (SEO: not in legacy).
  return siteMetadata("/course-details", "Course Details · Bodhira.ai", { noindex: true, description: "Course details on Bodhira.ai." });
}

/**
 * Legacy resources/views/course-details.blade.php (the theme's demo course
 * page), redesigned in 2026 with the page design kit (not in legacy;
 * docs/site-design-kit.md). Same demo content and prices. The Bootstrap tabs and accordion
 * are now a small client component (`KitTabs`) and native <details>. The main
 * image is a new photo (public/assets/img/pages/content, CREDITS.md there);
 * a replacement saved under a legacy key (course-details-img, team-men-N,
 * review-list-N, course-details-author) still wins, otherwise people show
 * initials. Differences from legacy: typos fixed ("De1sign", "Limted",
 * "Curriculam", "Coursed", "IT Trainier"); the instructors' "#" social links
 * (no targets) are dropped; the theme's dead links (instructor names →
 * `team-details.html`, "Add to Cart" / "Buy Now" → `/cart`, both 404) now go to
 * /teachers and /pricing. Compliance pass (not in legacy, 2026-11-22): the
 * invented reviews (lorem-ipsum "Eleanor Fant", "Haliey White"), the 4.88
 * rating and the "Best Seller" badge are gone. The page is theme demo content
 * (fictional course, instructors and USD price); see the compliance notes.
 * Tailwind since the migration's phase 2 (was `.bh-page` kit classes and
 * site-ui-content.css).
 */
/** A white card in the sidebar. */
const SIDE_CARD = "rounded-lg border border-line bg-white p-7 shadow-sm";
/** Overview paragraphs (24px apart, none after the last). */
const PROSE_P = cx(P, "mb-6 text-base text-body last:mb-0");

export default async function CourseDetailsPage() {
  await connection();
  const [img, { images }] = await Promise.all([imageResolver(), getChrome()]);

  const overview = (
    <div>
      <h3 className={h3({ mb: "mb-3" })}>Description</h3>
      <p className={PROSE_P}>
        Rapidiously develop parallel e-markets via worldwide paradigms. Quickly synergize cutting-edge scenarios and professional results.
        Assertively deliver cross-media results before client-centric results. Uniquely initiate intuitive communities through process-centric
        internal or &quot;organic&quot; sources. Energistically reinvent distinctive value via parallel services. Phosfluorescently deploy extensive
        paradigms vis-a-vis cross-unit manufactured products. Uniquely coordinate impactful services whereas team building e-services. Globally
        grow multimedia based benefits vis-a-vis client-based niches.
      </p>
      <p className={PROSE_P}>
        Professionally expedite synergistic technology without out-of-the-box human capital. Enthusiastically coordinate state of the art
        leadership after professional manufactured products. Distinctively enhance future-proof e-services whereas functionalized partnerships.
        Quickly streamline focused paradigms via orthogonal &quot;outside the box&quot; thinking. Rapidiously administrate 2.0 total linkage for
        cross-platform channels.
      </p>
      <h3 className={h3({ mb: "mb-3" })}>What Will You Learn?</h3>
      <p className={PROSE_P}>
        Quickly synergize cutting-edge scenarios and professional results. Assertively deliver cross-media results before client-centric results.
        Uniquely initiate intuitive communities through process-centric internal or &quot;organic&quot; sources. Energistically reinvent distinctive
        value via parallel services extensive paradigms cross-unit manufactured products.
      </p>
    </div>
  );

  const curriculum = (
    <div className="grid gap-3">
      {MODULES.map((m, i) => (
        <details
          key={m}
          name="curriculum"
          open={i === 0}
          className="group/acc rounded-md border border-line bg-white shadow-xs [transition:box-shadow_.25s,border-color_.25s] open:border-[rgba(122,36,55,.18)] open:shadow-md"
        >
          <summary className={cx("flex cursor-pointer list-none items-center gap-4 rounded-md px-[22px] py-5 max-sm:gap-3 max-sm:p-4 [&::-webkit-details-marker]:hidden", FOCUS)}>
            <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-cream text-[13px] font-extrabold text-wine group-open/acc:bg-grad-maroon group-open/acc:text-white">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1 text-[17px] leading-[1.4] font-bold tracking-[-.01em] text-ink max-sm:text-[15.5px]">{m}</span>
            <CIcon name="chevronDown" className="text-muted [transition:transform_.25s_var(--ease-bh),rotate_.25s_var(--ease-bh)] group-open/acc:rotate-180 group-open/acc:text-wine" />
          </summary>
          <div className="pt-0 pr-[22px] pb-[22px] pl-[74px] max-sm:px-4 max-sm:pb-[18px]">
            <ul className={LIST}>
              {LESSONS.map(([icon, title, time, open]) => (
                <li key={title} className="flex items-center justify-between gap-4 border-t border-line py-3 text-[15px] first:border-t-0 first:pt-0">
                  <span className="inline-flex items-center gap-2.5 font-medium text-ink [&_.bh-icon]:text-wine"><CIcon name={icon} size={18} />{title}</span>
                  <span className="inline-flex flex-none items-center gap-2 text-[14px] font-semibold text-muted tabular-nums">
                    {time}
                    <CIcon name={open ? "unlock" : "lock"} size={16} />
                    <span className="sr-only">{open ? "Unlocked" : "Locked"}</span>
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
    <ul className={cx(LIST, "grid grid-cols-3 gap-4 *:min-w-0 max-lg:grid-cols-2 max-sm:grid-cols-1")}>
      {INSTRUCTORS.map(([name, key]) => (
        <li key={name} className="flex flex-col items-center rounded-lg bg-cream px-4 py-7 text-center">
          <Avatar name={name} src={images[key] ?? null} size={72} className="mb-3.5" text="text-[22px]" />
          <h3 className="m-0 font-sans text-[17px] leading-[1.2] font-bold text-ink transition-none"><a href="/teachers" className={cx("text-ink hover:text-wine", FOCUS)}>{name}</a></h3>
          <span className={PERSON_ROLE}>IT Trainer</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={PAGE}>
      <SeoSchema path="course-details" />

      <PageHero
        id="course-details-title"
        longTitle
        eyebrow="Course Details"
        title="User Experience Design Essentials - Adobe XD UI UX Design Course For"
        highlight="Limited Time"
        breadcrumbs={[{ label: "Course Page", href: "/course" }, { label: "Course Details" }]}
        image={{ src: img("assets/img/service/course-details-img.png", "assets/img/pages/content/course-details.jpg"), alt: "A designer working on a laptop at a long desk", width: 1200, height: 750 }}
      >
        <ul className={cx(CHIPS, "mb-5")}>
          <li><span className={badge("gold")}>Latest</span></li>
        </ul>
        <ul className={cx(LIST, "flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] font-semibold text-ink max-sm:gap-x-4 max-sm:gap-y-2.5 max-sm:text-[14px] [&_.bh-icon]:text-wine")}>
          <li className="inline-flex items-center gap-2.5">
            <Avatar name="Kevin Perry" src={images["assets/img/service/course-details-author.png"] ?? null} size={36} />
            <span><span className="text-muted">Instructor:</span> Kevin Perry</span>
          </li>
          <li className="inline-flex items-center gap-2.5"><CIcon name="tag" size={18} />Web Development</li>
          <li className="inline-flex items-center gap-2.5"><CIcon name="calendar" size={18} />04 April, 2022</li>
        </ul>
      </PageHero>

      <section className={section("cream")} aria-label="Course content">
        <div className="site-container grid grid-cols-[minmax(0,1fr)_360px] items-start gap-10 *:min-w-0 max-xl:grid-cols-[minmax(0,1fr)_320px] max-xl:gap-8 max-lg:grid-cols-[minmax(0,1fr)]">
          <div data-reveal>
            <KitTabs
              label="Course sections"
              tabs={[
                { label: "Overview", icon: <CIcon name="bookmark" size={18} /> },
                { label: "Curriculum", icon: <CIcon name="bookOpen" size={18} /> },
                { label: "Instructor", icon: <CIcon name="user" size={18} /> },
              ]}
              panels={[overview, curriculum, instructors]}
            />
          </div>

          <aside className="sticky top-[104px] grid gap-6 max-lg:static max-lg:grid-cols-2 max-lg:items-start max-md:grid-cols-1" aria-label="Course purchase and information">
            <div className={cx(SIDE_CARD, "grid gap-3 bg-[radial-gradient(80%_60%_at_100%_0%,rgba(226,184,115,.2),transparent_60%)]")} data-reveal>
              <p className="m-0 mb-2 flex items-center gap-3 font-sans text-[36px] leading-[1.65] font-extrabold tracking-[-.03em] text-ink tabular-nums max-sm:text-[30px]">$90.00 <span className={badge("success")}>25% off</span></p>
              <a href="/pricing" className={btn("maroon", "lg", cx("w-full", BTN_FOCUS))}>Add to Cart <CIcon name="cart" size={18} /></a>
              <a href="/pricing" className={btn("ghost", "lg", cx("w-full", BTN_FOCUS))}>Buy Now</a>
            </div>
            <div className={SIDE_CARD} data-reveal>
              <h2 className="m-0 mb-4 font-sans text-[19px] leading-[1.2] font-extrabold tracking-[-.02em] text-ink transition-none">Course Information</h2>
              <ul className={LIST}>
                {INFO.map(([icon, label, value]) => (
                  <li key={label} className="flex items-center justify-between gap-3 border-b border-line py-3 text-[15px] last:border-b-0">
                    <span className="inline-flex items-center gap-2.5 text-body [&_.bh-icon]:text-gold-text"><CIcon name={icon} size={18} />{label}:</span>
                    <strong className="text-right font-bold text-ink">{value}</strong>
                  </li>
                ))}
              </ul>
              <button type="button" className={btn("ghost", "md", "mt-4 w-full focus-visible:outline-maroon!")}><CIcon name="share" size={18} /> Share This Course</button>
            </div>
          </aside>
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
