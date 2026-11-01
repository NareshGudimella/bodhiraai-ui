import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { siteMetadata } from "@/lib/site";
import { getCollections } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** Shown when the CMS has no features. */
const KEY_FEATURES = [
          ["fa-wand-magic-sparkles", "Visual Learning Experiences", "Every concept is taught through engaging visual explanations, illustrations, animations and interactive content — easier to understand and remember."],
          ["fa-robot", "AI Learning Assistant", "Instant academic support — answers, concept explanations and guidance that encourage independent learning, 24/7."],
          ["fa-clipboard-check", "Smart Assessments & Evaluations", "Quizzes, tests, assignments and exams with automated evaluation and real-time performance tracking."],
          ["fa-user-check", "Attendance Management", "Track attendance digitally with real-time monitoring and reports for teachers, admins and parents."],
          ["fa-file-pen", "Assignment & Homework", "Create, distribute, submit, review and evaluate assignments through one streamlined digital workflow."],
          ["fa-users", "Parent Engagement Portal", "Keep parents informed with attendance, performance reports, assignment tracking, announcements and direct messaging."],
          ["fa-chalkboard-user", "Teacher Productivity Tools", "Lesson planning, a digital content library, student tracking, engagement tools and academic reporting in one place."],
          ["fa-chart-line", "Student Performance Analytics", "Actionable insight into progress, strengths, weak areas, attendance patterns and academic growth."],
          ["fa-mobile-screen-button", "Mobile Learning Access", "Learn anytime, anywhere across mobile, tablet and web — built for modern learners."],
      ];

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/features", 'Platform Features · Bodhira.ai');
}

