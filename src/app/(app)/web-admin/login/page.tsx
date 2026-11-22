import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { CmsLoginForm } from "./login-form";

export const metadata: Metadata = { title: "Web Studio sign in" };

/**
 * Legacy Cms\AuthController: a separate sign-in for the CMS roles. Layout:
 * AuthShell (2026 sign-in redesign, not in legacy), without the learner value points.
 */
export default function CmsLoginPage() {
  return (
    <AuthShell
      eyebrow="Web Studio"
      title="Admin sign in"
      lead="For website administrators and content managers."
      headline={
        <>
          Bodhira.ai <span className="text-(--auth-gold-bright)">Web Studio</span>
        </>
      }
      intro="Pages, posts, menus, media and settings for the public website."
      panel={null}
    >
      <CmsLoginForm />
    </AuthShell>
  );
}
