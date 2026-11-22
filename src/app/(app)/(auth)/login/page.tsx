import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { authLink } from "@/components/auth/auth-styles";
import { Flash } from "@/components/flash";
import { Icon } from "@/components/site/icons";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

/** Legacy auth/login.blade.php. Layout: AuthShell (2026 redesign, not in legacy). */
export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back"
      lead="Log in with your email, phone or username."
      after={
        // Legacy login: "New to Bodhira.ai?" links to student sign-up.
        <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
          <Icon name="sprout" size={16} className="text-(--auth-gold)" /> New to Bodhira.ai?{" "}
          <Link href="/register/student" className={authLink}>
            See how AI reveals every learner&apos;s potential →
          </Link>
        </p>
      }
    >
      <div className="mt-5 empty:hidden">
        <Suspense>
          <Flash />
        </Suspense>
      </div>
      {/* The form reads ?next=, which is request-time data. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
