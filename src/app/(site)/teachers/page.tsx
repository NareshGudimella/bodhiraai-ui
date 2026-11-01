import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { mediaUrl } from "@/lib/media";
import { assetResolver, siteMetadata } from "@/lib/site";
import { getCollections } from "@/lib/site-api";

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

/** Legacy resources/views/teachers.blade.php. */
export default async function TeachersPage() {
  await connection();
  const [asset, { team }] = await Promise.all([assetResolver(), getCollections()]);
  return (
    <>
      <SeoSchema path="teachers" />
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
                <h1 className="title">Our Instructor</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="team.html"> Our Instructor</a></h4>
            </div>
        </div>
    </section>
    

    <section className="team-section pt-120 pb-120">
        <div className="container">
            <div className="row gy-4 justify-content-center">
                {team.length ? team.map((m, i) => (
                    <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                        <div className="team-item-2 wow fade-in-bottom" data-wow-delay={`${200 + (i % 3) * 150}ms`}>
                            <div className="team-thumb">
                                <img src={mediaUrl(m.photo_url) ?? asset(`assets/img/team/team-${(i % 8) + 1}.png`)} alt={m.name} />
                                <div className="team-content">
                                    <div className="instructor-info">
                                        <h3 className="title">{m.name}</h3>
                                        {m.role && <span>{m.role}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : FALLBACK.map(([name, img], i) => (
                        <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                            <div className="team-item-2 wow fade-in-bottom" data-wow-delay={`${200 + (i % 3) * 150}ms`}>
                                <div className="team-thumb">
                                    <img src={asset(`assets/img/team/${img}.png`)} alt="team" />
                                    <div className="team-content">
                                        <div className="instructor-info">
                                            <h3 className="title">{name}</h3>
                                            <span>Instructor</span>
                                        </div>
                                        <div className="team-social">
                                            <div className="expand">
                                                <i className="fa-solid fa-share-nodes"></i>
                                            </div>
                                            <ul className="social-list">
                                                <li><a href="#" className="facebook"><i className="fab fa-facebook-f"></i></a></li>
                                                <li><a href="#" className="google"><i className="fab fa-twitter"></i></a></li>
                                                <li><a href="#" className="twitter"><i className="fab fa-behance"></i></a></li>
                                                <li><a href="#" className="pinterest"><i className="fab fa-pinterest-p"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    </section>
    </>
  );
}