/** Legacy resources/views/features.blade.php. */
export default async function FeaturesPage() {
  await connection();
  const { features, services } = await getCollections();
  return (
    <>
      <SeoSchema path="features" />
      <style dangerouslySetInnerHTML={{ __html: `
/* ──────────────────────────────────────────────────────────────────────────
   Features page — modern, enterprise redesign (self-contained, scoped to .bdhx)
   Brand: maroon #2A0E13 / #3D1620 · gold #C49560 / #E8C896 / #F5E9D3
   ────────────────────────────────────────────────────────────────────────── */
.bdhx{
  --maroon:#2A0E13; --maroon-2:#3D1620; --gold:#C49560; --gold-soft:#E8C896;
  --cream:#F5E9D3; --ink:#1c1115; --muted:#6b5a52; --line:#ece3da; --bg-soft:#faf6f0;
  --radius:20px; --shadow:0 24px 60px -28px rgba(42,14,19,.35);
  font-family:'Instrument Sans',-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  color:var(--ink);
}
.bdhx *{box-sizing:border-box}
.bdhx .bx-wrap{max-width:1200px;margin:0 auto;padding:0 24px}
.bdhx .bx-eyebrow{
  display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;
  letter-spacing:.06em;text-transform:uppercase;padding:7px 14px;border-radius:100px;
}
.bdhx .bx-section-title{font-size:clamp(28px,3.4vw,44px);line-height:1.1;font-weight:800;letter-spacing:-.02em;margin:18px 0 0}
.bdhx .bx-section-sub{font-size:17px;line-height:1.7;color:var(--muted);margin:16px auto 0;max-width:680px}
.bdhx .bx-center{text-align:center}

/* CTA buttons */
.bdhx .bx-btn{
  display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:15.5px;
  padding:15px 28px;border-radius:100px;text-decoration:none;transition:.25s ease;border:1.5px solid transparent;
}
.bdhx .bx-btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-soft));color:var(--maroon);box-shadow:0 14px 30px -10px rgba(196,149,96,.6)}
.bdhx .bx-btn-gold:hover{transform:translateY(-2px);box-shadow:0 20px 40px -12px rgba(196,149,96,.75)}
.bdhx .bx-btn-ghost{background:rgba(245,233,211,.08);color:var(--cream);border-color:rgba(232,200,150,.4)}
.bdhx .bx-btn-ghost:hover{background:rgba(245,233,211,.16);border-color:var(--gold)}
.bdhx .bx-btn-dark{background:var(--maroon);color:#fff}
.bdhx .bx-btn-dark:hover{background:var(--gold);color:var(--maroon);transform:translateY(-2px)}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
.bdhx .bx-hero{position:relative;overflow:hidden;background:radial-gradient(120% 120% at 80% -10%,#4a1c28 0%,var(--maroon-2) 38%,var(--maroon) 100%);color:var(--cream);padding:150px 0 110px}
.bdhx .bx-hero:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(232,200,150,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(232,200,150,.06) 1px,transparent 1px);background-size:46px 46px;mask-image:radial-gradient(80% 60% at 50% 30%,#000 0%,transparent 75%);pointer-events:none}
.bdhx .bx-hero-glow{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(90px);opacity:.5;pointer-events:none}
.bdhx .bx-hero-glow.g1{background:#7a2f40;top:-160px;right:-120px}
.bdhx .bx-hero-glow.g2{background:#5a3017;bottom:-200px;left:-140px;opacity:.4}
.bdhx .bx-hero .bx-wrap{position:relative;z-index:2;text-align:center}
.bdhx .bx-hero .bx-eyebrow{background:rgba(232,200,150,.12);border:1px solid rgba(232,200,150,.32);color:var(--gold-soft)}
.bdhx .bx-hero h1{font-size:clamp(36px,5.4vw,68px);line-height:1.05;font-weight:800;letter-spacing:-.03em;margin:22px auto 0;max-width:14ch;color:var(--cream)}
.bdhx .bx-hero h1 .bx-grad{background:linear-gradient(120deg,var(--gold-soft),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.bdhx .bx-hero p.bx-lead{font-size:clamp(16px,1.5vw,19px);line-height:1.7;color:rgba(245,233,211,.82);margin:22px auto 0;max-width:620px}
.bdhx .bx-hero-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:36px}
.bdhx .bx-trust{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;margin-top:40px;color:rgba(245,233,211,.7);font-size:14px;font-weight:500}
.bdhx .bx-trust span{display:inline-flex;align-items:center;gap:8px}
.bdhx .bx-trust i{color:var(--gold)}

/* ── Stats band ───────────────────────────────────────────────────────────── */
.bdhx .bx-stats{background:var(--maroon);margin-top:-1px}
.bdhx .bx-stats .bx-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(232,200,150,.16)}
.bdhx .bx-stat{background:var(--maroon);padding:34px 22px;text-align:center}
.bdhx .bx-stat .n{font-size:clamp(26px,3vw,38px);font-weight:800;color:var(--gold-soft);letter-spacing:-.02em}
.bdhx .bx-stat .l{font-size:13.5px;color:rgba(245,233,211,.72);margin-top:6px;font-weight:500}

/* ── Generic section ──────────────────────────────────────────────────────── */
.bdhx .bx-sec{padding:100px 0}
.bdhx .bx-sec.alt{background:var(--bg-soft)}
.bdhx .bx-sec .bx-eyebrow{background:rgba(196,149,96,.12);color:#9a6a34;border:1px solid rgba(196,149,96,.25)}

/* Feature / service cards */
.bdhx .bx-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:54px}
.bdhx .bx-cards.cols-4{grid-template-columns:repeat(4,1fr)}
.bdhx .bx-card{position:relative;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:30px 28px;transition:.3s cubic-bezier(.2,.7,.3,1);overflow:hidden}
.bdhx .bx-card:before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-soft));transform:scaleX(0);transform-origin:left;transition:.35s ease}
.bdhx .bx-card:hover{transform:translateY(-6px);box-shadow:var(--shadow);border-color:rgba(196,149,96,.4)}
.bdhx .bx-card:hover:before{transform:scaleX(1)}
.bdhx .bx-card .bx-ico{width:58px;height:58px;border-radius:16px;display:grid;place-items:center;font-size:24px;color:var(--maroon);background:linear-gradient(135deg,rgba(196,149,96,.18),rgba(232,200,150,.28));border:1px solid rgba(196,149,96,.25);transition:.3s ease}
.bdhx .bx-card:hover .bx-ico{background:linear-gradient(135deg,var(--gold),var(--gold-soft));color:var(--maroon);transform:scale(1.05) rotate(-3deg)}
.bdhx .bx-card h3{font-size:19px;font-weight:700;margin:20px 0 0;letter-spacing:-.01em}
.bdhx .bx-card p{font-size:14.5px;line-height:1.7;color:var(--muted);margin:10px 0 0}

/* ── How it works ─────────────────────────────────────────────────────────── */
.bdhx .bx-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:54px;position:relative}
.bdhx .bx-step{position:relative;text-align:center;padding:0 6px}
.bdhx .bx-step .num{width:64px;height:64px;margin:0 auto;border-radius:50%;display:grid;place-items:center;font-size:22px;font-weight:800;color:var(--maroon);background:linear-gradient(135deg,var(--gold),var(--gold-soft));box-shadow:0 12px 26px -10px rgba(196,149,96,.6);position:relative;z-index:2}
.bdhx .bx-step:not(:last-child):after{content:"";position:absolute;top:32px;left:calc(50% + 42px);width:calc(100% - 84px);height:2px;background:repeating-linear-gradient(90deg,rgba(196,149,96,.55) 0 8px,transparent 8px 16px);z-index:1}
.bdhx .bx-step h3{font-size:17.5px;font-weight:700;margin:20px 0 0}
.bdhx .bx-step p{font-size:14px;line-height:1.65;color:var(--muted);margin:8px 0 0}

/* ── Enterprise band ──────────────────────────────────────────────────────── */
.bdhx .bx-ent{background:linear-gradient(160deg,var(--maroon-2),var(--maroon));color:var(--cream);padding:100px 0}
.bdhx .bx-ent .bx-eyebrow{background:rgba(232,200,150,.12);border:1px solid rgba(232,200,150,.32);color:var(--gold-soft)}
.bdhx .bx-ent .bx-section-title{color:var(--cream)}
.bdhx .bx-ent .bx-section-sub{color:rgba(245,233,211,.78)}
.bdhx .bx-ent-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:54px}
.bdhx .bx-ent-card{background:rgba(245,233,211,.05);border:1px solid rgba(232,200,150,.18);border-radius:var(--radius);padding:30px 28px;transition:.3s ease}
.bdhx .bx-ent-card:hover{background:rgba(245,233,211,.09);border-color:rgba(232,200,150,.4);transform:translateY(-4px)}
.bdhx .bx-ent-card .bx-ico{width:54px;height:54px;border-radius:14px;display:grid;place-items:center;font-size:22px;color:var(--gold-soft);background:rgba(232,200,150,.12);border:1px solid rgba(232,200,150,.28)}
.bdhx .bx-ent-card h3{font-size:18.5px;font-weight:700;color:var(--cream);margin:18px 0 0}
.bdhx .bx-ent-card p{font-size:14.5px;line-height:1.7;color:rgba(245,233,211,.72);margin:10px 0 0}

/* ── Final CTA ────────────────────────────────────────────────────────────── */
.bdhx .bx-cta{padding:90px 0}
.bdhx .bx-cta-box{position:relative;overflow:hidden;border-radius:30px;background:radial-gradient(120% 140% at 85% 0,#4a1c28,var(--maroon) 60%);padding:64px 40px;text-align:center;color:var(--cream);box-shadow:var(--shadow)}
.bdhx .bx-cta-box:before{content:"";position:absolute;width:360px;height:360px;border-radius:50%;background:rgba(196,149,96,.25);filter:blur(80px);top:-140px;right:-80px}
.bdhx .bx-cta-box h2{position:relative;font-size:clamp(26px,3.2vw,40px);font-weight:800;letter-spacing:-.02em;margin:0;color:var(--cream)}
.bdhx .bx-cta-box p{position:relative;font-size:17px;color:rgba(245,233,211,.82);margin:16px auto 0;max-width:540px;line-height:1.6}
.bdhx .bx-cta-box .bx-hero-cta{margin-top:32px}

/* ── Responsive ───────────────────────────────────────────────────────────── */
@media(max-width:992px){
  .bdhx .bx-cards,.bdhx .bx-cards.cols-4,.bdhx .bx-ent-grid{grid-template-columns:repeat(2,1fr)}
  .bdhx .bx-stats .bx-grid{grid-template-columns:repeat(2,1fr)}
  .bdhx .bx-steps{grid-template-columns:repeat(2,1fr);gap:36px 24px}
  .bdhx .bx-step:not(:last-child):after{display:none}
}
@media(max-width:600px){
  .bdhx .bx-hero{padding:120px 0 80px}
  .bdhx .bx-sec,.bdhx .bx-ent{padding:70px 0}
  .bdhx .bx-cards,.bdhx .bx-cards.cols-4,.bdhx .bx-ent-grid,.bdhx .bx-steps{grid-template-columns:1fr}
  .bdhx .bx-stats .bx-grid{grid-template-columns:1fr 1fr}
  .bdhx .bx-btn{width:100%;justify-content:center}
}
` }} />
      <div className="bdhx">

  
  <section className="bx-hero">
    <span className="bx-hero-glow g1"></span>
    <span className="bx-hero-glow g2"></span>
    <div className="bx-wrap">
      <span className="bx-eyebrow"><i className="fa-solid fa-bolt"></i> The Bodhira.ai Platform</span>
      <h1>Everything a school needs to run <span className="bx-grad">digital learning</span></h1>
      <p className="bx-lead">From the first student added to the term-end parent report — video lessons, quizzes, an AI doubt-solver, attendance and analytics, all in one connected platform.</p>
      <div className="bx-hero-cta">
        <a href="/register/student" className="bx-btn bx-btn-gold"><i className="fa-solid fa-rocket"></i> Get Started Free</a>
        <a href="/contact" className="bx-btn bx-btn-ghost"><i className="fa-solid fa-headset"></i> Talk to Sales</a>
      </div>
      <div className="bx-trust">
        <span><i className="fa-solid fa-circle-check"></i> One platform, five roles</span>
        <span><i className="fa-solid fa-circle-check"></i> AI tutor, 24/7</span>
        <span><i className="fa-solid fa-circle-check"></i> Web, tablet &amp; mobile</span>
      </div>
    </div>
  </section>

  
  <section className="bx-stats">
    <div className="bx-wrap" style={{ paddingLeft: "0", paddingRight: "0" }}>
      <div className="bx-grid">
        <div className="bx-stat"><div className="n">5-in-1</div><div className="l">Student · Teacher · Parent · Admin · School</div></div>
        <div className="bx-stat"><div className="n">24/7</div><div className="l">AI doubt-solving assistant</div></div>
        <div className="bx-stat"><div className="n">100%</div><div className="l">Digital academic workflow</div></div>
        <div className="bx-stat"><div className="n">Real-time</div><div className="l">Progress &amp; performance insight</div></div>
      </div>
    </div>
  </section>

  
  <section className="bx-sec">
    <div className="bx-wrap">
      <div className="bx-center">
        <span className="bx-eyebrow"><i className="fa-solid fa-bolt"></i> What Bodhira.ai Does</span>
        <h2 className="bx-section-title">Everything to run digital learning — in one place</h2>
        <p className="bx-section-sub">A complete academic operating system that connects students, teachers, parents and administrators around a single source of truth.</p>
      </div>
      <div className="bx-cards">
        {features.length ? features.map((kf, idx) => (
          <div key={idx} className="bx-card">
            <div className="bx-ico"><i className={`fa-solid ${kf.icon || "fa-star"}`}></i></div>
            <h3>{kf.title}</h3>
            <p>{kf.description}</p>
          </div>
        )) : (<>
          {KEY_FEATURES.map((kf, idx) => (
            <div key={idx} className="bx-card">
              <div className="bx-ico"><i className={`fa-solid ${kf[0]}`}></i></div>
              <h3>{kf[1]}</h3>
              <p>{kf[2]}</p>
            </div>
          ))}
        </>)}
      </div>
    </div>
  </section>

  
  <section className="bx-sec alt">
    <div className="bx-wrap">
      <div className="bx-center">
        <span className="bx-eyebrow"><i className="fa-solid fa-route"></i> How It Comes Together</span>
        <h2 className="bx-section-title">From school sign-up to parent report — in four steps</h2>
      </div>
      <div className="bx-steps">
        <div className="bx-step"><div className="num">1</div><h3>School Signs Up</h3><p>The school joins Bodhira.ai. We set up classes, sections and a school admin login.</p></div>
        <div className="bx-step"><div className="num">2</div><h3>Students &amp; Teachers Added</h3><p>Admins add students and map teachers to subjects and sections in minutes.</p></div>
        <div className="bx-step"><div className="num">3</div><h3>Learning Happens</h3><p>Students watch lessons, read notes, ask the AI, take quizzes and join live classes.</p></div>
        <div className="bx-step"><div className="num">4</div><h3>Everyone Sees Progress</h3><p>Teachers spot who needs help, parents see scores, schools get big-picture reports.</p></div>
      </div>
    </div>
  </section>

  
  {services.length > 0 && (<>
  <section className="bx-sec">
    <div className="bx-wrap">
      <div className="bx-center">
        <span className="bx-eyebrow"><i className="fa-solid fa-layer-group"></i> What We Offer</span>
        <h2 className="bx-section-title">Everything your school gets with Bodhira.ai</h2>
      </div>
      <div className="bx-cards cols-4">
        {services.map((sv, idx) => (
          <div key={idx} className="bx-card">
            <div className="bx-ico"><i className={`fa-solid ${sv.icon || "fa-star"}`}></i></div>
            <h3>{sv.title}</h3>
            <p>{sv.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  </>)}

  
  <section className="bx-ent">
    <div className="bx-wrap">
      <div className="bx-center">
        <span className="bx-eyebrow"><i className="fa-solid fa-shield-halved"></i> Built for Scale</span>
        <h2 className="bx-section-title">Enterprise-ready for schools of every size</h2>
        <p className="bx-section-sub">Reliable, secure and built to grow — from a single campus to a multi-school group.</p>
      </div>
      <div className="bx-ent-grid">
        <div className="bx-ent-card">
          <div className="bx-ico"><i className="fa-solid fa-user-shield"></i></div>
          <h3>Role-Based Access</h3>
          <p>Granular permissions for students, teachers, parents, school admins and platform admins — everyone sees exactly what they should.</p>
        </div>
        <div className="bx-ent-card">
          <div className="bx-ico"><i className="fa-solid fa-lock"></i></div>
          <h3>Secure &amp; Private</h3>
          <p>Token-based authentication, encrypted sessions and school-scoped data isolation keep student information protected.</p>
        </div>
        <div className="bx-ent-card">
          <div className="bx-ico"><i className="fa-solid fa-server"></i></div>
          <h3>Scales With You</h3>
          <p>A multi-tenant architecture that supports thousands of students and multiple schools without compromising performance.</p>
        </div>
        <div className="bx-ent-card">
          <div className="bx-ico"><i className="fa-solid fa-gauge-high"></i></div>
          <h3>Real-Time Insights</h3>
          <p>Live dashboards surface attendance, performance and engagement the moment they change — no waiting for end-of-term.</p>
        </div>
        <div className="bx-ent-card">
          <div className="bx-ico"><i className="fa-solid fa-mobile-screen"></i></div>
          <h3>Native Mobile Apps</h3>
          <p>Dedicated Android &amp; iOS experiences for every role, alongside a full-featured web platform.</p>
        </div>
        <div className="bx-ent-card">
          <div className="bx-ico"><i className="fa-solid fa-headset"></i></div>
          <h3>Onboarding &amp; Support</h3>
          <p>Guided school setup and responsive support help your team go live quickly and stay productive.</p>
        </div>
      </div>
    </div>
  </section>

  
  <section className="bx-cta">
    <div className="bx-wrap">
      <div className="bx-cta-box">
        <h2>Ready to modernize your school?</h2>
        <p>Join Bodhira.ai and give your students, teachers and parents one connected place to learn, teach and track progress.</p>
        <div className="bx-hero-cta">
          <a href="/register/student" className="bx-btn bx-btn-gold"><i className="fa-solid fa-rocket"></i> Get Started Free</a>
          <a href="/pricing" className="bx-btn bx-btn-ghost"><i className="fa-solid fa-tag"></i> View Pricing</a>
        </div>
      </div>
    </div>
  </section>

</div>
    </>
  );
}
