import type { Metadata } from "next";
import { connection } from "next/server";
import { Avatar, Stars } from "@/components/site/kit-content-cards";
import { CIcon } from "@/components/site/kit-content-icons";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
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
  return siteMetadata("/course", 'Bodhira.ai - Modern Digital Learning Infrastructure');
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
 * to /courses and /book-demo.
 */
export default async function CoursePage() {
  await connection();
  const [img, { images }] = await Promise.all([imageResolver(), getChrome()]);
  return (
    <div className="bh-page">
      <SeoSchema path="course" />

      <PageHero
        eyebrow="Top Class Courses"
        title="Explore Featured"
        highlight="Courses"
        breadcrumbs={[{ label: "Course Page" }]}
      />

      <section className="bp-section bp-section--cream bpc-pull" aria-labelledby="course-list">
        <div className="bh-container">
          <h2 id="course-list" className="bh-sr-only">Featured courses</h2>
          <ul className="bp-grid bp-grid--3">
            {COURSES.map(([key, src, alt, badge, title, author], i) => (
              <li key={i} className="bpc-course" data-reveal>
                <div className="bpc-course__thumb">
                  <img src={img(key, src)} alt={alt} width={1200} height={750} loading={i < 3 ? undefined : "lazy"} decoding="async" />
                  <span className="bp-badge bp-badge--gold">{badge}</span>
                </div>
                <div className="bpc-course__body">
                  <h3 className="bp-h3"><a href="/course-details">{title}</a></h3>
                  <ul className="bpc-course__meta">
                    <li><CIcon name="fileText" size={16} />Lesson 8</li>
                    <li><CIcon name="user" size={16} />Students 50</li>
                    <li><CIcon name="eye" size={16} />View: 12K</li>
                  </ul>
                  <div className="bpc-course__author">
                    <Avatar name="Kevin Perry" src={images[author] ?? null} size={40} />
                    <span className="bpc-course__who"><strong>Kevin Perry</strong><span>Instructor</span></span>
                    <span className="bpc-rating"><Stars value={5} label="Rated 4.7 out of 5" /><span>(4.7)</span></span>
                  </div>
                </div>
                <div className="bpc-course__foot">
                  <span className="bpc-price">$59.00</span>
                  <a href="/course-details" className="bp-link">View Details <CIcon name="arrowRight" size={16} /></a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bp-section bp-section--cream bp-section--flush-top" aria-label="All courses">
        <div className="bh-container">
          <CtaBand
            title="Every Major Subject. Every Class. One Platform."
            text="Each subject is organised into chapters and topics, with visual video lessons, downloadable notes, quizzes and an AI learning assistant built into every lesson."
            actions={
              <>
                <a href="/courses" className="bh-btn bh-btn--gold bh-btn--lg">Browse Courses <CIcon name="arrowRight" size={18} /></a>
                <a href="/book-demo" className="bh-btn bh-btn--glass bh-btn--lg">Book a Demo</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
