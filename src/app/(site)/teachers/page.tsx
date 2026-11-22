import type { Metadata } from "next";
import { connection } from "next/server";
import { initials } from "@/components/site/initials";
import { CIcon } from "@/components/site/kit-content-icons";
import { CtaBand, SectionHead } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { mediaUrl } from "@/lib/media";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getChrome, getCollections } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** Sample instructors when the CMS team is empty. */
const FALLBACK = [
  ["William Samuel", "team-5"], ["Olivia Sophia", "team-6"], ["Jacob Mason", "team-7"],
  ["Amelia Grace", "team-8"], ["Mason Logan", "team-1"], ["Isabella Charlotte", "team-4"],
];

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/teachers", 'Bodhira.ai - Modern Digital Learning Infrastructure');
}

/**
 * Legacy resources/views/teachers.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md). Same CMS team (name,
 * role, photo) and the same sample instructors when it is empty. A member
 * without a CMS photo shows the theme image only when the Site Image Manager
 * has a replacement for its key (`assets/img/team/team-N.png`), else initials
 * (legacy showed the theme's stock photos). Added: hero photo
 * (public/assets/img/pages/content, CREDITS.md there; its lead is the
 * "Teacher Productivity Tools" copy from /features) and a closing card
 * reusing the success-stories call to action. Differences from legacy: the
 * heading reads "Our Instructors"; the breadcrumb no longer links to the
 * theme's missing team.html; the sample cards' "#" social links are dropped.
 */
export default async function TeachersPage() {
  await connection();
  const [img, { images }, { team }] = await Promise.all([imageResolver(), getChrome(), getCollections()]);
  const people = team.length
    ? team.map((m, i) => ({ key: String(m.id), name: m.name, role: m.role, photo: mediaUrl(m.photo_url ?? null) ?? images[`assets/img/team/team-${(i % 8) + 1}.png`] ?? null }))
    : FALLBACK.map(([name, file]) => ({ key: file, name, role: "Instructor", photo: images[`assets/img/team/${file}.png`] ?? null }));

  return (
    <div className="bh-page">
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
            <a href="/book-demo" className="bh-btn bh-btn--maroon bh-btn--lg">Book a Demo <CIcon name="arrowRight" size={18} /></a>
            <a href="/features" className="bh-btn bh-btn--ghost bh-btn--lg">Platform Features</a>
          </>
        }
      />

      <section className="bp-section" aria-labelledby="teachers-team">
        <div className="bh-container">
          <SectionHead id="teachers-team" eyebrow="The people behind Bodhira.ai" title="Meet the" highlight="Team" align="center" />
          <ul className="bp-grid bp-grid--people">
            {people.map((p) => (
              <li key={p.key} className="bp-person" data-reveal>
                <div className="bp-person__photo">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} width={600} height={720} loading="lazy" decoding="async" />
                  ) : (
                    <span className="bp-person__placeholder" aria-hidden="true"><span>{initials(p.name)}</span></span>
                  )}
                </div>
                <div className="bp-person__body">
                  <h3 className="bp-person__name">{p.name}</h3>
                  {p.role && <span className="bp-person__role">{p.role}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bp-section bp-section--flush-top" aria-label="Get started">
        <div className="bh-container">
          <CtaBand
            title="Bring Bodhira.ai to Your School"
            text="Give your students, teachers and parents one connected place to learn, teach and track progress."
            actions={
              <>
                <a href="/contact" className="bh-btn bh-btn--gold bh-btn--lg">Contact Us <CIcon name="arrowRight" size={18} /></a>
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
