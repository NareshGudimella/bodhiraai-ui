import type { Metadata } from "next";
import { connection } from "next/server";
import { KitPagination, StoryCard } from "@/components/site/kit-content-cards";
import { CIcon } from "@/components/site/kit-content-icons";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { imageResolver, siteMetadata } from "@/lib/site";
import { getSuccessStories } from "@/lib/site-api";
import { SITE_STATS } from "@/lib/site-stats";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/success-stories", 'Success Stories · Bodhira.ai');
}

/**
 * Legacy resources/views/success-stories.blade.php, redesigned in 2026 with
 * the page design kit (not in legacy; docs/site-design-kit.md). Same CMS
 * stories (GET success stories, `?page=N`), same empty-state text, card links
 * (/blog/{slug}) and the /contact button. Cards and pagination use the kit
 * (kit-content-cards.tsx; post-card.tsx and site-pagination.tsx stay for the
 * pages still on the theme). Added: hero photo (public/assets/img/pages/content,
 * CREDITS.md there) with a partner-schools badge from SITE_STATS, and the
 * /contact button now also sits in a closing card.
 */
export default async function SuccessStoriesPage({ searchParams }: PageProps<"/success-stories">) {
  await connection();
  const img = await imageResolver();
  return (
    <div className="bh-page">
      <SeoSchema path="success-stories" />

      <PageHero
        eyebrow="Real Schools. Real Results."
        title="How Schools Grow with"
        highlight="Bodhira.ai"
        lead="Stories from schools, teachers and parents who made learning visual, measurable and engaging with Bodhira.ai."
        breadcrumbs={[{ label: "Success Stories" }]}
        image={{ src: img(null, "assets/img/pages/content/success-hero.jpg"), alt: "A crowd of smiling students celebrating together in shirts covered in friends' signatures", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="#stories" className="bh-btn bh-btn--maroon bh-btn--lg">Read the Stories <CIcon name="arrowRight" size={18} /></a>
            <a href="/contact" className="bh-btn bh-btn--ghost bh-btn--lg">Bring Bodhira.ai to Your School</a>
          </>
        }
        badge={
          <span className="bp-glass">
            <span className="bp-tile bp-tile--sm bp-tile--solid"><CIcon name="school" size={20} /></span>
            <span><strong>{SITE_STATS.schools.label}</strong><span>Partner schools</span></span>
          </span>
        }
      />

      <section className="bp-section bp-section--cream" id="stories" aria-labelledby="stories-title" style={{ scrollMarginTop: 80 }}>
        <div className="bh-container">
          <h2 id="stories-title" className="bh-sr-only">Success stories</h2>
          <Stories searchParams={searchParams} />
        </div>
      </section>

      <section className="bp-section bp-section--cream bp-section--flush-top" aria-label="Get started">
        <div className="bh-container">
          <CtaBand
            image={img(null, "assets/img/pages/content/features-cta.jpg")}
            title="Bring Bodhira.ai to Your School"
            text="Join Bodhira.ai and give your students, teachers and parents one connected place to learn, teach and track progress."
            actions={
              <>
                <a href="/contact" className="bh-btn bh-btn--gold bh-btn--lg">Bring Bodhira.ai to Your School <CIcon name="arrowRight" size={18} /></a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}

/** The stories grid and its pagination (they read ?page). */
async function Stories({ searchParams }: Pick<PageProps<"/success-stories">, "searchParams">) {
  await connection();
  const q = await searchParams;
  const page = typeof q.page === "string" && /^\d+$/.test(q.page) && Number(q.page) >= 1 ? Number(q.page) : 1;
  const { stories, meta } = await getSuccessStories(page);
  return (
    <>
      {stories.length ? (
        <ul className="bp-grid bp-grid--3">
          {stories.map((post) => <StoryCard key={post.id} post={post} />)}
        </ul>
      ) : (
        <div className="bpc-empty">
          <span className="bp-tile"><CIcon name="award" size={24} /></span>
          <p>Success stories are coming soon. Check back shortly.</p>
        </div>
      )}
      <div className="bpc-pager">
        <KitPagination base="/success-stories" params={{}} page={meta.current_page} lastPage={meta.last_page} />
      </div>
    </>
  );
}
