import { NextResponse, type NextRequest } from "next/server";
import { setFlash } from "@/lib/flash";
import { safeNextPath } from "@/lib/safe-path";
import { siteUrl } from "@/lib/site-url";

/** The messages a failed hand-off can show; the URL picks one, it never carries text. */
const MESSAGES: Record<string, string> = {
  invalid: "That sign-in link is not valid. Please sign in.",
  expired: "That sign-in link has expired or was already used. Please sign in.",
  error: "Could not sign you in automatically. Please sign in.",
};

/**
 * not in legacy: where /auth/handoff sends a bad, used or expired code. Sets the
 * flash and goes to /login (keeping a safe `next`). Changes no session.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  await setFlash(MESSAGES[params.get("reason") ?? ""] ?? MESSAGES.error);
  const url = siteUrl("/login", request.url);
  const next = safeNextPath(params.get("next"));
  if (next) url.searchParams.set("next", next);
  const res = NextResponse.redirect(url, 302);
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}
