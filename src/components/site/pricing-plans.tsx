"use client";

import { useState } from "react";
import type { PricePlan } from "@/lib/site-api";
import { Icon } from "./icons";
import { BTN_FOCUS, BTN_FOCUS_DARK, FOCUS_BUTTON, badge } from "./kit-content-ui";
import { CheckList } from "./page-kit";
import { btn, cx, eyebrowClass } from "./ui";
import { maxYearlySavingPct, yearlySavingPct } from "@/lib/plan-savings";

type Cycle = "monthly" | "yearly";

const INR = new Intl.NumberFormat("en-IN");

const STUDENT_TAGLINE = "Full access to Bodhira.ai's courses, quizzes and AI doubt solver.";
const STUDENT_FEATURES = ["Unlimited access to all courses", "Live classes", "AI doubt solver", "Practice quizzes"];
const SCHOOL_TAGLINE = "For schools that want every student on Bodhira.ai with admin tooling.";
const SCHOOL_FEATURES = ["Unlimited teacher + student seats", "Class & syllabus management", "Live classes & assignments", "Analytics dashboard"];

/** Muted text on a plan card: maroon-tinted cream on the featured (dark) card. */
const muted = (dark: boolean) => (dark ? "text-[rgba(255,244,230,.72)]" : "text-muted");

function PlanCard({ plan, cycle, audience }: { plan: PricePlan; cycle: Cycle; audience: "student" | "school" }) {
  const student = audience === "student";
  const dark = !!plan.is_featured;
  const features = plan.features?.length ? plan.features : student ? STUDENT_FEATURES : SCHOOL_FEATURES;
  const amount = cycle === "yearly" ? plan.yearly_price : plan.monthly_price;
  const saving = cycle === "yearly" ? yearlySavingPct(plan) : 0;
  return (
    <article
      className={cx(
        "relative flex h-full flex-col rounded-lg border px-8 pt-9 pb-8 max-xl:px-6 max-xl:pt-8 max-xl:pb-7",
        "[transition:transform_.3s_var(--ease-bh),box-shadow_.3s_var(--ease-bh),border-color_.3s]",
        // Hover as the legacy cascade drew it: the theme's `article:hover` shadow, no lift (see the doc comment below).
        "hover:border-[rgba(196,149,96,.45)] hover:shadow-[0_26px_50px_-26px_rgba(42,14,19,.45)]",
        dark
          ? "border-[rgba(226,184,115,.55)] bg-[radial-gradient(80%_60%_at_100%_0%,rgba(226,184,115,.22),transparent_60%),linear-gradient(165deg,#3A1620_0%,#2A0E13_100%)] text-[rgba(255,244,230,.82)] shadow-[0_40px_80px_-40px_rgba(42,14,19,.75)] lg:motion-safe:[transform:translateY(-12px)]"
          : "border-line bg-white shadow-sm",
      )}
    >
      {plan.is_featured && (
        <span className={badge("gold", undefined, "absolute top-5 right-5")}>
          <Icon name="star" size={12} className="fill-current" /> Most popular
        </span>
      )}
      <h3 className={cx("m-0 mb-1.5 pr-[110px] font-sans text-[21px] leading-[1.2] font-extrabold tracking-[-.02em] transition-none", dark ? "text-white" : "text-ink")}>{plan.name}</h3>
      <p className={cx("mt-0 mb-6 min-h-11 font-sans text-[14.5px] leading-[1.5] font-normal", muted(dark))}>{plan.tagline ?? (student ? STUDENT_TAGLINE : SCHOOL_TAGLINE)}</p>
      <p className={cx("mt-0 mb-1 flex items-baseline gap-1 font-sans text-base leading-[1.65] font-normal tabular-nums", dark ? "text-white" : "text-ink")} aria-live="polite">
        <span className="mt-1.5 self-start text-[24px] font-bold">₹</span>
        <span className="text-[length:clamp(40px,2vw_+_24px,50px)] leading-none font-extrabold tracking-[-.04em]">{INR.format(amount)}</span>
        <span className={cx("text-[15px] font-semibold", muted(dark))}>/{cycle === "yearly" ? "year" : "month"}</span>
      </p>
      <div className="mt-3 min-h-[30px]">
        {saving > 0 && <span className={badge(dark ? "successDark" : "success")}>Save {saving}% vs monthly</span>}
        {student && plan.trial_days > 0 && (
          <span className={badge(dark ? "successDark" : "success")}><Icon name="sparkles" size={13} /> {plan.trial_days}-day free trial, no card needed</span>
        )}
      </div>
      <hr className={cx("my-6 h-px border-0 opacity-25", dark ? "bg-[rgba(255,255,255,.14)]" : "bg-line-2")} />
      <p className={cx("mt-0 mb-4 font-sans text-[12px] leading-[1.65] font-extrabold tracking-[.1em] uppercase", muted(dark))}>What&rsquo;s included</p>
      <CheckList items={features} className="mb-8 flex-1 content-start" dark={dark} />
      {student ? (
        <a
          href={`/register/student?plan=${encodeURIComponent(plan.key)}&cycle=${cycle}`}
          className={btn(dark ? "gold" : "maroon", "lg", cx("w-full", dark ? BTN_FOCUS_DARK : BTN_FOCUS))}
          data-key={plan.key}
        >
          Get Started <Icon name="arrowRight" size={18} />
        </a>
      ) : (
        <a href="/contact" className={btn(dark ? "gold" : "ghost", "lg", cx("w-full", dark ? BTN_FOCUS_DARK : BTN_FOCUS))}>
          Talk to Sales <Icon name="arrowRight" size={18} />
        </a>
      )}
    </article>
  );
}

