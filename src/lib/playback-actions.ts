'use server';

import { api, ApiError } from './api';
import { idSeg } from '@/lib/api-path';
import { mediaUrl } from './media';

/**
 * GET /lessons/{id}/playback for the lesson player (student, and teachers of
 * the subject). The API decides who may play; the token stays on this server
 * and the browser only gets the short-lived OTP (or a signed/external URL).
 * security: not in legacy
 */
export type LessonPlayback =
  | { ok: true; provider: 'vdocipher'; otp: string; playbackInfo: string; expiresIn: number }
  | { ok: true; provider: 'url'; url: string }
  | { ok: false; status: number; message: string };

type PlaybackData =
  | { provider: 'vdocipher'; otp: string; playback_info: string; expires_in: number }
  | { provider: 'url'; url: string };

export async function lessonPlayback(lessonId: number): Promise<LessonPlayback> {
  try {
    const d = await api<PlaybackData>(`/lessons/${idSeg(lessonId)}/playback`);
    if (d.provider === 'vdocipher' && d.otp && d.playback_info) {
      return { ok: true, provider: 'vdocipher', otp: d.otp, playbackInfo: d.playback_info, expiresIn: d.expires_in };
    }
    const url = d.provider === 'url' ? mediaUrl(d.url) : null;
    if (url && /^https?:\/\//i.test(url)) return { ok: true, provider: 'url', url };
    return { ok: false, status: 404, message: 'This video is not available.' };
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0;
    const message =
      status === 403
        ? "You can't play this lesson."
        : status === 404
          ? 'This video is not available.'
          : status === 402
            ? 'Your subscription is not active. Please complete checkout to continue.'
            : status === 429
              ? 'Too many requests. Please wait a moment and try again.'
              : 'Could not load the video. Please try again.';
    return { ok: false, status, message };
  }
}
