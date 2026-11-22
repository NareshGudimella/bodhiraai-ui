import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { authLink } from "@/components/auth/auth-styles";
import { ForgotForm } from "./forgot-form";

// Kept out of search results (SEO: not in legacy).
export const metadata: Metadata = { title: "Forgot password", description: "Reset the password for your Bodhira.ai account.", robots: { index: false, follow: false } };

/** Legacy auth/forgot.blade.php. Layout: AuthShell (2026 redesign, not in legacy). */
export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      lead="Enter your email and we'll send you a link to set a new one."
      after={
        <Link href="/login" className={authLink}>
          ← Back to sign in
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
