import 'server-only';
import { apiEnvelope } from './api';
import { load } from './load';
import { idSeg } from '@/lib/api-path';

/** Chat (/api/v1/chat, teacher ↔ parent) and notifications (/api/v1/me/notifications). */

export type Partner = { id: number; name: string; role: string; role_label: string | null; avatar: string | null };

export type ChatMessage = { id: number; body: string; mine: boolean; read: boolean; created_at: string | null; time: string | null };

export type Notification = {
  id: string;
  type: string | null;
  icon: string;
  title: string | null;
  body: string | null;
  url: string | null;
  read_at: string | null;
  created_at: string | null;
};

export type NotificationPage = {
  items: Notification[];
  meta: { current_page: number; last_page: number; total: number; unread_count: number };
};

export const inboxApi = {
  conversations: () =>
    load<
      {
        id: number;
        partner: Partner | null;
        last_message_at: string | null;
        unread_count: number;
        preview: { body: string; mine: boolean; time: string | null } | null;
      }[]
    >('/chat'),
  contacts: () =>
    load<{ start: 'with-teacher' | 'with-parent'; student: { id: number; name: string }; partner: Partner }[]>(
      '/chat/contacts',
    ),
  conversation: (id: string) =>
    load<{ conversation: { id: number; partner: Partner | null }; messages: ChatMessage[] }>(`/chat/${idSeg(id)}`),
  notifications: async (page = 1): Promise<NotificationPage> => {
    const { data, meta } = await apiEnvelope<Notification[]>(`/me/notifications?page=${page}`);
    return { items: data, meta: meta as NotificationPage['meta'] };
  },
};
