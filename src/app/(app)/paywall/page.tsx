import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { logout } from "@/lib/auth-actions";
import { billingApi } from "@/lib/billing-api";
import { getCurrentUser } from "@/lib/dal";
import { homeFor } from "@/lib/roles";
import { studentApi } from "@/lib/student-api";
import { PaywallPlans } from "./paywall-plans";

export const metadata: Metadata = { title: "Choose a plan" };

/** Shown when a student's access has lapsed (legacy `subscribed` middleware → PaywallController::show). */
export default function PaywallPage() {
  return (
    <main className="flex-1 bg-[linear-gradient(135deg,#1A0A0C,#2A0E13_50%,#3D1520)] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Suspense fallback={<p className="text-center opacity-70">Checking your plan…</p>}>
          <PaywallBody />
        </Suspense>
      </div>
    </main>
  );
}

async function PaywallBody() {
  const user = await getCurrentUser();
  if (user.role !== "student") redirect(homeFor(user.role));
  if ((await studentApi.access()).has_access) redirect("/student");

  // School students are gated on their school's plan, which only the school can renew.
  if (user.school) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-card p-8 text-center text-ink shadow-lg">
        <p aria-hidden className="text-4xl">🔒</p>
        <h1 className="mt-3 text-2xl font-bold text-brand">Your access has paused</h1>
        <p className="mt-2 text-sm text-ink-2">{user.school.name}&apos;s plan isn&apos;t active right now. Please contact your school.</p>
        <form action={logout} className="mt-6">
          <button className="w-full rounded-lg border border-line py-2 text-sm text-ink-2 hover:bg-primary-light">Log out</button>
        </form>
      </div>
    );
  }

  const { subscription: sub, plans } = await billingApi.paywall();
  return (
    <>
      <div className="mb-8 text-center">
        {sub?.status === "trialing" && !sub.in_trial && (
          <p className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider text-red-300">⏰ TRIAL ENDED</p>
        )}
        {sub?.in_trial && (
          <p className="mb-3 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold tracking-wider text-primary">
            {sub.days_remaining} TRIAL DAYS LEFT
          </p>
        )}
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Pick a plan to keep learning</h1>
        <p className="mx-auto mt-2 max-w-lg opacity-70">Cancel any time. Annual saves you 2 months.</p>
      </div>
      <PaywallPlans plans={plans} />
      <div className="mt-9 text-center text-sm opacity-60">
        Want to switch back to school account? <Link href="/login" className="font-bold text-primary">Sign in</Link>
        {" · "}
        <form action={logout} className="inline">
          <button className="font-bold text-primary underline">Sign out</button>
        </form>
      </div>
    </>
  );
}
