import 'server-only';
import { NextResponse } from 'next/server';
import { getToken } from './session';
import { proxySecretHeader } from './proxy-secret';
import { siteUrl } from './site-url';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

/** Stream a CSV export from the API with the session token (route handlers). */
export async function proxyCsv(request: Request, path: string) {
  const token = await getToken();
  if (!token) return NextResponse.redirect(siteUrl('/login', request.url), 302);
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, ...proxySecretHeader() },
    cache: 'no-store',
  });
  if (!res.ok) return new NextResponse('Export not available.', { status: res.status });
  return new NextResponse(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'text/csv',
      'Content-Disposition': res.headers.get('Content-Disposition') ?? 'attachment',
      'Cache-Control': 'private, no-store',
    },
  });
}
