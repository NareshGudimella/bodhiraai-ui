import { connection } from "next/server";
import { assetResolver } from "@/lib/site";

/** The theme's inner-page header: background, shapes, title and breadcrumb. */
export async function SitePageHeader({ title, crumb, href }: { title: string; crumb: string; href?: string }) {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const asset = await assetResolver();
  return (
    <section className="page-header">
      <div className="bg-item">
        <div className="bg-img" data-background={asset("assets/img/bg-img/page-header-bg.png")}></div>
        <div className="overlay"></div>
        <div className="shapes">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`shape shape-${n}`}><img src={asset(`assets/img/shapes/page-header-shape-${n}.png`)} alt="shape" /></div>
          ))}
        </div>
      </div>
      <div className="container">
        <div className="page-header-content">
          <h1 className="title">{title}</h1>
          <h4 className="sub-title">
            <a className="home" href="/">Home </a><span className="icon">/</span>
            {href ? <a className="inner-page" href={href}> {crumb}</a> : <span className="inner-page"> {crumb}</span>}
          </h4>
        </div>
      </div>
    </section>
  );
}
