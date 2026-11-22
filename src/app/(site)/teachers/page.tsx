import type { Metadata } from "next";
import { connection } from "next/server";
import { initials } from "@/components/site/initials";
import { CIcon } from "@/components/site/kit-content-icons";
import { BTN_FOCUS, BTN_FOCUS_DARK, GRID, LIST, PAGE, PEOPLE, PERSON, PERSON_BODY, PERSON_IMG, PERSON_NAME, PERSON_PHOTO, PERSON_ROLE, PersonPlaceholder, section } from "@/components/site/kit-content-ui";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx } from "@/components/site/ui";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { mediaUrl } from "@/lib/media";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getChrome, getCollections } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;


export async function generateMetadata(): Promise<Metadata> {
  // A unique title and description (SEO: not in legacy, which used the site default).
  return siteMetadata("/teachers", "Our Instructors · Bodhira.ai", {
    description: "Bodhira.ai for teachers: lesson planning, a digital content library, student tracking, engagement tools and academic reporting in one place.",
  });
}

/**
 * Legacy resources/views/teachers.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same CMS team (name,
 * role, photo); when it is empty the section is hidden (legacy showed six
 * invented sample instructors; removed in the 2026-11-22 compliance pass). A member
 * without a CMS photo shows the theme image only when the Site Image Manager
 * has a replacement for its key (`assets/img/team/team-N.png`), else initials
 * (legacy showed the theme's stock photos). Added: hero photo
 * (public/assets/img/pages/content, CREDITS.md there; its lead is the
 * "Teacher Productivity Tools" copy from /features) and a closing card
 * reusing the success-stories call to action. Differences from legacy: the
 * heading reads "Our Instructors"; the breadcrumb no longer links to the
 * theme's missing team.html; the sample cards' "#" social links are dropped.
 * Tailwind since the migration's phase 2 (was `.bh-page` kit classes).
 */
export default async function TeachersPage() {
  await connection();
  const [img, { images }, { team }] = await Promise.all([imageResolver(), getChrome(), getCollections()]);
  // CMS team only: the six invented sample instructors legacy showed when it was empty are gone, and the
  // section is hidden instead (compliance pass, not in legacy, 2026-11-22).
  const people = team.map((m, i) => ({ key: String(m.id), name: m.name, role: m.role, photo: mediaUrl(m.photo_url ?? null) ?? images[`assets/img/team/team-${(i % 8) + 1}.png`] ?? null }));

  return (
    <div className={PAGE}>
      <SeoSchema path="teachers" />

      <PageHero
        eyebrow="Teachers"
        title="Our"
        highlight="Instructors"
        lead="Lesson planning, a digital content library, student tracking, engagement tools and academic reporting in one place."
        breadcrumbs={[{ label: "Our Instructors" }]}
        image={{ src: img(null, "assets/img/pages/content/teachers-hero.jpg"), alt: "A confident teacher with folded arms in front of his classroom chalkboard", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="/book-demo" className={btn("maroon", "lg", BTN_FOCUS)}>Book a Demo <CIcon name="arrowRight" size={18} /></a>
            <a href="/features" className={btn("ghost", "lg", BTN_FOCUS)}>Platform Features</a>
          </>
        }
      />

      {people.length > 0 && (
      <section className={section()} aria-labelledby="teachers-team">
        <div className="site-container">
          <SectionHead id="teachers-team" eyebrow="The people behind Bodhira.ai" title="Meet the" highlight="Team" align="center" />
          <ul className={cx(LIST, GRID, PEOPLE)}>
            {people.map((p) => (
              <li key={p.key} className={PERSON} data-reveal>
                <div className={PERSON_PHOTO}>
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} width={600} height={720} loading="lazy" decoding="async" className={PERSON_IMG} />
                  ) : (
                    <PersonPlaceholder initials={initials(p.name)} />
                  )}
                </div>
                <div className={PERSON_BODY}>
                  <h3 className={PERSON_NAME}>{p.name}</h3>
                  {p.role && <span className={PERSON_ROLE}>{p.role}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      <section className={section("white", { flushTop: people.length > 0 })} aria-label="Get started">
        <div className="site-container">
          <CtaBand
            title="Bring Bodhira.ai to Your School"
            text="Give your students, teachers and parents one connected place to learn, teach and track progress."
            actions={
              <>
                <a href="/contact" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Contact Us <CIcon name="arrowRight" size={18} /></a>
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
