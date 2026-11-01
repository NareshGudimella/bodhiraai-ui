import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { SiteStatus } from "@/components/site/site-status";
import { VdoPlayer } from "@/components/site/vdo-player";
import { assetResolver, settingResolver, siteMetadata } from "@/lib/site";
import { getCollections } from "@/lib/site-api";
import { contactSubmit } from "@/lib/site-actions";
import { mediaUrl } from "@/lib/media";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/", 'Bodhira.ai — Modern Digital Learning for Schools');
}

const SUBJECTS = [
  ["fa-calculator", "Mathematics", "Concepts, practice & tests"],
  ["fa-flask", "Science", "Physics • Chemistry • Biology"],
  ["fa-book-open", "English", "Reading, grammar & writing"],
  ["fa-pen-fancy", "Hindi", "व्याकरण एवं साहित्य"],
  ["fa-earth-asia", "Social Studies", "History, Civics & Geography"],
  ["fa-laptop-code", "Computer Science", "Coding & digital skills"],
  ["fa-seedling", "EVS / GK", "Environment & awareness"],
  ["fa-language", "Sanskrit", "Language & grammar"],
  ["fa-brain", "Mental Maths", "Speed & reasoning"],
];
const CLASSES = [
  ["fa-shapes", "Class 1 – 5 (Primary)"],
  ["fa-book", "Class 6 – 8 (Middle)"],
  ["fa-graduation-cap", "Class 9 – 10 (Secondary)"],
  ["fa-user-graduate", "Class 11 – 12 (Sr. Secondary)"],
];
/** Sample faces when the CMS team is empty. */
const SAMPLE_TEAM = [["Zaramane Mass Likan", "team-1"], ["Amelia Grace Lily", "team-2"], ["Mason Logan Dee", "team-3"], ["Isabella Charlotte", "team-4"]];