/** Plan grid columns: 3 / 2 / 1 plans (was `bp-plans` + `--2` / `--1`); 2 columns under 992px, 1 under 768px. */
const PLANS: Record<number, string> = {
  3: "grid-cols-3",
  2: "mx-auto max-w-[880px] grid-cols-2",
  1: "mx-auto max-w-[460px] grid-cols-1",
};
/** An odd last card on the two-column (tablet) grid is centred at half width (full width again on phones). */
const ODD_LAST = cx(
  "max-lg:[&>:last-child:nth-child(odd):not(:first-child)]:col-span-full max-lg:[&>:last-child:nth-child(odd):not(:first-child)]:w-full",
  "max-lg:[&>:last-child:nth-child(odd):not(:first-child)]:max-w-[calc(50%-12px)] max-lg:[&>:last-child:nth-child(odd):not(:first-child)]:justify-self-center",
  "max-md:[&>:last-child:nth-child(odd):not(:first-child)]:max-w-none",
);

function Group({ id, title, sub, plans, cycle, audience }: { id: string; title: string; sub: string; plans: PricePlan[]; cycle: Cycle; audience: "student" | "school" }) {
  if (!plans.length) return null;
  const n = Math.min(plans.length, 3);
  return (
    <section className="[section+&]:mt-[88px] max-md:[section+&]:mt-16" aria-labelledby={id}>
      <div className="mb-10 flex flex-col items-center text-center">
        <p className={eyebrowClass()}>{sub}</p>
        <h2 id={id} className="m-0 mb-2 font-sans text-[26px] leading-[1.3] font-extrabold tracking-[-.02em] text-ink transition-none">{title}</h2>
      </div>
      <div
        className={cx(
          "grid items-stretch gap-6 *:min-w-0",
          PLANS[n],
          "max-lg:max-w-none max-lg:grid-cols-2 max-md:mx-auto max-md:max-w-[480px] max-md:grid-cols-1",
          ODD_LAST,
        )}
      >
        {plans.map((plan, i) => <PlanCard key={plan.id ?? i} plan={plan} cycle={cycle} audience={audience} />)}
      </div>
    </section>
  );
}

/**
 * Pricing page plans with the monthly / yearly switch (legacy pricing.blade.php
 * inline script: swaps each price, the "/month" label and the sign-up links'
 * `cycle` parameter). Redesigned in 2026, not in legacy: React state instead of
 * DOM rewriting, aria-pressed toggle, Indian digit grouping. Tailwind since the
 * migration's phase 2 (was `.bp-plan*` / `.bp-toggle` in site-ui.css). One difference
 * from the legacy cascade: hovering the featured plan no longer drops it from its 12px lift
 * (a `.bh-page article:hover { transform: none }` rule cancelled it); no card moves on hover.
 */
export function PricingPlans({ individual, school }: { individual: PricePlan[]; school: PricePlan[] }) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  // Legacy hard-coded "SAVE 16%"; the real saving differs by plan (not in legacy).
  const bestSaving = maxYearlySavingPct([...individual, ...school]);
  const toggle = (on: boolean) =>
    cx(
      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 px-[22px] font-sans text-[15px] leading-none font-bold [transition:background_.2s,color_.2s,box-shadow_.2s]",
      on ? "bg-grad-maroon text-white shadow-[0_8px_18px_-8px_rgba(92,26,38,.6)]" : "bg-transparent text-body hover:text-maroon",
      FOCUS_BUTTON,
    );
  return (
    <>
      <div className="mb-14 flex justify-center">
        <div className="inline-flex gap-1 rounded-full border border-line-2 bg-white p-1.5 shadow-sm" role="group" aria-label="Billing cycle">
          <button type="button" aria-pressed={cycle === "monthly"} onClick={() => setCycle("monthly")} className={toggle(cycle === "monthly")}>Monthly</button>
          <button type="button" aria-pressed={cycle === "yearly"} onClick={() => setCycle("yearly")} className={toggle(cycle === "yearly")}>
            Yearly {bestSaving > 0 && <span className={badge("success", "px-2 py-[3px] text-[10.5px]")}>SAVE UP TO {bestSaving}%</span>}
          </button>
        </div>
      </div>
      <Group id="plans-students" title="For Students" sub="Individual plans" plans={individual} cycle={cycle} audience="student" />
      <Group id="plans-schools" title="For Schools" sub="School plans" plans={school} cycle={cycle} audience="school" />
    </>
  );
}
