import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { mediaUrl } from "@/lib/media";
import { assetResolver, siteMetadata, strLimit } from "@/lib/site";
import { getCollections } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/about", 'About Bodhira.ai — Built for Schools, Students & Parents');
}

/** Legacy resources/views/about.blade.php. */
export default async function AboutPage() {
  await connection();
  const [asset, { team, testimonials }] = await Promise.all([assetResolver(), getCollections()]);
  return (
    <>
      <SeoSchema path="about" />
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
                <h1 className="title">About Us</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/about"> About Us</a></h4>
            </div>
        </div>
    </section>
    

    <section className="about-section pt-120 pb-120">
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-12">
                    <div className="about-img-wrap wow fade-in-left" data-wow-delay="400ms">
                        <div className="about-img-1">
                            <img src={asset("assets/img/images/about-img-1.jpg")} alt="about" />
                            <div className="video-btn">
                                <a className="video-popup venobox" data-autoplay="true" data-vbtype="video" href="https://youtu.be/JwC-Qx1lJso">
                                    <div className="play-btn">
                                        <i className="fa-sharp fa-solid fa-play"></i>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="about-img-2">
                            <img src={asset("assets/img/images/about-img-2.jpg")} alt="about" />
                        </div>
                        <div className="about-contact">
                            <div className="icon"><i className="fa-sharp fa-regular fa-phone-volume"></i></div>
                            <div className="content">
                                <span>Institutional Support</span>
                                <a href="tel:+918000000000">+91 80000 00000</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-12">
                    <div className="about-content">
                        <div className="section-heading mb-40">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>How Bodhira.ai Works</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Made for Schools. Built Around<br />Students, Teachers &amp; <span>Parents.</span></h2>
                            <p className="mt-20 wow fade-in-bottom" data-wow-delay="500ms">Bodhira.ai is not just another LMS platform — it is a complete digital learning infrastructure built
                                for schools and educational institutions that want to modernize learning, streamline
                                operations, and improve student engagement. The platform brings learning management,
                                academic workflows, performance analytics, AI-powered tools, parent engagement, and
                                institution administration together in one integrated environment.</p>
                        </div>
                        <div className="about-counter-items wow fade-in-bottom" data-wow-delay="600ms">
                            <div className="about-counter-item">
                                <div className="icon"><img src={asset("assets/img/icon/about-1.png")} alt="about" /></div>
                                <div className="content">
                                    <h3 className="title"><span className="odometer" data-count="9.5">0</span><span className="number">k+</span></h3>
                                    <p>Students learning every day<br />across partner schools</p>
                                </div>
                            </div>
                            <div className="about-counter-item">
                                <div className="icon"><img src={asset("assets/img/icon/about-2.png")} alt="about" /></div>
                                <div className="content">
                                    <h3 className="title"><span className="odometer" data-count="6.7">0</span><span className="number">k+</span></h3>
                                    <p>Students learning every day<br />across partner schools</p>
                                </div>
                            </div>
                        </div>
                        <div className="about-btn wow fade-in-bottom" data-wow-delay="700ms">
                            <a href="/login" className="ed-primary-btn">Sign In</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="about-feature pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>What Drives Us</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Built on a Simple Belief About <span>Learning</span>
                </h2>
            </div>
            <div className="row gy-lg-0 gy-5">
                <div className="col-lg-4 col-md-6">
                    <div className="about-feature-card">
                        <div className="icon"><i className="fa-solid fa-eye"></i></div>
                        <div className="content">
                            <h3 className="title">Our Vision</h3>
                            <p>To create a world where every child can understand, enjoy, and excel in learning through technology-driven, visual, and accessible education.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="about-feature-card">
                        <div className="icon"><i className="fa-solid fa-bullseye"></i></div>
                        <div className="content">
                            <h3 className="title">Our Mission</h3>
                            <p>To empower schools, teachers, students and parents with a unified platform that turns complex concepts into engaging experiences through visual content, AI assistance and personalized learning pathways.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="about-feature-card">
                        <div className="icon"><i className="fa-solid fa-lightbulb"></i></div>
                        <div className="content">
                            <h3 className="title">Understood, Not Memorized</h3>
                            <p>Students learn better when they can see, experience and interact with concepts. We turn lessons into visual experiences that improve comprehension, retention and confidence.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="counter-section">
        <div className="container">
            <div className="row counter-wrap gy-lg-0 gy-5">
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item item-1 white-content">
                        <span className="counter-ico"><i className="fa-solid fa-user-graduate"></i></span>
                        <h3 className="title"><span className="odometer" data-count="3,192">0</span>+</h3>
                        <p>Students Onboarded</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item white-content">
                        <span className="counter-ico"><i className="fa-solid fa-chalkboard-user"></i></span>
                        <h3 className="title"><span className="odometer" data-count="15,485">0</span>+</h3>
                        <p>Lessons Delivered</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item white-content">
                        <span className="counter-ico"><i className="fa-solid fa-face-smile"></i></span>
                        <h3 className="title"><span className="odometer" data-count="97.55">0</span>%</h3>
                        <p>School Satisfaction</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item item-4 white-content">
                        <span className="counter-ico"><i className="fa-solid fa-school"></i></span>
                        <h3 className="title"><span className="odometer" data-count="200">0</span>+</h3>
                        <p>Partner Schools</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="team-section pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                {team.length ? (<>
                    <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>The People Behind Bodhira.ai</h4>
                    <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Meet the Team</h2>
                </>) : (<>
                    <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Dashboards Built for Each Role</h4>
                    <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Designed Around the People Who Use It Every Day</h2>
                </>)}
            </div>
            <div className="row gy-lg-0 gy-4 justify-content-center">
                {team.length ? team.map((m, i) => (
                    <div key={m.id} className="col-lg-3 col-md-6">
                        <div className="team-item-3 team-item-5">
                            <div className="team-thumb">
                                <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                <div className="team-men">
                                    <img src={mediaUrl(m.photo_url) ?? asset(`assets/img/team/team-men-${(i % 4) + 1}.png`)} alt={m.name} />
                                </div>
                            </div>
                            <div className="team-content">
                                <h3 className="title">{m.name}</h3>
                                {m.role && <span>{m.role}</span>}
                                {m.bio && <p className="team-bio mt-2 mb-0" style={{ fontSize: "13px", lineHeight: "1.6", opacity: ".85" }}>{strLimit(m.bio, 110)}</p>}
                            </div>
                        </div>
                    </div>
                )) : (<>
                    <div className="col-lg-3 col-md-6">
                        <div className="team-item-3 team-item-5">
                            <div className="team-thumb">
                                <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                <div className="team-men">
                                    <img src={asset("assets/img/team/team-men-1.png")} alt="team" />
                                </div>
                            </div>
                            <div className="team-content">
                                <h3 className="title">Student</h3>
                                <span>See Their View</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="team-item-3 team-item-5">
                            <div className="team-thumb">
                                <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                <div className="team-men">
                                    <img src={asset("assets/img/team/team-men-2.png")} alt="team" />
                                </div>
                            </div>
                            <div className="team-content">
                                <h3 className="title">Teacher</h3>
                                <span>See Their View</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="team-item-3 team-item-5">
                            <div className="team-thumb">
                                <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                <div className="team-men">
                                    <img src={asset("assets/img/team/team-men-3.png")} alt="team" />
                                </div>
                            </div>
                            <div className="team-content">
                                <h3 className="title">Parent</h3>
                                <span>See Their View</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="team-item-3 team-item-5">
                            <div className="team-thumb">
                                <div className="shape"><img src={asset("assets/img/shapes/team-shape-3.png")} alt="team" /></div>
                                <div className="team-men">
                                    <img src={asset("assets/img/team/team-men-4.png")} alt="team" />
                                </div>
                            </div>
                            <div className="team-content">
                                <h3 className="title">School Admin</h3>
                                <span>See Their View</span>
                            </div>
                        </div>
                    </div>
                </>)}
            </div>
        </div>
    </section>
    

    <section className="testimonial-section-3 pt-120 pb-120">
        <div className="shapes">
            <div className="shape shape-1"><img src={asset("assets/img/shapes/testi-shape-3.png")} alt="shape" /></div>
            <div className="shape shape-2"><img src={asset("assets/img/shapes/testi-shape-4.png")} alt="shape" /></div>
        </div>
        <div className="container">
            <div className="row gy-xl-0 gy-5 align-items-center">
                <div className="col-xl-5 col-lg-12">
                    <div className="testi-left-content white-content">
                        <div className="section-heading mb-20 white-content">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Why Bodhira.ai</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">What Schools<br />Say About Bodhira.ai</h2>
                        </div>
                        <p className="mb-0 wow fade-in-bottom" data-wow-delay="500ms">A platform our students enjoy using, our teachers actually adopt, and our parents finally feel connected to — that is what Bodhira.ai delivered for us.</p>
                    </div>
                </div>
                <div className="col-xl-7 col-lg-12">
                    <div className="testi-carousel-wrap-2">
                        <div className="testi-carousel-2 swiper">
                            <div className="swiper-wrapper">
                                {testimonials.length ? testimonials.map((t) => (
                                    <div key={t.id} className="swiper-slide">
                                        <div className="testi-item-3">
                                            {!!t.rating && (
                                                <div className="testi-rating" style={{ color: "#E2B873", fontSize: "14px", marginBottom: "12px", letterSpacing: "2px" }}>
                                                    {Array.from({ length: t.rating }, (_, i) => <i key={i} className="fa-solid fa-star"></i>)}
                                                </div>
                                            )}
                                            <p>"{t.quote}"</p>
                                            <div className="testi-author">
                                                <div className="testi-author-img">
                                                    <img src={mediaUrl(t.avatar_url) ?? asset("assets/img/images/testi-author-3.png")} alt={t.name} />
                                                </div>
                                                <h4 className="name">{t.name} <span>{[t.role, t.company].filter(Boolean).join(", ")}</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                )) : (<>
                                    <div className="swiper-slide">
                                        <div className="testi-item-3">
                                            <h3 className="title">From the Principal's Office</h3>
                                            <p>"In two months, our students stopped asking for video tutorials elsewhere and parents stopped asking us 'is my child studying?' Bodhira.ai gave both sides answers."</p>
                                            <div className="testi-author">
                                                <div className="testi-author-img">
                                                    <img src={asset("assets/img/images/testi-author-3.png")} alt="testi" />
                                                </div>
                                                <h4 className="name">Mrs. Sharma <span>Principal, Partner School</span></h4>
                                            </div>
                                        </div>
                                    </div>
                                </>)}
                            </div>
                        </div>
                        <div className="swiper-arrow">
                            <div className="swiper-nav swiper-next"><i className="fa-regular fa-arrow-left"></i></div>
                            <div className="swiper-nav swiper-prev"><i className="fa-regular fa-arrow-right"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="video-feature-section pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Our Features</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">How Learning Happens on Bodhira.ai</h2>
            </div>
            <div className="row gy-md-0 gy-4">
                <div className="col-md-6">
                    <div className="video-feature text-center">
                        <div className="video-thumb">
                            <img src={asset("assets/img/images/video-img-1.png")} alt="video" />
                            <div className="video-btn">
                                <a className="video-popup venobox" data-autoplay="true" data-vbtype="video" href="https://youtu.be/JwC-Qx1lJso?feature=shared">
                                    <div className="play-btn">
                                        <i className="fa-sharp fa-solid fa-play"></i>
                                    </div>
                                    <div className="ripple"></div>
                                </a>
                            </div>
                        </div>
                        <div className="video-content">
                            <h3 className="title">Watch Lessons by Topic</h3>
                            <p>Every subject is broken down into lessons and<br /> topics — students pick a topic, watch the video,<br /> and finish a short quiz right after.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="video-feature text-center">
                        <div className="video-thumb">
                            <img src={asset("assets/img/images/video-img-2.png")} alt="video" />
                            <div className="video-btn">
                                <a className="video-popup venobox" data-autoplay="true" data-vbtype="video" href="https://youtu.be/JwC-Qx1lJso?feature=shared">
                                    <div className="play-btn">
                                        <i className="fa-sharp fa-solid fa-play"></i>
                                    </div>
                                    <div className="ripple"></div>
                                </a>
                            </div>
                        </div>
                        <div className="video-content">
                            <h3 className="title">Take a Quiz, Get Feedback</h3>
                            <p>Every subject is broken down into lessons and<br /> topics — students pick a topic, watch the video,<br /> and finish a short quiz right after.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
