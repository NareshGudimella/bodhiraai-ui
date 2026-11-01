import { NextRequest, NextResponse } from 'next/server';
import { areaRoles, GUEST_ONLY, homeFor, PROTECTED_PREFIXES, ROLE_HOME, type Role } from '@/lib/roles';
import { proxySecretHeader } from './lib/proxy-secret';
import { siteUrl } from './lib/site-url';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';
/** This server, for rendering the 404 page (not the public URL, which may be behind a proxy). */
const SELF = `http://127.0.0.1:${process.env.PORT ?? 3000}`;
const BLOG_POST = /^\/blog\/([^/]+)$/;
const LEGACY_SHARED = [/^\/account\/settings$/, /^\/notifications(\/[^/]+\/read)?$/, /^\/chat(\/\d+)?$/];

/**
 * Optimistic cookie-only checks. Real authorisation happens in each dashboard
 * layout via requireRole(). The one API call: whether a blog post exists.
 */
export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // A missing post must answer 404 like legacy. Under cacheComponents the
  // site's pages resume from a prerendered shell that is already sent as 200,
  // so a page's notFound() can't set the status, and a rewrite can't either.
  // Check first and answer with the site's 404 page (rendered by /site-404).
  // Any other API answer leaves it to the page.
  const post = BLOG_POST.exec(path);
  if (post && (await postMissing(post[1]))) {
    const page = await fetch(`${SELF}/site-404`, { headers: { Accept: 'text/html' } });
    return new Response(page.body, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate' },
    });
  }

  const token = req.cookies.get('bodhira_token')?.value;
  const role = req.cookies.get('bodhira_role')?.value;

  // Legacy's shared URLs, now one page per role (not in legacy: keeps old
  // bookmarks working). Signed out: log in first, as legacy's `auth` did. A
  // role without that page goes to its dashboard.
  if (LEGACY_SHARED.some((rx) => rx.test(path))) {
    if (!token || !role) {
      const url = siteUrl('/login', req.nextUrl.href);
      url.searchParams.set('next', path);
      return NextResponse.redirect(url, 302);
    }
    const target = legacyRoleUrl(path, homeFor(role)) ?? homeFor(role);
    return NextResponse.redirect(siteUrl(target, req.nextUrl.href), 302);
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
  if (isProtected && !token) {
    const url = siteUrl('/login', req.nextUrl.href);
    url.searchParams.set('next', path);
    return NextResponse.redirect(url, 302);
  }

  // Another role's dashboard: go home now instead of rendering into requireRole()'s redirect.
  const under = (p: string) => path === p || path.startsWith(`${p}/`);
  const area = Object.values(ROLE_HOME).find(under);
  const owners = areaRoles(path);
  const foreign = owners ? !owners.includes(role as Role) : area && homeFor(role) !== area;
  if (foreign && token && role && role in ROLE_HOME) {
    return NextResponse.redirect(siteUrl(homeFor(role), req.nextUrl.href), 302);
  }

  // Signed-in users hitting /login or sign-up land on their dashboard (legacy `guest` middleware).
  if (GUEST_ONLY.some((p) => under(p)) && token && role && !req.nextUrl.searchParams.has('expired')) {
    return NextResponse.redirect(siteUrl(homeFor(role), req.nextUrl.href), 302);
  }

  return NextResponse.next();
}

/** `/notifications`, `/chat/…` and `/account/settings` under the signed-in role's home. */
function legacyRoleUrl(path: string, home: string): string | null {
  const has = (homes: string[]) => homes.includes(home);
  if (path === '/account/settings' && has(['/student', '/teacher', '/parent', '/admin', '/super', '/cms'])) {
    return `${home}/settings`;
  }
  if ((path === '/notifications' || /^\/notifications\/[^/]+\/read$/.test(path)) && has(['/student', '/teacher', '/parent'])) {
    return `${home}/notifications`;
  }
  const chat = /^\/chat(\/\d+)?$/.exec(path);
  if (chat && has(['/teacher', '/parent'])) return `${home}/chat${chat[1] ?? ''}`;
  return null;
}

async function postMissing(slug: string) {
  try {
    const res = await fetch(`${API_URL}/site/blog/${encodeURIComponent(slug)}/exists`, {
      headers: { Accept: 'application/json', ...proxySecretHeader() },
      signal: AbortSignal.timeout(3_000),
    });
    return res.status === 404;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
};
