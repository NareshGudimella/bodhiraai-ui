'use server';

import { api, ApiError } from './api';
import { idSeg } from '@/lib/api-path';
import { mediaUrl } from './media';

/**
 * GET /lessons/{id}/playback for the lesson player (student, teachers of the
 * subject, and school admins for their curricula: not in legacy). The
 * API decides who may play; the token stays on this server and the browser
 * only gets the short-lived HLS URL (or a signed/external URL).
 * security: not in legacy
 */
export type LessonPlayback =
  | { ok: true; provider: 'hls'; url: string; watermark: string; expiresAt: number }
  | { ok: true; provider: 'url'; url: string }
  | { ok: false; status: number; message: string; code?: string };

// The HLS contract names the kind `type`; the `url` kind has so far used `provider`.
type PlaybackData = { type?: 'hls' | 'url'; provider?: 'hls' | 'url'; url: string; watermark?: string; expires_at?: string };

const PROCESSING_MESSAGE = 'This video is still processing. Please try again in a few minutes.';
const FAILED_MESSAGE = 'This video could not be processed. Please ask your teacher to upload it again.';

export async function lessonPlayback(lessonId: number): Promise<LessonPlayback> {
  try {
    const d = await api<PlaybackData>(`/lessons/${idSeg(lessonId)}/playback`);
    const kind = d.type ?? d.provider;
    if (kind === 'hls' && /^https?:\/\//i.test(d.url)) {
      const expiresAt = Date.parse(d.expires_at ?? '');
      if (!Number.isNaN(expiresAt)) return { ok: true, provider: 'hls', url: d.url, watermark: d.watermark ?? '', expiresAt };
    }
    const url = kind === 'url' ? mediaUrl(d.url) : null;
    if (url && /^https?:\/\//i.test(url)) return { ok: true, provider: 'url', url };
    return { ok: false, status: 404, message: 'This video is not available.' };
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0;
    // not in legacy: 409 `video_processing` while an upload is transcoded, `video_failed` when it couldn't be.
    if (status === 409) {
      const failed = e instanceof ApiError && e.code === 'video_failed';
      return { ok: false, status, code: failed ? 'video_failed' : 'video_processing', message: failed ? FAILED_MESSAGE : PROCESSING_MESSAGE };
    }
    const code = e instanceof ApiError ? e.code : undefined;
    // not in legacy: strict playback protection caps sessions per user (API 429 `playback_limit`).
    if (status === 429 && code === 'playback_limit') {
      return { ok: false, status, code, message: 'Too many plays in a short time. Try again later.' };
    }
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
    return { ok: false, status, code, message };
  }
}
