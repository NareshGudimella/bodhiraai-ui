import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import { api, ApiError } from './api';
import { setFlash } from './flash';
import { homeFor } from './roles';
import { getToken } from './session';
import { siteUrl } from './site-url';
import { idSeg, seg } from '@/lib/api-path';

/**
 * Legacy GET /chat/with-teacher/{student} (parents) and /chat/with-parent/{student}
 * (teachers): find or create the conversation and go to it. Same API calls as the
 * "Chat with Teacher" / "Chat parent" buttons (`startChat`).
 *
 * Legacy answers: signed out → login; another role or not your student → 403;
 * unknown student → 404; no teacher/parent yet → chat list with a status message.
 */
export async function legacyStartChat(
  request: NextRequest,
  start: 'with-teacher' | 'with-parent',
  student: string,
): Promise<NextResponse> {
  const path = `/chat/${start}/${encodeURIComponent(student)}`;
  if (!(await getToken())) {
    const url = siteUrl('/login', request.url);
    url.searchParams.set('next', path);
    return NextResponse.redirect(url, 302);
  }
  if (!/^\d+$/.test(student)) return new NextResponse('Not Found', { status: 404 });

  const wanted = start === 'with-teacher' ? 'parent' : 'teacher';
  try {
    const me = await api<{ role: string }>('/auth/me');
    // Legacy `role:teacher,parent` middleware, then the per-action role check.
    if (me.role !== wanted) return new NextResponse('Forbidden', { status: 403 });

    const { id } = await api<{ id: number }>(`/chat/${seg(start)}/${idSeg(student)}`, { method: 'POST' });
    return NextResponse.redirect(siteUrl(`${homeFor(me.role)}/chat/${id}`, request.url), 302);
  } catch (e) {
    if (!(e instanceof ApiError)) throw e;
    if (e.status === 401) return NextResponse.redirect(siteUrl('/login?expired=1', request.url), 302);
    if (e.status === 403) return new NextResponse('Forbidden', { status: 403 });
    // The API reports "no teacher / no parent yet" as a 404 with legacy's status text.
    if (e.status === 404 && /^No (class teacher|parent)/.test(e.message)) {
      await setFlash(e.message);
      const me = await api<{ role: string }>('/auth/me');
      return NextResponse.redirect(siteUrl(`${homeFor(me.role)}/chat`, request.url), 302);
    }
    if (e.status === 404) return new NextResponse('Not Found', { status: 404 });
    throw e;
  }
}
