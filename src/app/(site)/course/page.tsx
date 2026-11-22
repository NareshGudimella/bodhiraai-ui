import type { Metadata } from "next";
import { connection } from "next/server";
import { Avatar } from "@/components/site/kit-content-cards";
import { CIcon } from "@/components/site/kit-content-icons";
import { BTN_FOCUS_DARK, COLS, COVER_IMG, FOCUS, GRID, LIST, PAGE, badge, h3, section } from "@/components/site/kit-content-ui";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx, textLink } from "@/components/site/ui";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getChrome } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/**
 * The legacy demo-theme course cards, as they were: [legacy image key, new
 * photo, alt, badge, title, author image key]. Each new photo still yields to a
 * Site Image Manager replacement saved under the legacy key.
 */
const COURSES: [string, string, string, string, string, string][] = [
  ["assets/img/images/course-img-1.png", "assets/img/pages/content/course-react.jpg", "A student smiling at the camera while working on his laptop on a park bench", "Skill", "React Tutorial Beginners For Skills Building Career", "assets/img/images/course-author-1.png"],
  ["assets/img/images/course-img-2.png", "assets/img/pages/content/course-teaching.jpg", "Teachers leading a lesson in a colourful classroom decorated with children's work", "Free", "Cultural Perspectives in Teaching and Learning Environments", "assets/img/images/course-author-2.png"],
  ["assets/img/images/course-img-3.png", "assets/img/pages/content/course-strategies.jpg", "Students testing a bottle rocket they built during a hands-on science activity", "Language", "Innovative Instructional Strategies for Enhancing Student", "assets/img/images/course-author-3.png"],
  ["assets/img/images/course-img-4.png", "assets/img/pages/content/course-develop.jpg", "A smiling developer holding up a sticky note that says code", "Develop", "React Tutorial Beginners For Skills Building Career", "assets/img/images/course-author-4.png"],
  ["assets/img/images/course-img-5.png", "assets/img/pages/content/course-management.jpg", "A teacher talking with a group of schoolgirls in a heritage building", "Management", "Cultural Perspectives in Teaching and Learning Environments", "assets/img/images/course-author-5.png"],
  ["assets/img/images/course-img-2.png", "assets/img/pages/content/course-teaching.jpg", "Teachers leading a lesson in a colourful classroom decorated with children's work", "Educational", "Innovative Instructional Strategies for Enhancing Student", "assets/img/images/course-author-6.png"],
];

export async function generateMetadata(): Promise<Metadata> {
  // Theme demo page: kept out of search results and the sitemap (SEO: not in legacy).
  return siteMetadata("/course", "Course Page · Bodhira.ai", { noindex: true, description: "Explore featured courses on Bodhira.ai." });
}

/**
 * Legacy resources/views/course.blade.php (the theme's demo course list),
 * redesigned in 2026 with the page design kit (not in legacy;
 * docs/site-design-kit.md). Same six cards, figures, prices and links
 * (/course-details). Photos: public/assets/img/pages/content (CREDITS.md
 * there); a replacement saved under a legacy key (course-img-N,
 * course-author-N) still wins, and without one the author shows initials.
 * Differences from legacy: "Carrera" corrected to "Career"; the stray line
 * breaks inside titles are gone; a closing card (copy from /courses) links
 * to /courses and /book-demo. Compliance pass (not in legacy, 2026-11-22):
 * the invented 4.7 star ratings and "Students 50" / "View: 12K" counts are
 * gone. The whole page is theme demo content (fictional courses, instructor
 * and USD prices); see the compliance notes. Tailwind since the migration's
 * phase 2 (was `.bh-page` kit classes and site-ui-content.css).
 */
export default async function CoursePage() {
  await connection();
  const [img, { images }] = await Promise.all([imageResolver(), getChrome()]);
  return (
    <div className={PAGE}>
      <SeoSchema path="course" />

      <PageHero
        eyebrow="Top Class Courses"
        title="Explore Featured"
        highlight="Courses"
        breadcrumbs={[{ label: "Course Page" }]}
      />

      {/* 24px under the centred hero (no photo), not the usual section padding */}
      <section className={cx(section("cream", { flushTop: true }), "pt-6")} aria-labelledby="course-list">
        <div className="site-container">
          <h2 id="course-list" className="sr-only">Featured courses</h2>
          <ul className={cx(LIST, GRID, COLS[3])}>
            {COURSES.map(([key, src, alt, tag, title, author], i) => (
              <li
                key={i}
                className="group/course flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm [transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh)] hover:[transform:translateY(-4px)] hover:shadow-lg"
                data-reveal
              >
                <div className="relative block aspect-[16/10] overflow-hidden bg-cream-2">
                  <img src={img(key, src)} alt={alt} width={1200} height={750} loading={i < 3 ? undefined : "lazy"} decoding="async" className={cx(COVER_IMG, "group-hover/course:scale-[1.04]")} />
                  <span className={badge("gold", undefined, "absolute top-4 left-4 shadow-sm")}>{tag}</span>
                </div>
                <div className="flex-1 px-6 pt-6 pb-5 max-sm:p-5">
                  <h3 className={h3({ size: "text-[19px]", mb: "mb-3.5", leading: "leading-[1.35]" })}><a href="/course-details" className={cx("text-ink hover:text-wine", FOCUS)}>{title}</a></h3>
                  <ul className={cx(LIST, "mb-[18px] flex flex-wrap gap-x-4 gap-y-2 border-b border-line pb-[18px]")}>
                    <li className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-muted [&_.bh-icon]:text-gold-text"><CIcon name="fileText" size={16} />Lesson 8</li>
                  </ul>
                  <div className="flex items-center gap-3">
                    <Avatar name="Kevin Perry" src={images[author] ?? null} size={40} />
                    <span className="min-w-0 flex-1"><strong className="block text-[15px] font-bold text-ink">Kevin Perry</strong><span className="block text-[13px] text-muted">Instructor</span></span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-line bg-cream px-6 py-4 max-sm:px-5 max-sm:py-3.5">
                  <span className="text-[22px] font-extrabold tracking-[-.02em] text-maroon tabular-nums">$59.00</span>
                  <a href="/course-details" className={cx(textLink(), FOCUS)}>View Details<span className="sr-only">: {title}</span> <CIcon name="arrowRight" size={16} /></a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={section("cream", { flushTop: true })} aria-label="All courses">
        <div className="site-container">
          <CtaBand
            title="Every Major Subject. Every Class. One Platform."
            text="Each subject is organised into chapters and topics, with visual video lessons, downloadable notes, quizzes and an AI learning assistant built into every lesson."
            actions={
              <>
                <a href="/courses" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Browse Courses <CIcon name="arrowRight" size={18} /></a>
                <a href="/book-demo" className={btn("glass", "lg", BTN_FOCUS_DARK)}>Book a Demo</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
