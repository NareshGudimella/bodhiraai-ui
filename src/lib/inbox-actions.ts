'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, ApiError } from './api';
import { getCurrentUser } from './dal';
import { homeFor } from './roles';
import type { ChatMessage } from './inbox-api';
import { idSeg, seg } from '@/lib/api-path';
import { safeNextPath } from './safe-path';

/** Chat and notification Server Actions (shared by teachers and parents). */

export async function sendChatMessage(
  conversationId: number,
  body: string,
): Promise<{ ok: true; message: ChatMessage } | { ok: false; error: string }> {
  try {
    const message = await api<ChatMessage>(`/chat/${idSeg(conversationId)}/messages`, { body: { body } });
    return { ok: true, message };
  } catch (e) {
    return { ok: false, error: e instanceof ApiError ? (e.errors?.body?.[0] ?? e.message) : 'Message not sent. Try again.' };
  }
}

/** Open (or create) a conversation from the contacts list, then go to it. */
export async function startChat(start: 'with-teacher' | 'with-parent', studentId: number) {
  const user = await getCurrentUser();
  const { id } = await api<{ id: number }>(`/chat/${seg(start)}/${idSeg(studentId)}`, { method: 'POST' });
  redirect(`${homeFor(user.role)}/chat/${id}`);
}

export async function markNotificationRead(id: string, href: string | null) {
  await api(`/me/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  const to = safeNextPath(href); // security: not in legacy: this arg comes from the client
  if (to) redirect(to);
  refresh();
}

export async function markAllNotificationsRead() {
  await api('/me/notifications/read-all', { method: 'POST' });
  refresh();
}
