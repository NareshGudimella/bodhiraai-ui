import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { assetResolver, siteMetadata } from "@/lib/site";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

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
                    ["fa-shapes", "Class 1 – 5", "Primary"],
                    ["fa-book", "Class 6 – 8", "Middle"],
                    ["fa-graduation-cap", "Class 9 – 10", "Secondary"],
                    ["fa-user-graduate", "Class 11 – 12", "Sr. Secondary"],
                ];
const INSIDE = [
                    ["fa-clapperboard", "Visual Video Lessons", "Short, topic-wise videos that explain concepts visually so students understand, not memorise."],
                    ["fa-file-lines", "Notes & PDFs", "Downloadable notes and summaries for revision, anytime — even offline."],
                    ["fa-clipboard-check", "Quizzes After Each Topic", "Auto-graded quizzes flag weak areas instantly so students know what to revise."],
                    ["fa-robot", "AI Learning Assistant", "Ask a doubt right inside the lesson and get an instant, simple explanation 24/7."],
                ];

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/courses", 'Courses · Bodhira.ai');
}

/** Legacy resources/views/courses.blade.php. */
export default async function CoursesPage() {
  await connection();
  const asset = await assetResolver();
  return (
    <>
      <SeoSchema path="courses" />
      <style dangerouslySetInnerHTML={{ __html: `.bi-1{background:#fff !important;color:#5C1A26 !important;border:1px solid #C49560 !important;}` }} />
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
                <h1 className="title">Courses</h1>
                <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/courses"> Courses</a></h4>
            </div>
        </div>
    </section>
    

    <section className="course-category pt-120 pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Subjects Available</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Every Major Subject. Every Class. One Platform.</h2>
                <p className="mt-20 wow fade-in-bottom" data-wow-delay="500ms">Each subject is organised into chapters and topics, with visual video lessons,
                    downloadable notes, quizzes and an AI learning assistant built into every lesson.</p>
            </div>
            <div className="subj-grid wow fade-in-bottom" data-wow-delay="500ms">
                {SUBJECTS.map((s, idx) => (
                    <div key={idx} className="subj-card">
                        <span className="subj-ic"><i className={`fa-solid ${s[0]}`}></i></span>
                        <span className="subj-meta">
                            <span className="subj-name">{s[1]}</span>
                            <span className="subj-sub">{s[2]}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section>
    

    <section className="about-feature pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Class Levels</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">Built for Every Stage of School</h2>
            </div>
            <div className="row gy-4 mt-40">
                {CLASSES.map((c, idx) => (
                    <div key={idx} className="col-lg-3 col-md-6">
                        <div className="about-feature-card text-center">
                            <div className="icon mx-auto"><i className={`fa-solid ${c[0]}`}></i></div>
                            <div className="content">
                                <h3 className="title">{c[1]}</h3>
                                <p>{c[2]}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
    

    <section className="about-feature pb-120">
        <div className="container">
            <div className="section-heading text-center">
                <h4 className="sub-heading wow fade-in-bottom" data-wow-delay="200ms"><span className="heading-icon"><i className="fa-sharp fa-solid fa-bolt"></i></span>Inside Every Course</h4>
                <h2 className="section-title wow fade-in-bottom" data-wow-delay="400ms">What Each Lesson Gives Your Child</h2>
            </div>
            <div className="row gy-4 mt-40">
                {INSIDE.map((f, idx) => (
                    <div key={idx} className="col-lg-3 col-md-6">
                        <div className="about-feature-card">
                            <div className="icon"><i className={`fa-solid ${f[0]}`}></i></div>
                            <div className="content">
                                <h3 className="title">{f[1]}</h3>
                                <p>{f[2]}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-50">
                <a href="/book-demo" className="ed-primary-btn">Book a Demo</a>
                <a href="/register/student" className="ed-primary-btn bi-1">Get Started</a>
            </div>
        </div>
    </section>
    </>
  );
}
