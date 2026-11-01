import { NextResponse } from 'next/server';
import { api, ApiError } from '@/lib/api';
import { getToken } from '@/lib/session';
import { proxySecretHeader } from '@/lib/proxy-secret';
import { siteUrl } from '@/lib/site-url';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

/** Legacy `/student/profile/report`: streams the student's PDF progress report from the API with the session token. */
export async function GET(request: Request) {
  const token = await getToken();
  if (!token) return NextResponse.redirect(siteUrl('/login', request.url), 302);
  try {
    // Same paywall as the rest of /student (legacy `subscribed` middleware).
    const { has_access } = await api<{ has_access: boolean }>('/student/access');
    if (!has_access) return NextResponse.redirect(siteUrl('/paywall', request.url), 302);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return NextResponse.redirect(siteUrl('/login', request.url), 302);
    throw e;
  }
  const res = await fetch(`${API_URL}/student/profile/report`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/pdf', ...proxySecretHeader() },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    return new NextResponse(body?.message ?? 'Report not available.', { status: res.status });
  }
  return new NextResponse(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/pdf',
      'Content-Disposition': res.headers.get('Content-Disposition') ?? 'attachment',
      'Cache-Control': 'private, no-store',
    },
  });
}
