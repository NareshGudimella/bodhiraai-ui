import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { authLink } from "@/components/auth/auth-styles";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Set a new password" };

/**
 * Legacy auth/reset.blade.php (the link from the reset email). Layout: AuthShell
 * (2026 redesign, not in legacy; so is the "Back to sign in" link under the card).
 */
export default function ResetPasswordPage({ params, searchParams }: PageProps<"/reset-password/[token]">) {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Set a new password"
      lead="Choose a password of at least 8 characters."
      after={
        <Link href="/login" className={authLink}>
          ← Back to sign in
        </Link>
      }
    >
      <Suspense>
        <Body params={params} searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Body({ params, searchParams }: PageProps<"/reset-password/[token]">) {
  const [{ token }, q] = await Promise.all([params, searchParams]);
  return <ResetForm token={token} email={typeof q.email === "string" ? q.email : ""} />;
}
