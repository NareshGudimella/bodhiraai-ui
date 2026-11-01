import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Set a new password" };

/** Legacy auth/reset.blade.php (the link from the reset email). */
export default function ResetPasswordPage({ params, searchParams }: PageProps<"/reset-password/[token]">) {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg ring-1 ring-line">
        <h1 className="text-2xl font-bold text-brand">Set a new password</h1>
        <p className="mt-1 text-sm text-ink-2">Choose a password of at least 8 characters.</p>
        <Suspense>
          <Body params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function Body({ params, searchParams }: PageProps<"/reset-password/[token]">) {
  const [{ token }, q] = await Promise.all([params, searchParams]);
  return <ResetForm token={token} email={typeof q.email === "string" ? q.email : ""} />;
}
