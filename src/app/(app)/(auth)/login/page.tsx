import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Flash } from "@/components/flash";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg ring-1 ring-line">
        <h1 className="text-2xl font-bold text-brand">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-2">Log in with your email, phone or username.</p>
        <div className="mt-4 empty:hidden">
          <Suspense>
            <Flash />
          </Suspense>
        </div>
        {/* The form reads ?next=, which is request-time data. */}
        <Suspense>
          <LoginForm />
        </Suspense>
        {/* Legacy login: "New to Bodhira.ai?" links to student sign-up. */}
        <p className="mt-6 border-t border-line pt-4 text-sm text-ink-2">
          <span aria-hidden>🌱</span> New to Bodhira.ai?{" "}
          <Link href="/register/student" className="font-semibold text-brand hover:underline">
            See how AI reveals every learner&apos;s potential →
          </Link>
        </p>
      </div>
    </main>
  );
}