/** Legacy resources/views/home.blade.php. */
export default async function HomePage() {
  await connection();
  const [asset, setting, { team: allTeam }] = await Promise.all([assetResolver(), settingResolver(), getCollections()]);
  // Driven by the CMS → Team manager (falls back to sample faces if no members are added).
  const team = allTeam.slice(0, 4);
  return (
    <>
      <SeoSchema path="home" />
      <style dangerouslySetInnerHTML={{ __html: `.bi-1{background:#fff !important;color:#5C1A26 !important;border:1px solid #C49560 !important;}` }} />
      <section className="hero-section overflow-hidden">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                    <div className="hero-content">
                        <div className="section-heading mb-40">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Welcome to
                                Bodhira.ai</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Every Child's Learning <span>Begins Here</span></h2>
                            <p className="mt-20 wow fade-in-bottom" data-wow-delay="450ms">Transforming education through
                                visual learning, AI-powered insights and interactive digital experiences. Bodhira.ai is a
                                complete learning ecosystem where every child can <strong>Learn. Visualize. Understand. Excel.</strong></p>
                        </div>
                        <div className="hero-btn-wrap">
                            <a href="/book-demo" className="ed-primary-btn">Book a Demo</a>
                            <a href="/register/student" className="ed-primary-btn bi-1">Get Started</a>
                        </div>
                        <div className="hero-author">
                            <ul>
                                <li><img src={asset("assets/img/images/hero-author-1.png")} alt="img" /></li>
                                <li><img src={asset("assets/img/images/hero-author-2.png")} alt="img" /></li>
                                <li><img src={asset("assets/img/images/hero-author-3.png")} alt="img" /></li>
                                <li><img src={asset("assets/img/images/hero-author-4.png")} alt="img" /></li>
                            </ul>
                            <h5><span>50k+</span>Students Learning</h5>
                        </div>
                        <h4 className="bottom-text">Trusted by <span>200+</span> Schools across India</h4>
                    </div>
                </div>
                <div className="col-lg-5 col-md-12">
                    <div className="hero-img-wrap">
                        <div className="hero-img">
                            <img src={asset("assets/img/portrait-happy-cute-little-indian-260nw-2542824705.jpg")} alt="hero" />
                        </div>
                        <div className="hero-text-element">
                            <h3 className="title"><span className="odometer" data-count="256">0</span><span className="number">+</span></h3>
                            <p>Subjects & Topics</p>
                        </div>
                    </div>
                </div>
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
                                <a role="button" tabIndex={0} className="video-popup vdo-play" data-vdo-video={setting("media.home_video_id", "a69b203eb0fe4c5196ecf06e6261c66c")}>
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
                                <span>School Support</span>
                                <a href="tel:+918000000000">+91 80000 00000</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-12">
                    <div className="about-content">
                        <div className="section-heading mb-40">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>How Bodhira.ai Works</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">How Bodhira.ai Works for<br />Your <span>School, Students &amp; Parents</span></h2>
                            <p className="mt-20 wow fade-in-bottom" data-wow-delay="500ms">Bodhira.ai brings learning management, academic workflows, AI-powered tools, performance analytics,
                                parent engagement, and institution-wide administration together in a single integrated
                                environment — empowering students to learn smarter, teachers to teach efficiently, and
                                institutions to operate effortlessly.</p>
                        </div>
                        <div className="about-counter-items wow fade-in-bottom" data-wow-delay="600ms">
                            <div className="about-counter-item">
                                <div className="icon"><img src={asset("assets/img/icon/about-1.png")} alt="about" /></div>
                                <div className="content">
                                    <h3 className="title"><span className="odometer" data-count="9.5">0</span><span className="number">k+</span></h3>
                                    <p>Students actively learning<br />across partner schools</p>
                                </div>
                            </div>
                            <div className="about-counter-item">
                                <div className="icon"><img src={asset("assets/img/icon/about-2.png")} alt="about" /></div>
                                <div className="content">
                                    <h3 className="title"><span className="odometer" data-count="6.7">0</span><span className="number">k+</span></h3>
                                    <p>Students actively learning<br />across partner schools</p>
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
    

    <section className="course-category pt-120 pb-120">
        <div className="container">
                        <div className="subj-stage wow fade-in-bottom" data-wow-delay="300ms">
                <img className="subj-girl" src={asset("assets/img/images/subjects-student.webp")} alt="A school student showing the subjects available on Bodhira.ai" />
                <div className="subj-board">
                    <div className="section-heading">
                        <h4 className="sub-heading"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Subjects Available</h4>
                        <h2 className="section-title">Every Major Subject. Every Class. One Platform.</h2>
                    </div>
                    <div className="subj-grid subj-grid--two">
                        {SUBJECTS.map(([icon, name, sub]) => (
                            <div key={name} className="subj-card">
                                <span className="subj-ic"><i className={`fa-solid ${icon}`}></i></span>
                                <span className="subj-meta">
                                    <span className="subj-name">{name}</span>
                                    <span className="subj-sub">{sub}</span>
                                </span>
                            </div>
                                                ))}
                    </div>
                    <div className="subj-classes">
                        <span className="subj-classes-label">Browse by class</span>
                        {CLASSES.map(([icon, label]) => (
                            <span key={label} className="subj-chip"><i className={`fa-solid ${icon}`}></i>{label}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="promo-section pt-120 pb-120 overflow-hidden">
        <div className="bg-item">
            <div className="bg-shape-1"></div>
            <div className="bg-shape-2"></div>
        </div>
        <div className="shapes">
            <div className="shape shape-1"><img src={asset("assets/img/shapes/promo-shape-1.png")} alt="shape" /></div>
            <div className="shape shape-2"><img src={asset("assets/img/shapes/promo-shape-2.png")} alt="shape" /></div>
        </div>
        <div className="container">
            <div className="section-heading promo-heading text-center white-content">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Why Schools Choose Bodhira.ai</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Built Around the Way Your School Already Teaches
                </h2>
            </div>
            <div className="row gy-lg-0 gy-4 justify-content-center promo-wrap">
                <div className="col-lg-4 col-md-6">
                    <div className="promo-item white-content wow fade-in-bottom" data-wow-delay="200ms">
                        <div className="promo-thumb">
                            <img className="main-img" src={asset("assets/img/images/promo-img-1.png")} alt="promo" />
                            <div className="icon"> <img src={asset("assets/img/icon/promo-4.png")} alt="icon" /></div>
                        </div>
                        <h3 className="title">Video Lessons + Ask AI</h3>
                        <p>Students watch lessons by topic and click<br /> &ldquo;Ask AI&rdquo; whenever something is unclear.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="promo-item white-content wow fade-in-bottom" data-wow-delay="400ms">
                        <div className="promo-thumb">
                            <img className="main-img" src={asset("assets/img/images/promo-img-2.png")} alt="promo" />
                            <div className="icon"> <img src={asset("assets/img/icon/promo-5.png")} alt="icon" /></div>
                        </div>
                        <h3 className="title">Quizzes, Notes &amp; Discussions</h3>
                        <p>Students watch lessons by topic and click<br /> &ldquo;Ask AI&rdquo; whenever something is unclear.</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6">
                    <div className="promo-item item-3 white-content wow fade-in-bottom" data-wow-delay="500ms">
                        <div className="promo-thumb">
                            <img src={asset("assets/img/images/promo-img-3.png")} alt="promo" />
                            <div className="icon"> <img src={asset("assets/img/icon/promo-6.png")} alt="icon" /></div>
                        </div>
                        <h3 className="title">Teacher &amp; Parent Dashboards</h3>
                        <p>Students watch lessons by topic and click<br /> &ldquo;Ask AI&rdquo; whenever something is unclear.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    
    
    

    <section className="counter-section">
        <div className="container">
            <div className="row counter-wrap gy-lg-0 gy-5">
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item item-1 white-content wow fade-in-bottom" data-wow-delay="200ms">
                        <span className="counter-ico"><i className="fa-solid fa-user-graduate"></i></span>
                        <h3 className="title"><span className="odometer" data-count="3,192">0</span>+</h3>
                        <p> Successfully Trained</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item white-content wow fade-in-bottom" data-wow-delay="400ms">
                        <span className="counter-ico"><i className="fa-solid fa-chalkboard-user"></i></span>
                        <h3 className="title"><span className="odometer" data-count="15,485">0</span>+</h3>
                        <p>Classes Completed</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item white-content wow fade-in-bottom" data-wow-delay="500ms">
                        <span className="counter-ico"><i className="fa-solid fa-face-smile"></i></span>
                        <h3 className="title"><span className="odometer" data-count="97.55">0</span>%</h3>
                        <p>Satisfaction Rate</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="counter-item item-4 white-content wow fade-in-bottom" data-wow-delay="600ms">
                        <span className="counter-ico"><i className="fa-solid fa-school"></i></span>
                        <h3 className="title"><span className="odometer" data-count="200">0</span>+</h3>
                        <p>Partner Schools</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="faq-section pt-120 pb-120">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-5 col-md-12">
                    <div className="faq-img-wrap wow fade-in-left" data-wow-delay="400ms">
                        <div className="faq-img">
                            <img src={asset("assets/img/images/faq-img.png")} alt="faq" />
                        </div>
                        <div className="faq-text-box">
                            <h4 className="student">Total Students</h4>
                            <ul className="faq-thumb-list">
                                <li><img src={asset("assets/img/images/faq-thumb-1.png")} alt="faq" /></li>
                                <li><img src={asset("assets/img/images/faq-thumb-2.png")} alt="faq" /></li>
                                <li><img src={asset("assets/img/images/faq-thumb-3.png")} alt="faq" /></li>
                                <li><img src={asset("assets/img/images/faq-thumb-4.png")} alt="faq" /></li>
                                <li className="number">25+</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7 col-md-12">
                    <div className="faq-content content-1">
                        <div className="section-heading mb-30">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Frequently Asked</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Everytime Schools, Parents and Teachers Ask Before They Sign Up</h2>
                        </div>
                        <div className="faq-accordion">
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item wow fade-in-bottom" data-wow-delay="400ms">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"><span>01.</span>Does Bodhira.ai work on a mobile phone?</button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Yes. Bodhira.ai is mobile-first. Students watch lessons, take quizzes, and ask the AI on a phone, tablet or laptop — videos resume where they paused, even on a different device.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item wow fade-in-bottom" data-wow-delay="200ms">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"><span>02.</span>How does the &ldquo;Ask AI&rdquo; feature work?</button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            While watching a lesson, a student can click &ldquo;Ask AI&rdquo;, type a question, and get a clear explanation in plain words. The AI uses only that lesson&rsquo;s content, so the answer always matches what the student is studying.
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item wow fade-in-bottom" data-wow-delay="200ms">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree"><span>03.</span>Do parents get their own login?</button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            Yes. Each parent gets a separate login linked to their child. They see lessons watched, quiz scores, weak subjects, attendance and teacher notes — in real time.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="team-section">
        <div className="team-wrap pt-120 pb-120" data-background={asset("assets/img/bg-img/team-bg.png")}>
            <div className="container">
                <div className="section-heading text-center">
                    {team.length ? (<>
                        <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>The People Behind Bodhira.ai</h4>
                        <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Meet the Team</h2>
                    </>) : (<>
                        <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>In Their Words</h4>
                        <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Schools, Teachers and Parents on Bodhira.ai</h2>
                    </>)}
                </div>
                <div className="row gy-xl-0 gy-4 justify-content-center">
                    {team.length ? team.map((m, i) => (
                        <div key={m.id} className="col-xl-3 col-lg-4 col-md-6">
                            <div className="team-item wow fade-in-bottom" data-wow-delay={`${200 + i * 100}ms`}>
                                <div className="team-thumb">
                                    <img src={mediaUrl(m.photo_url) ?? asset(`assets/img/team/team-${(i % 4) + 1}.png`)} alt={m.name} />
                                </div>
                                <div className="team-content">
                                    <h3 className="title">{m.name}</h3>
                                    {m.role && <span>{m.role}</span>}
                                </div>
                            </div>
                        </div>
                    )) : SAMPLE_TEAM.map(([name, img], i) => (
                            <div key={img} className="col-xl-3 col-lg-4 col-md-6">
                                <div className="team-item wow fade-in-bottom" data-wow-delay={`${200 + i * 100}ms`}>
                                    <div className="team-thumb">
                                        <img src={asset(`assets/img/team/${img}.png`)} alt="team" />
                                        <ul className="team-social">
                                            <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                                            <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                                            <li><a href="#"><i className="fa-brands fa-behance"></i></a></li>
                                        </ul>
                                    </div>
                                    <div className="team-content">
                                        <h3 className="title"><a href="/teachers">{name}</a></h3>
                                        <span>Online Teachers</span>
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
    

    <section className="content-section pt-120 pb-120 overflow-hidden">
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <div className="content-img-wrap wow fade-in-left" data-wow-delay="400ms">
                        <div className="content-img-1"><img src={asset("assets/img/images/content-img-1.png")} alt="img" /></div>
                        <div className="content-img-2"><img src={asset("assets/img/images/content-img-2.png")} alt="img" /></div>
                        <div className="content-img-3"><img src={asset("assets/img/images/content-img-3.png")} alt="img" /></div>
                        <div className="border-shape"></div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="content-info">
                        <div className="section-heading mb-20">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>What Every Student Gets</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Lessons, Quizzes and Progress<br />All in One Place</h2>
                        </div>
                        <p className="mb-30 wow fade-in-bottom" data-wow-delay="500ms">Students unlock the subjects they study, watch curriculum-aligned lessons by topic, finish short quizzes after each lesson, and earn badges as they progress. Parents and teachers see all of it.</p>
                        <div className="content-item mb-30 wow fade-in-bottom" data-wow-delay="600ms">
                            <div className="icon"><img src={asset("assets/img/icon/content-1.png")} alt="icon" /></div>
                            <div className="content">
                                <h4 className="title">Video Lessons + Ask AI</h4>
                                <p>Auto-graded quizzes after every lesson. Scores go straight to the teacher and parent.</p>
                            </div>
                        </div>
                        <div className="content-item wow fade-in-bottom" data-wow-delay="700ms">
                            <div className="icon"><img src={asset("assets/img/icon/content-2.png")} alt="icon" /></div>
                            <div className="content">
                                <h4 className="title">Every Lesson Has a Quiz</h4>
                                <p>Auto-graded quizzes after every lesson. Scores go straight to the teacher and parent.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="request-section" id="setup-school" data-background={asset("assets/img/bg-img/request-bg.png")}>
        <div className="bg-img" data-background={asset("assets/img/images/request-img-1.png")}></div>
        <div className="shape"><img src={asset("assets/img/shapes/req-shape-1.png")} alt="shape" /></div>
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6 d-none d-lg-block">
                    <div className="req-photo wow fade-in-left" data-wow-delay="300ms">
                        <img src={asset("assets/img/images/req-photo.jpg")} alt="Set up your school on Bodhira.ai" />
                    </div>
                </div>
                <div className="col-xl-6 col-lg-12">
                    <div className="request-content white-content pt-120 pb-120">
                        <div className="section-heading white-content mb-20">
                            <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Bring Bodhira.ai</h4>
                            <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Set Up Your School<br />on Bodhira.ai</h2>
                        </div>
                        <p className="desc mb-20 wow fade-in-bottom" data-wow-delay="400ms">Tell us your school name and email and we will reach out to schedule a walkthrough and onboard your students.</p>
                        <SiteStatus name="status" className="mb-20" style={{ color: "#E2B873" }} />
                        <div className="request-form-wrapper wow fade-in-bottom" data-wow-delay="500ms">
                            <form action={contactSubmit}>
                                
                                <input type="hidden" name="subject" value="School onboarding request" />
                                <div className="form-items">
                                    <div className="form-item">
                                        <input type="text" id="name" name="name" className="form-control" placeholder="School Name" required />
                                    </div>
                                    <div className="form-item">
                                        <input type="email" id="email" name="email" className="form-control" placeholder="Email Address" required />
                                    </div>
                                </div>
                                <div className="request-btn wow fade-in-bottom" data-wow-delay="600ms">
                                    <button className="ed-primary-btn" type="submit">Subscribe Now</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <section className="blog-section pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>News & Blog</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">From the Bodhira.ai Blog</h2>
            </div>
            <div className="row gy-md-0 gy-4">
                <div className="col-md-6">
                    <div className="post-card post-card-1 wow fade-in-bottom" data-wow-delay="200ms">
                        <div className="post-thumb">
                            <img src={asset("assets/img/blog/post-1.jpg")} alt="post" />
                        </div>
                        <div className="post-content-wrap">
                            <div className="post-content">
                                <span className="category">Learning</span>
                                <h3 className="title"><a href="/blog-details">Repurpose mission critical action life
                                        items rather total linkage suds</a></h3>
                                <ul className="post-meta">
                                    <li><i className="fa-sharp fa-regular fa-clock"></i>August 15, 2025</li>
                                    <li><i className="fa-sharp fa-regular fa-folder"></i>Social Studies</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="post-card post-card-1 wow fade-in-bottom" data-wow-delay="400ms">
                        <div className="post-thumb">
                            <img src={asset("assets/img/blog/post-2.png")} alt="post" />
                        </div>
                        <div className="post-content-wrap">
                            <div className="post-content">
                                <span className="category">Learning</span>
                                <h3 className="title"><a href="/blog-details">Strategies for Managing Stress and
                                        Preventing Burnout in Education</a></h3>
                                <ul className="post-meta">
                                    <li><i className="fa-sharp fa-regular fa-clock"></i>August 15, 2025</li>
                                    <li><i className="fa-sharp fa-regular fa-folder"></i>Social Studies</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    

    <VdoPlayer />
    </>
  );
}
