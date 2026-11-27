import 'server-only';
import { load } from './load';
import { seg } from '@/lib/api-path';

/** Typed reads for /api/v1/content/* (super admin content library; new endpoints). */

export type ContentSubject = {
  id: number;
  url_slug?: string;
  school_id: number | null;
  syllabus_id: number | null;
  name: string;
  grade: string | null;
  icon: string | null;
  color: string | null;
  description: string | null;
  is_active: boolean;
};

export type ContentChapter = {
  id: number;
  url_slug?: string;
  subject_id: number;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
};

export type ContentLesson = {
  id: number;
  url_slug?: string;
  chapter_id: number;
  title: string;
  type: 'video' | 'pdf' | 'text';
  thumbnail: string | null;
  content_url: string | null;
  /** Our encrypted HLS, `content_url`, or nothing (security: not in legacy); `processing` while an upload is transcoded. */
  playback?: 'hls' | 'url' | 'processing' | null;
  /** not in legacy: `failed` when an uploaded video couldn't be imported (upload it again). */
  video_status?: 'processing' | 'failed' | null;
  content_body: string | null;
  duration_sec: number;
  sort_order: number;
  is_free: boolean;
  is_published: boolean;
};

export type ContentQuiz = {
  id: number;
  slug?: string;
  subject_id: number | null;
  chapter_id: number | null;
  title: string;
  description: string | null;
  duration_min: number;
  total_marks: number;
  pass_marks: number;
  is_published: boolean;
};

export type ContentQuestion = {
  id: number;
  body: string;
  type: 'mcq' | 'tf' | 'short';
  marks: number;
  options: { key: string; text: string }[] | null;
  correct_answer: string[] | null;
  explanation: string | null;
  sort_order: number;
};

export const contentApi = {
  library: () =>
    load<{
      subjects: (ContentSubject & { chapters_count: number; quizzes_count: number })[];
      totals: { subjects: number; chapters: number; lessons: number; quizzes: number };
    }>('/content'),
  subject: (id: string) =>
    load<{ subject: ContentSubject; chapters: (ContentChapter & { lessons_count: number })[] }>(`/content/subjects/${seg(id)}`),
  chapter: (id: string) =>
    load<{ chapter: ContentChapter & { subject: ContentSubject; lessons: ContentLesson[] } }>(`/content/chapters/${seg(id)}`),
  lesson: (id: string) =>
    load<{ lesson: ContentLesson & { chapter: ContentChapter & { subject: ContentSubject } } }>(`/content/lessons/${seg(id)}`),
  quizzes: () =>
    load<{
      subjects: ContentSubject[];
      quizzes: (ContentQuiz & { questions_count: number; subject: ContentSubject | null; chapter: ContentChapter | null })[];
    }>('/content/quizzes'),
  quiz: (id: string) =>
    load<{ quiz: ContentQuiz & { questions: ContentQuestion[] }; subjects: ContentSubject[]; chapters: ContentChapter[] }>(
      `/content/quizzes/${seg(id)}`,
    ),
};
