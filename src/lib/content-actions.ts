'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, apiEnvelope, ApiError } from './api';
import { failure, forwardForm, type FormState } from './action-result';
import { idSeg } from '@/lib/api-path';
import { isSignedFileUrl } from './signed-file';

/** Server Actions for the super admin content library (/content). */

const pick = (form: FormData, fields: string[]) =>
  Object.fromEntries(fields.map((f) => [f, typeof form.get(f) === 'string' ? form.get(f) : null]));

async function mutate(path: string, method: string, body: object | FormData | undefined, form?: FormData): Promise<FormState> {
  try {
    const r = await apiEnvelope(path, { method, body });
    refresh();
    return { ok: true, message: r.message ?? 'Saved.' };
  } catch (e) {
    return failure(e, undefined, form);
  }
}

export async function createChapter(subjectId: number, _: FormState, form: FormData) {
  return mutate(`/content/subjects/${idSeg(subjectId)}/chapters`, 'POST', pick(form, ['title', 'description', 'sort_order', 'is_published']), form);
}

export async function deleteChapter(chapterId: number, subjectId: number) {
  await api(`/content/chapters/${idSeg(chapterId)}`, { method: 'DELETE' });
  redirect(`/content/subjects/${subjectId}`);
}

const LESSON_FIELDS = ['title', 'type', 'content_url', 'content_body', 'thumbnail', 'thumbnail_data', 'duration_sec', 'is_free', 'is_published'];

/**
 * Multipart: the media file and thumbnail go only when chosen. A signed link to
 * our own file pasted back into a URL field is dropped (the field then keeps
 * the current file), never saved as an external link; the API also refuses it.
 * security: not in legacy
 */
function lessonForm(form: FormData, extra: string[] = []) {
  const out = forwardForm(form, [...LESSON_FIELDS, ...extra], 'content_file');
  for (const k of ['content_url', 'thumbnail']) if (isSignedFileUrl(out.get(k) as string | null)) out.delete(k);
  const thumb = form.get('thumbnail_file');
  if (thumb instanceof File && thumb.size > 0 && thumb.name) out.set('thumbnail_file', thumb, thumb.name);
  return out;
}

/** Text fields to refill after a failed submit (never the large data URL). */
const keep = (form: FormData) => {
  const f = new FormData();
  for (const [k, v] of form.entries()) if (typeof v === 'string' && k !== 'thumbnail_data') f.set(k, v);
  return f;
};

export async function createLesson(chapterId: number, _: FormState, form: FormData) {
  return mutate(`/content/chapters/${idSeg(chapterId)}/lessons`, 'POST', lessonForm(form), keep(form));
}

export async function updateLesson(lessonId: number, chapterId: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    await api(`/content/lessons/${idSeg(lessonId)}`, { method: 'PATCH', body: lessonForm(form, ['sort_order']) });
  } catch (e) {
    return failure(e, 'Could not save the lesson.', keep(form));
  }
  redirect(`/content/chapters/${chapterId}`);
}

/**
 * Video upload through the API (docs/video-hls-contract.md, "Upload through the API on AWS"): the browser can't hold the
 * API token, so the small JSON calls go through here. The file itself goes from the browser to the API's own host.
 * They return errors instead of throwing, since production hides thrown messages from the client.
 */
export type SaveResult = { id: number } | { error: FormState };

/** Saves the lesson fields without the file: creates the lesson (chapterId) or patches it (lessonId). */
export async function saveLessonFields(chapterId: number, lessonId: number | null, form: FormData): Promise<SaveResult> {
  try {
    if (lessonId) {
      await api(`/content/lessons/${idSeg(lessonId)}`, { method: 'PATCH', body: lessonForm(form, ['sort_order']) });
      return { id: lessonId };
    }
    const r = await api<{ id: number }>(`/content/chapters/${idSeg(chapterId)}/lessons`, { method: 'POST', body: lessonForm(form) });
    return { id: r.id };
  } catch (e) {
    return { error: failure(e, 'Could not save the lesson.', keep(form)) };
  }
}

export type VideoUpload = { mode: 'stream'; upload_url: string; expires_at: string } | { mode: 'multipart' };

/** Forwards the size and type check to the API; `stream` gives the browser a token URL on the API's own host. */
export async function startLessonVideoUpload(lessonId: number, file: { filename: string; size: number; content_type: string }): Promise<{ data: VideoUpload } | { message: string }> {
  try {
    return { data: await api<VideoUpload>(`/content/lessons/${idSeg(lessonId)}/video-upload`, { method: 'POST', body: file }) };
  } catch (e) {
    return { message: e instanceof ApiError ? e.message : 'Could not start the upload.' };
  }
}

export async function deleteLesson(lessonId: number, chapterId: number) {
  await api(`/content/lessons/${idSeg(lessonId)}`, { method: 'DELETE' });
  redirect(`/content/chapters/${chapterId}`);
}

const QUIZ_FIELDS = ['title', 'description', 'subject_id', 'chapter_id', 'duration_min', 'pass_marks'];

export async function createQuiz(_: FormState, form: FormData): Promise<FormState> {
  let id: number;
  try {
    ({ id } = await api<{ id: number }>('/content/quizzes', { body: pick(form, QUIZ_FIELDS.filter((f) => f !== 'chapter_id')) }));
  } catch (e) {
    return failure(e, 'Could not create the quiz.', form);
  }
  redirect(`/content/quizzes/${id}`);
}

export async function updateQuiz(quizId: number, _: FormState, form: FormData) {
  return mutate(`/content/quizzes/${idSeg(quizId)}`, 'PATCH', pick(form, [...QUIZ_FIELDS, 'is_published']), form);
}

export async function addQuestion(quizId: number, _: FormState, form: FormData) {
  const body = {
    ...pick(form, ['body', 'type', 'marks', 'correct_answer', 'explanation']),
    options: form.getAll('options[]').filter((v): v is string => typeof v === 'string'),
  };
  return mutate(`/content/quizzes/${idSeg(quizId)}/questions`, 'POST', body, form);
}

export async function deleteQuestion(questionId: number) {
  await mutate(`/content/questions/${idSeg(questionId)}`, 'DELETE', undefined);
}
