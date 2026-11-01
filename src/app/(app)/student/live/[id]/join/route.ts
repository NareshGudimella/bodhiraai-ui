import { NextResponse, type NextRequest } from "next/server";
import { api, ApiError } from "@/lib/api";
import { setFlash } from "@/lib/flash";
import { getToken } from "@/lib/session";
import { siteUrl } from '@/lib/site-url';

/**
 * Legacy GET /student/live/{id}/join: records attendance, then sends the
 * student to the meeting. Errors (not in audience, cancelled, no URL) return
 * to the class page with a message.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/student/live/[id]/join">) {
  const { id } = await ctx.params;
  // security: not in legacy. The id goes into an API path: digits only, checked before anything else.
  if (!/^\d+$/.test(id)) return new NextResponse("Not Found", { status: 404 });
  const back = async (message: string) => {
    await setFlash(message); // shown once on the class page, not taken from the URL
    return NextResponse.redirect(siteUrl(`/student/live/${id}`, request.url), 302);
  };

  if (!(await getToken())) return NextResponse.redirect(siteUrl(`/login?next=${encodeURIComponent(`/student/live/${id}`)}`, request.url), 302);
  try {
    // Same paywall as the rest of /student (legacy `subscribed` middleware).
    const { has_access } = await api<{ has_access: boolean }>("/student/access");
    if (!has_access) return NextResponse.redirect(siteUrl("/paywall", request.url), 302);

    const { meeting_url } = await api<{ meeting_url: string }>(`/student/live-classes/${id}/join`, { method: "POST" });
    if (!/^https?:\/\//i.test(meeting_url)) return back("The meeting link isn't available yet."); // security: not in legacy
    return NextResponse.redirect(meeting_url, 302);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return NextResponse.redirect(siteUrl("/login", request.url), 302);
    return back(e instanceof ApiError ? e.message : "Could not join the class. Try again.");
  }
}
