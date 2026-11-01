import type { Metadata } from "next";
import { connection } from "next/server";
import { SeoSchema } from "@/components/site/seo-schema";
import { siteMetadata } from "@/lib/site";
import { getPricing } from "@/lib/site-api";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

/** Bootstrap columns by how many plans a group has (legacy $cols). */
const cols = (n: number) => (n === 2 ? "col-lg-5 col-md-6" : n === 1 ? "col-lg-5 col-md-8" : "col-lg-4 col-md-6");

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/pricing", 'Pricing · Bodhira.ai');
}

/** Legacy resources/views/pricing.blade.php. */
export default async function PricingPage() {
  await connection();
  const { individual, school } = await getPricing();
  return (
    <>
      <SeoSchema path="pricing" />
      <style dangerouslySetInnerHTML={{ __html: `
    .bodhira-pricing-head {
        background: #2A0E13;
        padding: 40px 0 50px;
        text-align: center;
        color: #fff;
        position: relative;
        overflow: hidden;
    }
    .bodhira-pricing-head::before,
    .bodhira-pricing-head::after {
        content: "";
        position: absolute;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        filter: blur(80px);
        opacity: .35;
    }
    .bodhira-pricing-head::before { background: #c49560; top: -80px; left: -80px; }
    .bodhira-pricing-head::after  { background: #8B5CF6; bottom: -80px; right: -80px; }
    .bodhira-pricing-head .eyebrow {
        display: inline-flex; align-items: center; gap: 8px;
        background: rgba(196,149,96,.18); color: #f5d6a5;
        padding: 8px 18px; border-radius: 999px;
        font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    }
    .bodhira-pricing-head h1 {
        font-family: 'Poppins', sans-serif;
        font-size: 52px; font-weight: 800;
        letter-spacing: -.02em; line-height: 1.1;
        margin: 22px 0 12px;
    }
    .bodhira-pricing-head .lead {
        max-width: 620px; margin: 0 auto;
        font-size: 16px; opacity: .8; line-height: 1.6;
    }
    .bodhira-cycle {
        display: inline-flex;
        background: rgba(255,255,255,.07);
        border: 1px solid rgba(255,255,255,.12);
        padding: 6px;
        border-radius: 999px;
        margin-top: 28px;
    }
    .bodhira-cycle button {
        appearance: none; border: 0; background: transparent; cursor: pointer;
        padding: 10px 26px; border-radius: 999px;
        font-size: 14px; font-weight: 700; color: #fff;
        transition: all .2s;
    }
    .bodhira-cycle button.is-active {
        background: #c49560; color: #1A0A0C;
        box-shadow: 0 8px 20px rgba(196,149,96,.35);
    }
    .bodhira-cycle .save-badge {
        background: #22c55e; color: #fff;
        font-size: 10px; font-weight: 800; letter-spacing: .5px;
        padding: 2px 8px; border-radius: 999px; margin-left: 6px;
    }

    .bodhira-plans {
        background: #2A0E13;
        padding: 0 0 100px;
        position: relative;
    }
    .bodhira-plans .group-title {
        font-family: 'Poppins', sans-serif;
        font-size: 28px; font-weight: 800;
        color: #fff; text-align: center;
        margin: 60px 0 28px;
    }
    .bodhira-card {
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        height: 100%;
        display: flex; flex-direction: column;
        box-shadow: 0 20px 50px rgba(0,0,0,.3);
        transition: transform .25s, box-shadow .25s;
        border: 1px solid rgba(255,255,255,.05);
    }
    .bodhira-card:hover { transform: translateY(-6px); }
    .bodhira-card.is-featured {
        background: linear-gradient(160deg, #c49560 0%, #b07e4b 100%);
        color: #fff;
        border-color: #c49560;
        box-shadow: 0 30px 70px rgba(196,149,96,.45);
        transform: translateY(-8px);
        position: relative;
    }
    .bodhira-card.is-featured::before {
        content: "MOST POPULAR";
        position: absolute; top: 16px; right: 16px;
        background: #1A0A0C; color: #fff;
        font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
        padding: 5px 11px; border-radius: 999px;
    }
    .bodhira-card .card-top { padding: 36px 32px 28px; border-bottom: 1px solid rgba(0,0,0,.08); }
    .bodhira-card.is-featured .card-top { border-color: rgba(255,255,255,.18); }
    .bodhira-card .card-name {
        font-family: 'Poppins', sans-serif;
        font-size: 22px; font-weight: 800;
        margin: 0 0 6px;
    }
    .bodhira-card .card-tagline {
        font-size: 14px; line-height: 1.5;
        color: #6b7280; margin-bottom: 22px;
        min-height: 42px;
    }
    .bodhira-card.is-featured .card-tagline { color: rgba(255,255,255,.85); }
    .bodhira-card .card-price {
        font-family: 'Poppins', sans-serif;
        font-size: 44px; font-weight: 800;
        line-height: 1;
        color: #1A0A0C;
        margin-bottom: 4px;
    }
    .bodhira-card.is-featured .card-price { color: #fff; }
    .bodhira-card .card-price .per {
        font-size: 15px; font-weight: 500;
        color: #6b7280;
    }
    .bodhira-card.is-featured .card-price .per { color: rgba(255,255,255,.85); }
    .bodhira-card .trial-pill {
        display: inline-block;
        background: rgba(34,197,94,.12); color: #16a34a;
        padding: 5px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 700;
        margin-top: 14px;
    }
    .bodhira-card.is-featured .trial-pill {
        background: rgba(255,255,255,.18); color: #fff;
    }
    .bodhira-card .card-body { padding: 28px 32px 32px; display: flex; flex-direction: column; flex: 1; }
    .bodhira-card .features-title {
        font-size: 12px; font-weight: 800;
        text-transform: uppercase; letter-spacing: 1px;
        color: #6b7280; margin-bottom: 14px;
    }
    .bodhira-card.is-featured .features-title { color: rgba(255,255,255,.7); }
    .bodhira-card .features { list-style: none; padding: 0; margin: 0 0 28px; flex: 1; }
    .bodhira-card .features li {
        display: flex; align-items: flex-start; gap: 10px;
        font-size: 14px; line-height: 1.5;
        color: #374151; margin-bottom: 10px;
    }
    .bodhira-card.is-featured .features li { color: rgba(255,255,255,.95); }
    .bodhira-card .features li::before {
        content: "✓";
        flex-shrink: 0; width: 20px; height: 20px;
        border-radius: 50%;
        background: #c49560; color: #fff;
        font-size: 11px; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
    }
    .bodhira-card.is-featured .features li::before {
        background: #fff; color: #c49560;
    }
    .bodhira-card .cta {
        display: block; text-align: center;
        background: #1A0A0C; color: #fff;
        padding: 14px 24px; border-radius: 12px;
        font-weight: 700; font-size: 14px;
        text-decoration: none;
        transition: all .2s;
    }
    .bodhira-card .cta:hover { background: #c49560; color: #fff; }
    .bodhira-card.is-featured .cta {
        background: #fff; color: #1A0A0C;
    }
    .bodhira-card.is-featured .cta:hover {
        background: #1A0A0C; color: #fff;
    }

    .bodhira-footnote {
        text-align: center; margin-top: 40px;
        color: rgba(255,255,255,.65); font-size: 14px;
    }
    .bodhira-footnote a { color: #c49560; font-weight: 700; }

    @media (max-width: 768px) {
        .bodhira-pricing-head { padding: 60px 0 40px; }
        .bodhira-pricing-head h1 { font-size: 36px; }
        .bodhira-card.is-featured { transform: none; }
    }

    /* ===================== Enterprise pricing redesign (light, modern) ===================== */
    /* Light intro under the maroon banner (matches About/Features) */
    .bodhira-pricing-head { background:#FBF6EF !important; color:#2A0E13 !important; padding:36px 0 30px !important; }
    .bodhira-pricing-head .lead { color:#7a6a5a !important; opacity:1 !important; }
    .bodhira-cycle { background:#fff !important; border:1px solid #E9DDCC !important; box-shadow:0 6px 18px -12px rgba(42,14,19,.25); }
    .bodhira-cycle button { color:#7a6a5a !important; }
    .bodhira-cycle button.is-active { background:linear-gradient(135deg,#5C1A26,#C49560) !important; color:#fff !important; box-shadow:0 8px 18px -8px rgba(92,26,38,.5); }
    .bodhira-cycle .save-badge { background:#0E9F6E !important; }

    /* Light plans area */
    .bodhira-plans { background:#FBF6EF !important; padding:18px 0 88px !important; }
    .bodhira-plans .group-title { color:#2A0E13 !important; font-family:'Poppins',sans-serif; font-size:24px !important; font-weight:800 !important; margin:46px 0 28px !important; }
    .bodhira-plans .group-title::after { content:""; display:block; width:54px; height:3px; border-radius:3px; margin:12px auto 0; background:linear-gradient(90deg,#C49560,#5C1A26); }

    /* Cards */
    .bodhira-card { background:#fff !important; border:1px solid #ECE3D6 !important; border-radius:22px !important;
        box-shadow:0 1px 2px rgba(16,24,40,.04), 0 18px 44px -30px rgba(42,14,19,.4) !important;
        transition:transform .28s ease, box-shadow .28s ease, border-color .28s ease !important; }
    .bodhira-card:hover { transform:translateY(-6px) !important; border-color:#E2C79C !important; box-shadow:0 32px 64px -32px rgba(42,14,19,.5) !important; }
    /* Featured = deep maroon card with gold accents */
    .bodhira-card.is-featured { background:linear-gradient(165deg,#3a1620 0%,#2A0E13 100%) !important; color:#fff !important;
        border-color:#C49560 !important; transform:translateY(-12px) !important; box-shadow:0 44px 90px -40px rgba(42,14,19,.75) !important; }
    @media (max-width:991px){ .bodhira-card.is-featured{ transform:none !important; } }
    .bodhira-card.is-featured::before { background:linear-gradient(135deg,#E2B873,#C49560) !important; color:#2A0E13 !important; letter-spacing:1.2px; }

    .bodhira-card .card-top { padding:34px 30px 22px !important; border-bottom:0 !important; }
    .bodhira-card .card-name { color:#2A0E13 !important; font-size:21px !important; }
    .bodhira-card.is-featured .card-name { color:#fff !important; }
    .bodhira-card .card-tagline { color:#8a7765 !important; }
    .bodhira-card.is-featured .card-tagline { color:rgba(255,255,255,.82) !important; }
    .bodhira-card .card-price { color:#2A0E13 !important; font-size:46px !important; font-weight:800 !important; }
    .bodhira-card.is-featured .card-price { color:#fff !important; }
    .bodhira-card .card-price .per, .bodhira-card .card-price .per-label { color:#9b8674 !important; font-size:15px !important; font-weight:600 !important; }
    .bodhira-card.is-featured .card-price .per, .bodhira-card.is-featured .card-price .per-label { color:rgba(255,255,255,.7) !important; }
    .bodhira-card .trial-pill { display:inline-block; margin-top:10px; background:rgba(196,149,96,.16) !important; color:#A87840 !important; border-radius:999px; padding:5px 12px; font-size:12px; font-weight:700; }
    .bodhira-card.is-featured .trial-pill { background:rgba(255,255,255,.16) !important; color:#F6EEDD !important; }

    .bodhira-card .card-body { padding:6px 30px 32px !important; }
    .bodhira-card .features-title { font-size:11px !important; text-transform:uppercase; letter-spacing:.1em; color:#9b8674 !important; font-weight:800 !important; margin-bottom:14px !important; }
    .bodhira-card.is-featured .features-title { color:rgba(255,255,255,.7) !important; }
    .bodhira-card .features { list-style:none !important; padding:0 !important; margin:0 0 26px !important; }
    .bodhira-card .features li { position:relative; padding:8px 0 8px 30px !important; font-size:14.5px !important; color:#4a3a2e !important; border:0 !important; }
    .bodhira-card.is-featured .features li { color:rgba(255,255,255,.92) !important; }
    .bodhira-card .features li::before {
        content:"\\f00c"; font-family:"Font Awesome 6 Free"; font-weight:900; font-size:10px;
        position:absolute; left:0; top:7px; width:19px; height:19px; border-radius:50%; display:grid; place-items:center;
        color:#fff; background:linear-gradient(135deg,#C49560,#45121c);
    }
    .bodhira-card.is-featured .features li::before { background:linear-gradient(135deg,#E2B873,#C49560); color:#2A0E13; }
    .bodhira-card .cta.plan-cta {
        display:block; text-align:center; border-radius:14px !important; padding:14px 20px !important; font-weight:700 !important;
        background:linear-gradient(135deg,#5C1A26,#C49560) !important; color:#fff !important; border:0 !important; transition:filter .2s ease, transform .2s ease;
    }
    .bodhira-card .cta.plan-cta:hover { filter:brightness(1.08); transform:translateY(-2px); }
    .bodhira-card.is-featured .cta.plan-cta { background:#fff !important; color:#2A0E13 !important; }
` }} />


<section className="page-header">
    <div className="bg-item">
        <div className="bg-img"></div>
        <div className="overlay"></div>
    </div>
    <div className="container">
        <div className="page-header-content">
            <h1 className="title">Plans &amp; Pricing</h1>
            <h4 className="sub-title"><a className="home" href="/">Home </a><span className="icon">/</span><a className="inner-page" href="/pricing"> Pricing</a></h4>
        </div>
    </div>
</section>

<section className="bodhira-pricing-head">
    <div className="container">
        <p className="lead">Pick a plan and start in 30 seconds. Cancel anytime. Annual billing saves you ~2 months.</p>

        <div className="bodhira-cycle" role="tablist">
            <button type="button" className="cycle-btn is-active" data-cycle="monthly">Monthly</button>
            <button type="button" className="cycle-btn" data-cycle="yearly">
                Yearly <span className="save-badge">SAVE 16%</span>
            </button>
        </div>
    </div>
</section>

<section className="bodhira-plans">
    <div className="container">

        {individual.length > 0 && (<>
            <h2 className="group-title">For Students</h2>
            <div className="row gy-4 justify-content-center">
                {individual.map((plan, idx) => (
                    <div key={idx} className={cols(individual.length)}>
                        <div className={`bodhira-card ${plan.is_featured ? "is-featured" : ""}`}>
                            <div className="card-top">
                                <h3 className="card-name">{plan.name}</h3>
                                <p className="card-tagline">{plan.tagline ?? "Full access to Bodhira.ai's courses, quizzes and AI doubt solver."}</p>
                                <div className="card-price">
                                    ₹<span className="price-amt" data-monthly={plan.monthly_price} data-yearly={plan.yearly_price}>{plan.monthly_price}</span>
                                    <span className="per">/<span className="per-label">month</span></span>
                                </div>
                                {plan.trial_days > 0 && (<>
                                    <span className="trial-pill">★ {plan.trial_days}-day free trial — no card needed</span>
                                </>)}
                            </div>
                            <div className="card-body">
                                <div className="features-title">What's included</div>
                                <ul className="features">
                                    {plan.features?.length ? plan.features.map((feat, idx) => (
                                        <li key={idx}>{feat}</li>
                                    )) : (<>
                                        <li>Unlimited access to all courses</li>
                                        <li>Live classes</li>
                                        <li>AI doubt solver</li>
                                        <li>Practice quizzes</li>
                                    </>)}
                                </ul>
                                <a href={`/register/student?plan=${encodeURIComponent(plan.key)}&cycle=monthly`} className="cta plan-cta" data-key={plan.key}>Get Started →</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>)}

        {school.length > 0 && (<>
            <h2 className="group-title">For Schools</h2>
            <div className="row gy-4 justify-content-center">
                {school.map((plan, idx) => (
                    <div key={idx} className={cols(school.length)}>
                        <div className={`bodhira-card ${plan.is_featured ? "is-featured" : ""}`}>
                            <div className="card-top">
                                <h3 className="card-name">{plan.name}</h3>
                                <p className="card-tagline">{plan.tagline ?? "For schools that want every student on Bodhira.ai with admin tooling."}</p>
                                <div className="card-price">
                                    ₹<span className="price-amt" data-monthly={plan.monthly_price} data-yearly={plan.yearly_price}>{plan.monthly_price}</span>
                                    <span className="per">/<span className="per-label">month</span></span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="features-title">What's included</div>
                                <ul className="features">
                                    {plan.features?.length ? plan.features.map((feat, idx) => (
                                        <li key={idx}>{feat}</li>
                                    )) : (<>
                                        <li>Unlimited teacher + student seats</li>
                                        <li>Class & syllabus management</li>
                                        <li>Live classes & assignments</li>
                                        <li>Analytics dashboard</li>
                                    </>)}
                                </ul>
                                <a href="/contact" className="cta">Talk to Sales →</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>)}

    </div>
</section>

<script dangerouslySetInnerHTML={{ __html: `
    document.querySelectorAll('.cycle-btn').forEach(function (b) {
        b.addEventListener('click', function () { setCycle(b.dataset.cycle); });
    });
    function setCycle(cycle) {
        document.querySelectorAll('.cycle-btn').forEach(function (b) {
            b.classList.toggle('is-active', b.dataset.cycle === cycle);
        });
        document.querySelectorAll('.price-amt').forEach(function (el) {
            el.textContent = el.dataset[cycle];
        });
        document.querySelectorAll('.per-label').forEach(function (el) {
            el.textContent = cycle === 'yearly' ? 'year' : 'month';
        });
        document.querySelectorAll('.plan-cta').forEach(function (a) {
            var url = new URL(a.href, location.origin);
            url.searchParams.set('cycle', cycle);
            a.href = url.toString();
        });
    }
` }} />
    </>
  );
}
