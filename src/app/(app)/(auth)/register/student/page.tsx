import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/page-meta";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { authLink } from "@/components/auth/auth-styles";
import { Icon, type IconName } from "@/components/site/icons";
import { billingApi } from "@/lib/billing-api";
import { SignupForm } from "./signup-form";

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadata("/register/student", "Sign up", "Create your Bodhira.ai student account: pick your board and grade and get instant access to the full syllabus. No card needed for the trial.");
}

const TITLE = "Create your student account";

/**
 * Legacy RegisterController::show: B2C student sign-up, optionally for a plan
 * picked on /pricing (?plan=&cycle=). Layout: AuthShell (2026 redesign, not in
 * legacy); the plan summary / "What you get" box sits in its brand panel.
 */
export default function RegisterStudentPage({ searchParams }: PageProps<"/register/student">) {
  return (
    <Suspense
      fallback={
        <AuthShell eyebrow="Sign up" title={TITLE} wide panel={null} placeholder>
          <div aria-busy="true" className="mt-7 space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[rgba(42,14,19,.06)]" />
            ))}
          </div>
        </AuthShell>
      }
    >
      <Body searchParams={searchParams} />
    </Suspense>
  );
}

async function Body({ searchParams }: Pick<PageProps<"/register/student">, "searchParams">) {
  const q = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
  const { syllabi, plan, cycle } = await billingApi.signupOptions(str(q.plan), str(q.cycle));
  const paid = !!plan && (plan.monthly_price > 0 || plan.yearly_price > 0);
  return (
    <AuthShell
      eyebrow="Sign up"
      title={TITLE}
      lead={
        <p>
          Already have one?{" "}
          <Link href="/login" className={authLink}>
            Sign in →
          </Link>
        </p>
      }
      wide
      headline={
        plan ? (
          <>
            You&apos;re picking the <span className="text-(--auth-gold-bright)">{plan.name}</span> plan.
          </>
        ) : (
          <>
            Try Bodhira.ai <span className="text-(--auth-gold-bright)">free for 7 days.</span>
          </>
        )
      }
      intro={
        plan
          ? plan.tagline || "Pick your board and grade and you're set in 30 seconds."
          : "Pick your board and grade, get instant access to the full syllabus. No card needed for the trial."
      }
      panel={
        plan ? (
          <PanelBox label={`${plan.name.toUpperCase()} · ${cycle === "yearly" ? "YEARLY" : "MONTHLY"}`}>
            <Row>
              <span>Price</span>
              <strong className="text-white">
                ₹{(cycle === "yearly" ? plan.yearly_price : plan.monthly_price).toLocaleString("en-US")} / {cycle === "yearly" ? "year" : "month"}
              </strong>
            </Row>
            {plan.trial_days > 0 && (
              <Row>
                <span>Free trial</span>
                <span>{plan.trial_days} days</span>
              </Row>
            )}
            {(plan.features ?? []).map((f) => (
              <Row key={f}>
                <span className="flex items-start gap-2">
                  <Icon name="check" size={16} className="mt-0.5 text-(--auth-gold-bright)" /> {f}
                </span>
              </Row>
            ))}
            <Row small>
              <span className="opacity-70">Change plan?</span>
              <Link
                href="/pricing"
                className="rounded font-semibold text-(--auth-gold-bright) underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-(color:--auth-gold-bright)"
              >
                Compare all →
              </Link>
            </Row>
          </PanelBox>
        ) : (
          <PanelBox label="WHAT YOU GET">
            <Item icon="bookOpen" text="Full chapter library" note="per syllabus" />
            <Item icon="listChecks" text="Quizzes & progress" note="tracked" />
            <Item icon="sparkles" text="AI doubt solver" note="(Premium)" />
            <Item icon="shield" text="No card needed" note="for trial" />
          </PanelBox>
        )
      }
    >
      <SignupForm syllabi={syllabi} planKey={plan?.key ?? null} cycle={cycle} paid={paid} />
    </AuthShell>
  );
}

function PanelBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="max-w-md rounded-2xl border border-white/15 bg-white/[.07] p-4 backdrop-blur-md sm:p-5">
      <p className="text-[11px] font-bold tracking-[.14em] text-(--auth-gold-bright)">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Row({ small, children }: { small?: boolean; children: ReactNode }) {
  return (
    <p className={`flex justify-between gap-3 border-t border-white/10 py-2.5 first:border-t-0 ${small ? "text-xs" : "text-sm"} text-[#fff4e6]/85`}>
      {children}
    </p>
  );
}

function Item({ icon, text, note }: { icon: IconName; text: string; note: string }) {
  return (
    <Row>
      <span className="flex items-center gap-2.5 font-semibold text-white">
        <Icon name={icon} size={17} className="text-(--auth-gold-bright)" /> {text}
      </span>
      <span className="text-[#fff4e6]/70">{note}</span>
    </Row>
  );
}
