import type { Metadata } from "next";
import { connection } from "next/server";
import { KitPagination, StoryCard } from "@/components/site/kit-content-cards";
import { CIcon } from "@/components/site/kit-content-icons";
import { BTN_FOCUS, BTN_FOCUS_DARK, COLS, GRID, HeroBadge, LIST, P, PAGE, section, tile } from "@/components/site/kit-content-ui";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn, cx } from "@/components/site/ui";
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
 * /contact button now also sits in a closing card. Tailwind since the migration's
 * phase 2 (was `.bh-page` kit classes and site-ui-content.css).
 */
export default async function SuccessStoriesPage({ searchParams }: PageProps<"/success-stories">) {
  await connection();
  const img = await imageResolver();
  return (
    <div className={PAGE}>
      <SeoSchema path="success-stories" />

      <PageHero
        // Was "Real Schools. Real Results." (a results claim, shown even with no stories; compliance pass, not in legacy, 2026-11-22).
        eyebrow="Success Stories"
        title="How Schools Grow with"
        highlight="Bodhira.ai"
        lead="Stories from schools, teachers and parents who made learning visual, measurable and engaging with Bodhira.ai."
        breadcrumbs={[{ label: "Success Stories" }]}
        image={{ src: img(null, "assets/img/pages/content/success-hero.jpg"), alt: "A crowd of smiling students celebrating together in shirts covered in friends' signatures", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="#stories" className={btn("maroon", "lg", BTN_FOCUS)}>Read the Stories <CIcon name="arrowRight" size={18} /></a>
            <a href="/contact" className={btn("ghost", "lg", BTN_FOCUS)}>Bring Bodhira.ai to Your School</a>
          </>
        }
        badge={
          <HeroBadge icon={<CIcon name="school" size={20} />} value={SITE_STATS.schools.label} label="Partner schools" />
        }
      />

      <section className={section("cream")} id="stories" aria-labelledby="stories-title" style={{ scrollMarginTop: 80 }}>
        <div className="site-container">
          <h2 id="stories-title" className="sr-only">Success stories</h2>
          <Stories searchParams={searchParams} />
        </div>
      </section>

      <section className={section("cream", { flushTop: true })} aria-label="Get started">
        <div className="site-container">
          <CtaBand
            image={img(null, "assets/img/pages/content/features-cta.jpg")}
            title="Bring Bodhira.ai to Your School"
            text="Join Bodhira.ai and give your students, teachers and parents one connected place to learn, teach and track progress."
            actions={
              <>
                <a href="/contact" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Bring Bodhira.ai to Your School <CIcon name="arrowRight" size={18} /></a>
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
        <ul className={cx(LIST, GRID, COLS[3])}>
          {stories.map((post) => <StoryCard key={post.id} post={post} />)}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-2 bg-white px-6 py-16 text-center">
          <span className={tile()}><CIcon name="award" size={24} /></span>
          <p className={cx(P, "m-0 text-base text-muted")}>Success stories are coming soon. Check back shortly.</p>
        </div>
      )}
      <div className="mt-14">
        <KitPagination base="/success-stories" params={{}} page={meta.current_page} lastPage={meta.last_page} />
      </div>
    </>
  );
}
