import type { Metadata } from "next";
import { CmsLoginForm } from "./login-form";

export const metadata: Metadata = { title: "Web Studio sign in" };

/** Legacy Cms\AuthController: a separate sign-in for the CMS roles. */
export default function CmsLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[linear-gradient(135deg,#1A0A0C,#2A0E13_50%,#3D1520)] px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg ring-1 ring-line">
        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-primary-dark">Web Studio</p>
        <h1 className="mt-1 text-2xl font-bold text-brand">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-2">For website administrators and content managers.</p>
        <CmsLoginForm />
      </div>
    </main>
  );
}
