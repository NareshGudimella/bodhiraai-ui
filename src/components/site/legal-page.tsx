import { connection } from "next/server";
import type { ReactNode } from "react";
import { assetResolver, todayLong } from "@/lib/site";

/** Legacy legal/layout.blade.php: page header plus the document column. */
export async function LegalPage({ heading, path, children }: { heading: string; path: string; children: ReactNode }) {
  // Request time: building the app must not need the API (see the site layout).
  await connection();
  const [asset, today] = await Promise.all([assetResolver(), todayLong()]);
  return (
    <>
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
            <h1 className="title">{heading}</h1>
            <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href={path}> {heading}</a></h4>
          </div>
        </div>
      </section>
      <section className="pt-120 pb-120">
        <div className="container">
          <div className="legal-doc">
            <p className="legal-updated">Last updated: {today}</p>
            {children}
          </div>
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: `
        .legal-doc { max-width: 880px; margin: 0 auto; }
        .legal-doc .legal-updated { color:#9b8674; font-size:13px; letter-spacing:.2px; margin-bottom:30px; }
        .legal-doc h2 { font-family:'Poppins',sans-serif; font-size:21px; font-weight:700; color:var(--brand-maroon-dark,#3E0F16); margin-top:34px; margin-bottom:12px; }
        .legal-doc p, .legal-doc li { font-size:15.5px; color:#5b4a3d; line-height:1.78; margin-bottom:10px; }
        .legal-doc ul, .legal-doc ol { padding-left:22px; margin-bottom:16px; }
        .legal-doc li { margin-bottom:8px; }
        .legal-doc a { color:var(--brand-gold-2,#9a6b2f); font-weight:600; }
        .legal-doc a:hover { text-decoration:underline; }
        .legal-doc b, .legal-doc strong { color:var(--brand-maroon-dark,#3E0F16); }
      ` }} />
    </>
  );
}
