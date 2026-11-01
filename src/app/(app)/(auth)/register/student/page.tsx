import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { billingApi } from "@/lib/billing-api";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Sign up" };

/** Legacy RegisterController::show: B2C student sign-up, optionally for a plan picked on /pricing. */
export default function RegisterStudentPage({ searchParams }: PageProps<"/register/student">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-line [&>*]:min-w-0 md:grid-cols-2">
        <Suspense fallback={<div className="p-8 text-ink-3">Loading…</div>}>
          <Body searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Body({ searchParams }: Pick<PageProps<"/register/student">, "searchParams">) {
  const q = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
  const { syllabi, plan, cycle } = await billingApi.signupOptions(str(q.plan), str(q.cycle));
  const paid = !!plan && (plan.monthly_price > 0 || plan.yearly_price > 0);
  const row = "flex justify-between gap-3 border-t border-white/10 py-2 text-sm";
  return (
    <>
      <section className="bg-brand p-8 text-primary-light">
        <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider">🧠 AI-POWERED EDTECH</p>
        {plan ? (
          <>
            <h1 className="mt-6 text-2xl font-bold">
              You&apos;re picking the <span className="text-primary">{plan.name}</span> plan.
            </h1>
            <p className="mt-2 text-sm opacity-80">{plan.tagline || "Pick your board and grade and you're set in 30 seconds."}</p>
            <div className="mt-8 rounded-xl bg-white/5 p-4">
              <p className="text-[11px] font-bold tracking-wider opacity-70">
                {plan.name.toUpperCase()} · {cycle === "yearly" ? "YEARLY" : "MONTHLY"}
              </p>
              <p className={row}>
                <span>Price</span>
                <span>
                  ₹{(cycle === "yearly" ? plan.yearly_price : plan.monthly_price).toLocaleString("en-US")} / {cycle === "yearly" ? "year" : "month"}
                </span>
              </p>
              {plan.trial_days > 0 && <p className={row}><span>Free trial</span><span>{plan.trial_days} days</span></p>}
              {(plan.features ?? []).map((f) => <p key={f} className={row}>✓ {f}</p>)}
              <p className={`${row} text-xs`}>
                <span className="opacity-60">Change plan?</span>
                <Link href="/pricing" className="text-primary underline">Compare all →</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-bold">Try Bodhira.ai free for 7 days.</h1>
            <p className="mt-2 text-sm opacity-80">
              Pick your board and grade, get instant access to the full syllabus. No card needed for the trial.
            </p>
            <div className="mt-8 rounded-xl bg-white/5 p-4">
              <p className="text-[11px] font-bold tracking-wider opacity-70">WHAT YOU GET</p>
              <p className={row}><span>📚 Full chapter library</span><span>per syllabus</span></p>
              <p className={row}><span>✏️ Quizzes &amp; progress</span><span>tracked</span></p>
              <p className={row}><span>🤖 AI doubt solver</span><span>(Premium)</span></p>
              <p className={row}><span>💳 No card needed</span><span>for trial</span></p>
            </div>
          </>
        )}
      </section>
      <section className="p-8">
        <h2 className="text-xl font-bold text-brand">Create your student account</h2>
        <p className="mt-1 text-sm text-ink-2">
          Already have one? <Link href="/login" className="font-semibold text-primary-dark">Sign in →</Link>
        </p>
        <SignupForm syllabi={syllabi} planKey={plan?.key ?? null} cycle={cycle} paid={paid} />
      </section>
    </>
  );
}
