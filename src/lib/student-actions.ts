'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, ApiError } from './api';
import { failure, forwardForm, type FormState } from './action-result';
import { paywallOn402 } from './load';
import { mediaUrl } from './media';
import type { AiMessage, Lesson, Progress, Quiz, TokenStatus } from './student-api';
import { idSeg } from '@/lib/api-path';

/**
 * Server Actions used by the student client components. The API token never
 * reaches the browser. A 402 (plan lapsed mid-session) redirects to /paywall
 * (`paywallOn402`), as legacy's `subscribed` middleware does.
 */

export async function saveProgress(lessonId: number, watchedSeconds: number, completed?: boolean) {
  try {
    return await api<Progress>(`/student/lessons/${idSeg(lessonId)}/progress`, {
      body: { watched_seconds: Math.max(0, Math.floor(watchedSeconds)), ...(completed && { completed: true }) },
    });
  } catch (e) {
    paywallOn402(e);
    return null;
  }
}

export async function startQuiz(quizId: number) {
  try {
    return await api<{ attempt: { id: number; status: string; started_at: string | null }; quiz: Quiz }>(
      `/student/quizzes/${idSeg(quizId)}/start`,
      { method: 'POST' },
    );
  } catch (e) {
    paywallOn402(e);
    throw e;
  }
}

export type Celebration = {
  headline: { key: string; title: string; icon: string; tier: string; xp: number; desc: string };
  badges: { key: string; title: string; icon: string; tier: string; xp: number; desc: string }[];
  xp: number;
  score_percent: number;
  progress: { level: number; from: number; to: number };
};

export type SubmitResult =
  | { ok: true; attemptId: number; percent: number; celebration: Celebration | null }
  | { ok: false; message: string };

/** Records every answer, then submits (the legacy web form did the same in one POST). */
export async function submitQuiz(attemptId: number, answers: Record<number, string>): Promise<SubmitResult> {
  try {
    for (const [questionId, value] of Object.entries(answers)) {
      await api(`/student/attempts/${idSeg(attemptId)}/answer`, {
        body: { question_id: Number(questionId), answer: [value] },
      });
    }
    const result = await api<{ attempt_id: number; percent: number; celebration: Celebration | null }>(
      `/student/attempts/${idSeg(attemptId)}/submit`,
      { method: 'POST' },
    );
    return { ok: true, attemptId: result.attempt_id, percent: result.percent, celebration: result.celebration };
  } catch (e) {
    paywallOn402(e);
    return { ok: false, message: e instanceof ApiError ? e.message : 'Could not submit the quiz. Try again.' };
  }
}

export type AiResult =
  | { ok: true; sessionId: number; messages: AiMessage[]; tokens: TokenStatus }
  /** `status`: the API's (0 when it couldn't be reached), so the chat can offer a retry. */
  | { ok: false; status: number; message: string; tokens?: TokenStatus };

/**
 * A failed tutor call as an inline message instead of an error page. 402 goes
 * to /paywall. 429 (the API's per-user rate limit) and 5xx get a friendly
 * message; the API's own message is kept for validation errors (422) and the
 * like. not in legacy (legacy's tutor shows the raw error text).
 */
function aiFailure(e: unknown): AiResult {
  paywallOn402(e);
  const status = e instanceof ApiError ? e.status : 0;
  const message =
    status === 429
      ? 'Too many requests. Please wait a moment and try again.'
      : status === 0 || status >= 500
        ? 'The tutor is unavailable right now. Please try again in a moment.'
        : e instanceof ApiError
          ? e.message
          : 'The tutor is unavailable. Try again.';
  return { ok: false, status, message };
}

/** Start a conversation, optionally with a first question (POST /student/ai/sessions). */
export async function aiStart(body: string): Promise<AiResult> {
  try {
    const r = await api<{ session: { id: number }; messages: AiMessage[]; tokens: TokenStatus }>(
      '/student/ai/sessions',
      { body: { body } },
    );
    return { ok: true, sessionId: r.session.id, messages: r.messages, tokens: r.tokens };
  } catch (e) {
    return aiFailure(e);
  }
}

/** Ask a follow-up question in an existing conversation. */
export async function aiReply(sessionId: number, body: string): Promise<AiResult> {
  try {
    const r = await api<{ user: AiMessage; assistant: AiMessage; tokens: TokenStatus }>(
      `/student/ai/sessions/${idSeg(sessionId)}/messages`,
      { body: { body } },
    );
    return { ok: true, sessionId, messages: [r.user, r.assistant], tokens: r.tokens };
  } catch (e) {
    return aiFailure(e);
  }
}

/** Submit (or resubmit) an assignment: optional note and file (multipart). */
export async function submitAssignment(assignmentId: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    await api(`/student/assignments/${idSeg(assignmentId)}/submit`, { body: forwardForm(form, ['note'], 'file') });
    refresh();
    return { ok: true, message: 'Submission saved.' };
  } catch (e) {
    paywallOn402(e);
    return failure(e, 'Could not submit. Try again.', form);
  }
}

/**
 * "Ask AI" buttons on a lesson (legacy student.ai.start): open a conversation with a
 * first question, then show it. A spent allowance or an API error lands on the AI page,
 * which shows the token meter.
 */
export async function askAi(body: string): Promise<void> {
  let target = '/student/ai';
  try {
    const r = await api<{ session: { id: number } }>('/student/ai/sessions', { body: { body } });
    target = `/student/ai/${r.session.id}`;
  } catch (e) {
    paywallOn402(e);
    // otherwise fall through to /student/ai
  }
  redirect(target);
}

/**
 * A fresh signed link to a lesson's file (`content_url`), for the PDF viewer
 * when the one the page rendered with expires (30 min). Null when the lesson
 * can't be read or has no file. security: not in legacy (legacy links never
 * expire)
 */
export async function lessonFileUrl(lessonId: number): Promise<string | null> {
  try {
    const { lesson } = await api<{ lesson: Lesson }>(`/student/lessons/${idSeg(lessonId)}`);
    return mediaUrl(lesson.content_url);
  } catch (e) {
    paywallOn402(e);
    return null;
  }
}
