import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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
 */
export default function HandoffPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-lg ring-1 ring-line">
        <Suspense>
          <Confirm searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
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
      <h1 className="text-2xl font-bold text-brand">Continue to Bodhira.ai</h1>
      <p className="mt-2 text-sm text-ink-2">
        The app asked to open the website as <strong className="text-ink">{who.name}</strong>.
      </p>
      {current && (
        <p className="mt-3 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger" role="alert">
          You are signed in as {current}. Continuing signs you out of that account.
        </p>
      )}
      <form action={confirmHandoff} className="mt-6">
        <input type="hidden" name="code" value={code} />
        <input type="hidden" name="next" value={next ?? ""} />
        <button
          type="submit"
          className="w-full rounded-lg bg-brand py-2.5 font-semibold text-primary-light transition hover:bg-brand-mid"
        >
          Continue as {who.name}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-2">
        <a href="/login" className="font-semibold text-brand hover:underline">Not you? Sign in instead</a>
      </p>
    </>
  );
}
