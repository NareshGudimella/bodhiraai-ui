"use client";

import { useState } from "react";
import type { PricePlan } from "@/lib/site-api";
import { Icon } from "./icons";
import { CheckList } from "./page-kit";
import { maxYearlySavingPct, yearlySavingPct } from "@/lib/plan-savings";

type Cycle = "monthly" | "yearly";

const INR = new Intl.NumberFormat("en-IN");

const STUDENT_TAGLINE = "Full access to Bodhira.ai's courses, quizzes and AI doubt solver.";
const STUDENT_FEATURES = ["Unlimited access to all courses", "Live classes", "AI doubt solver", "Practice quizzes"];
const SCHOOL_TAGLINE = "For schools that want every student on Bodhira.ai with admin tooling.";
const SCHOOL_FEATURES = ["Unlimited teacher + student seats", "Class & syllabus management", "Live classes & assignments", "Analytics dashboard"];

function PlanCard({ plan, cycle, audience }: { plan: PricePlan; cycle: Cycle; audience: "student" | "school" }) {
  const student = audience === "student";
  const features = plan.features?.length ? plan.features : student ? STUDENT_FEATURES : SCHOOL_FEATURES;
  const amount = cycle === "yearly" ? plan.yearly_price : plan.monthly_price;
  const saving = cycle === "yearly" ? yearlySavingPct(plan) : 0;
  return (
    <article className={`bp-plan${plan.is_featured ? " bp-plan--featured bp-on-dark" : ""}`}>
      {plan.is_featured && <span className="bp-plan__ribbon bp-badge bp-badge--gold"><Icon name="star" size={12} className="bh-icon--fill" /> Most popular</span>}
      <h3 className="bp-plan__name">{plan.name}</h3>
      <p className="bp-plan__tagline">{plan.tagline ?? (student ? STUDENT_TAGLINE : SCHOOL_TAGLINE)}</p>
      <p className="bp-plan__price" aria-live="polite">
        <span className="bp-plan__cur">₹</span>
        <span className="bp-plan__amt">{INR.format(amount)}</span>
        <span className="bp-plan__per">/{cycle === "yearly" ? "year" : "month"}</span>
      </p>
      <div className="bp-plan__meta">
        {saving > 0 && <span className="bp-badge bp-badge--success">Save {saving}% vs monthly</span>}
        {student && plan.trial_days > 0 && (
          <span className="bp-badge bp-badge--success"><Icon name="sparkles" size={13} /> {plan.trial_days}-day free trial, no card needed</span>
        )}
      </div>
      <hr className="bp-plan__rule" />
      <p className="bp-plan__label">What&rsquo;s included</p>
      <CheckList items={features} />
      {student ? (
        <a
          href={`/register/student?plan=${encodeURIComponent(plan.key)}&cycle=${cycle}`}
          className={`bh-btn bh-btn--lg ${plan.is_featured ? "bh-btn--gold" : "bh-btn--maroon"}`}
          data-key={plan.key}
        >
          Get Started <Icon name="arrowRight" size={18} />
        </a>
      ) : (
        <a href="/contact" className={`bh-btn bh-btn--lg ${plan.is_featured ? "bh-btn--gold" : "bh-btn--ghost"}`}>
          Talk to Sales <Icon name="arrowRight" size={18} />
        </a>
      )}
    </article>
  );
}

function Group({ id, title, sub, plans, cycle, audience }: { id: string; title: string; sub: string; plans: PricePlan[]; cycle: Cycle; audience: "student" | "school" }) {
  if (!plans.length) return null;
  const n = Math.min(plans.length, 3);
  return (
    <section className="bp-plan-group" aria-labelledby={id}>
      <div className="bp-plan-group__head">
        <p className="bp-eyebrow">{sub}</p>
        <h2 id={id} className="bp-h3">{title}</h2>
      </div>
      <div className={`bp-plans${n < 3 ? ` bp-plans--${n}` : ""}`}>
        {plans.map((plan, i) => <PlanCard key={plan.id ?? i} plan={plan} cycle={cycle} audience={audience} />)}
      </div>
    </section>
  );
}

/**
 * Pricing page plans with the monthly / yearly switch (legacy pricing.blade.php
 * inline script: swaps each price, the "/month" label and the sign-up links'
 * `cycle` parameter). Redesigned in 2026, not in legacy: React state instead of
 * DOM rewriting, aria-pressed toggle, Indian digit grouping.
 */
export function PricingPlans({ individual, school }: { individual: PricePlan[]; school: PricePlan[] }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  // Legacy hard-coded "SAVE 16%"; the real saving differs by plan (not in legacy).
  const bestSaving = maxYearlySavingPct([...individual, ...school]);
  return (
    <>
      <div className="bp-plan-toggle">
        <div className="bp-toggle" role="group" aria-label="Billing cycle">
          <button type="button" aria-pressed={cycle === "monthly"} onClick={() => setCycle("monthly")}>Monthly</button>
          <button type="button" aria-pressed={cycle === "yearly"} onClick={() => setCycle("yearly")}>
            Yearly {bestSaving > 0 && <span className="bp-badge bp-badge--success">SAVE UP TO {bestSaving}%</span>}
          </button>
        </div>
      </div>
      <Group id="plans-students" title="For Students" sub="Individual plans" plans={individual} cycle={cycle} audience="student" />
      <Group id="plans-schools" title="For Schools" sub="School plans" plans={school} cycle={cycle} audience="school" />
    </>
  );
}
