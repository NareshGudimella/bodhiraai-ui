import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthAlert } from "@/components/auth/auth-fields";
import { AuthShell } from "@/components/auth/auth-shell";
import { authButton, authLink } from "@/components/auth/auth-styles";
import { ApiError, api } from "@/lib/api";
import { confirmHandoff } from "@/lib/auth-actions";
import { safeNextPath } from "@/lib/safe-path";
import { getToken } from "@/lib/session";

// The code is in the URL: keep it out of Referer headers and search indexes.
export const metadata: Metadata = { title: "Continue to Bodhira.ai", referrer: "no-referrer", robots: { index: false, follow: false } };

/**
 * not in legacy: the mobile app sends a user here with a single-use code. This
 * page only shows who the code is for (the API's peek endpoint spends nothing);
 * signing in happens when the user presses the button (a Server Action POST),
 * so a link in someone else's hands can't sign a victim in to the attacker's account.
 * Layout: AuthShell (2026 sign-in redesign).
 */
export default function HandoffPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <AuthShell eyebrow="Sign in" title="Continue to Bodhira.ai">
      <Suspense fallback={<div aria-busy="true" className="mt-7 h-12 animate-pulse rounded-full bg-[rgba(42,14,19,.06)]" />}>
        <Confirm searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}

async function Confirm({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const code = typeof q.code === "string" ? q.code : "";
  const next = safeNextPath(typeof q.next === "string" ? q.next : null);
  function failed(reason: string): never {
    redirect(`/auth/handoff/failed?reason=${reason}${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  if (!code || code.length > 200) failed("invalid");

  let who: { name: string; role: string };
  try {
    who = await api<{ name: string; role: string }>("/auth/web-handoff/peek", { body: { code }, token: null });
  } catch (e) {
    failed(e instanceof ApiError && (e.status === 422 || e.status === 403) ? "expired" : "error");
  }

  // Someone else may be signed in in this browser; say what continuing does to them.
  let current: string | null = null;
  const token = await getToken();
  if (token) {
    const me = await api<{ name: string; role: string }>("/auth/me", { token }).catch(() => null);
    if (me && (me.name !== who.name || me.role !== who.role)) current = me.name;
  }

  return (
    <>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        The app asked to open the website as <strong className="font-bold text-ink">{who.name}</strong>.
      </p>
      {current && (
        <div className="mt-5">
          <AuthAlert tone="error">You are signed in as {current}. Continuing signs you out of that account.</AuthAlert>
        </div>
      )}
      <form action={confirmHandoff} className="mt-7">
        <input type="hidden" name="code" value={code} />
        <input type="hidden" name="next" value={next ?? ""} />
        <button type="submit" className={authButton}>
          Continue as {who.name}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        <a href="/login" className={authLink}>Not you? Sign in instead</a>
      </p>
    </>
  );
}
