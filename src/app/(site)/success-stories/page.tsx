import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { PostCard } from "@/components/site/post-card";
import { SitePagination } from "@/components/site/site-pagination";
import { assetResolver, siteMetadata } from "@/lib/site";
import { getSuccessStories } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/success-stories", 'Success Stories · Bodhira.ai');
}

/** Legacy resources/views/success-stories.blade.php. */
export default async function SuccessStoriesPage({ searchParams }: PageProps<"/success-stories">) {
  await connection();
  const asset = await assetResolver();
  return (
    <>
      <SeoSchema path="success-stories" />
      <section className="page-header">
        <div className="bg-item">
            <div className="bg-img" data-background={asset("assets/img/bg-img/page-header-bg.png")}></div>
            <div className="overlay"></div>
            <div className="shapes">
                <div className="shape shape-1"><img src={asset("assets/img/shapes/page-header-shape-1.png")} alt="shape" /></div>
                <div className="shape shape-2"><img src={asset("assets/img/shapes/page-header-shape-2.png")} alt="shape" /></div>
                <div className="shape shape-3"><img src={asset("assets/img/shapes/page-header-shape-3.png")} alt="shape" /></div>
            </div>
        </div>
        <div className="container">
            <div className="page-header-content">
                <h1 className="title">Success Stories</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/success-stories"> Success Stories</a></h4>
            </div>
        </div>
    </section>
    

    <section className="pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Real Schools. Real Results.</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">How Schools Grow with Bodhira.ai</h2>
                <p className="mt-20 wow fade-in-bottom" data-wow-delay="500ms">Stories from schools, teachers and parents who made learning visual,
                    measurable and engaging with Bodhira.ai.</p>
            </div>

            <div className="row gy-4 mt-40">
                <Stories searchParams={searchParams} />
            </div>

            <div className="text-center mt-30">
                <a href="/contact" className="ed-primary-btn">Bring Bodhira.ai to Your School</a>
            </div>
        </div>
    </section>
    </>
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
      {stories.length ? stories.map((post) => <PostCard key={post.id} post={post} label="story" />) : (
        <div className="col-12 text-center pt-50 pb-50"><p style={{ color: "#9b8674" }}>Success stories are coming soon. Check back shortly.</p></div>
      )}
      <div className="col-12 mt-50 d-flex justify-content-center">
        <SitePagination base="/success-stories" params={{}} page={meta.current_page} lastPage={meta.last_page} />
      </div>
    </>
  );
}
