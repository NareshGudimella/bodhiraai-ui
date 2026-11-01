import type { Metadata } from "next";
import Link from "next/link";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Forgot password" };

/** Legacy auth/forgot.blade.php. */
export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg ring-1 ring-line">
        <h1 className="text-2xl font-bold text-brand">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-2">Enter your email and we&apos;ll send you a link to set a new one.</p>
        <ForgotForm />
        <p className="mt-4 text-center text-sm"><Link href="/login" className="text-ink-2 underline">← Back to sign in</Link></p>
      </div>
    </main>
  );
}
