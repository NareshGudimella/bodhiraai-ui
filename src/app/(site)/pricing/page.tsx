import type { Metadata } from "next";
import { connection } from "next/server";
import { Icon } from "@/components/site/icons";
import { BTN_FOCUS, BTN_FOCUS_DARK, HeroBadge, PAGE, section } from "@/components/site/kit-content-ui";
import { CtaBand } from "@/components/site/page-kit";
import { PageHero } from "@/components/site/page-hero";
import { PricingPlans } from "@/components/site/pricing-plans";
import { SeoSchema } from "@/components/site/seo-schema";
import { btn } from "@/components/site/ui";
import { RevealOnScroll } from "@/components/site/site-enhance";
import { assetResolver, siteMetadata } from "@/lib/site";
import { getPricing } from "@/lib/site-api";
import { maxYearlySavingPct } from "@/lib/plan-savings";

/** Renders per request and may block, like the site layout (see its note). */
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata("/pricing", 'Pricing · Bodhira.ai');
}

/**
 * Legacy resources/views/pricing.blade.php, redesigned in 2026 with the page
 * design kit (not in legacy; docs/site-design-kit.md): same plans from
 * GET /pricing, same copy, same monthly/yearly switch and sign-up links
 * (`/register/student?plan=…&cycle=…`, schools → /contact). Added: hero photo
 * and a closing "talk to sales" card. Photos: public/assets/img/pages/CREDITS.md.
 * Tailwind since the migration's phase 2 (was `.bh-page` kit classes).
 */
export default async function PricingPage() {
  await connection();
  const [asset, { individual, school }] = await Promise.all([assetResolver(), getPricing()]);
  /** The longest student-plan trial, for the hero badge (none without one). */
  const trial = Math.max(0, ...individual.map((p) => p.trial_days));
  /** Legacy said "saves you ~2 months" for every plan; use the real best saving (not in legacy). */
  const bestSaving = maxYearlySavingPct([...individual, ...school]);
  return (
    <div className={PAGE}>
      <SeoSchema path="pricing" />

      <PageHero
        eyebrow="Plans & Pricing"
        title="Plans &"
        highlight="Pricing"
        lead={`Pick a plan and start in 30 seconds. Cancel anytime.${bestSaving > 0 ? ` Annual billing saves up to ${bestSaving}%.` : ""}`}
        breadcrumbs={[{ label: "Pricing" }]}
        image={{ src: asset("assets/img/pages/pricing-hero.jpg"), alt: "A young boy following an online lesson on a laptop at home, his notebook beside him", width: 1200, height: 1000 }}
        actions={
          <>
            <a href="#plans" className={btn("maroon", "lg", BTN_FOCUS)}>See the plans <Icon name="arrowRight" size={18} /></a>
            <a href="/contact" className={btn("ghost", "lg", BTN_FOCUS)}>Talk to Sales</a>
          </>
        }
        badge={
          trial > 0 && <HeroBadge icon={<Icon name="sparkles" size={20} />} value={<>{trial}-day free trial</>} label="No card needed" />
        }
      />

      <section className={section("cream")} id="plans" aria-label="Plans" style={{ scrollMarginTop: 80 }}>
        <div className="site-container">
          <PricingPlans individual={individual} school={school} />
        </div>
      </section>

      <section className={section("cream", { flushTop: true })} aria-label="Talk to us">
        <div className="site-container">
          <CtaBand
            image={asset("assets/img/pages/pricing-schools.jpg")}
            title="Bringing Bodhira.ai to Your Whole School?"
            text="School plans cover every class, teacher and parent. Tell us about your school and we will set up a walkthrough."
            actions={
              <>
                <a href="/contact" className={btn("gold", "lg", BTN_FOCUS_DARK)}>Talk to Sales <Icon name="arrowRight" size={18} /></a>
                <a href="/book-demo" className={btn("glass", "lg", BTN_FOCUS_DARK)}>Book a Demo</a>
              </>
            }
          />
        </div>
      </section>

      <RevealOnScroll />
    </div>
  );
}
