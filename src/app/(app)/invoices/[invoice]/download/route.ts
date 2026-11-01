import { NextResponse } from 'next/server';
import { getToken } from '@/lib/session';
import { proxySecretHeader } from '@/lib/proxy-secret';
import { siteUrl } from '@/lib/site-url';

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

/** Legacy `/invoices/{id}/download`: streams the invoice PDF from the API with the session token. */
export async function GET(request: Request, { params }: RouteContext<'/invoices/[invoice]/download'>) {
  const token = await getToken();
  if (!token) return NextResponse.redirect(siteUrl('/login', request.url), 302);
  const { invoice } = await params;
  if (!/^\d+$/.test(invoice)) return new NextResponse('Not Found', { status: 404 }); // security: not in legacy
  const res = await fetch(`${API_URL}/billing/invoices/${invoice}/download`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/pdf', ...proxySecretHeader() },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    return new NextResponse(body?.message ?? 'Invoice not available.', { status: res.status });
  }
  return new NextResponse(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/pdf',
      'Content-Disposition': res.headers.get('Content-Disposition') ?? 'attachment',
      'Cache-Control': 'private, no-store',
    },
  });
}
