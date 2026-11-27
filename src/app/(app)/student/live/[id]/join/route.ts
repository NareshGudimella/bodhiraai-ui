import { NextResponse, type NextRequest } from "next/server";
import { api, ApiError } from "@/lib/api";
import { seg } from "@/lib/api-path";
import { setFlash } from "@/lib/flash";
import { getToken } from "@/lib/session";
import { isCrossSite, siteUrl } from '@/lib/site-url';

/**
 * Legacy GET /student/live/{id}/join: records attendance, then sends the
 * student to the meeting. Errors (not in audience, cancelled, no URL) return
 * to the class page with a message.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/student/live/[id]/join">) {
  const { id } = await ctx.params;
  // security: not in legacy. The id (or slug) goes into an API path as one encoded segment; `.` and `..` are refused.
  if (id === "." || id === "..") return new NextResponse("Not Found", { status: 404 });
  // security: not in legacy. A join started from another site records nothing: show the class page.
  if (isCrossSite(request)) return NextResponse.redirect(siteUrl(`/student/live/${encodeURIComponent(id)}`, request.url), 302);
  const back = async (message: string) => {
    await setFlash(message); // shown once on the class page, not taken from the URL
    return NextResponse.redirect(siteUrl(`/student/live/${encodeURIComponent(id)}`, request.url), 302);
  };

  if (!(await getToken())) return NextResponse.redirect(siteUrl(`/login?next=${encodeURIComponent(`/student/live/${encodeURIComponent(id)}`)}`, request.url), 302);
  try {
    // Same paywall as the rest of /student (legacy `subscribed` middleware).
    const { has_access } = await api<{ has_access: boolean }>("/student/access");
    if (!has_access) return NextResponse.redirect(siteUrl("/paywall", request.url), 302);

    const { meeting_url } = await api<{ meeting_url: string }>(`/student/live-classes/${seg(id)}/join`, { method: "POST" });
    if (!/^https?:\/\//i.test(meeting_url)) return back("The meeting link isn't available yet."); // security: not in legacy
    return NextResponse.redirect(meeting_url, 302);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return NextResponse.redirect(siteUrl("/login", request.url), 302);
    return back(e instanceof ApiError ? e.message : "Could not join the class. Try again.");
  }
}
