import 'server-only';
import { load } from './load';
import { idSeg } from '@/lib/api-path';

/** Typed reads for /api/v1/student/* (shapes match bodhiraai-api, i.e. the legacy contract). */

export type Subject = {
  id: number;
  name: string;
  slug: string;
  grade: string | null;
  icon: string | null;
  color: string | null;
  description: string | null;
  chapters_count?: number;
  /** Not in legacy: per-subject completion (the lessons total feeds the subject cards). */
  completion?: { lessons_total: number; lessons_completed: number; percent: number };
};

export type Chapter = {
  id: number;
  subject_id: number;
  title: string;
  description: string | null;
  sort_order: number;
  lessons_count?: number;
};

export type Lesson = {
  id: number;
  chapter_id: number;
  title: string;
  type: 'video' | 'pdf' | 'text' | string;
  thumbnail: string | null;
  content_url: string | null;
  content_body?: string | null;
  duration_sec: number;
  duration_label: string;
  is_free: boolean;
  sort_order: number;
  chapter?: { id: number; title: string; subject: { id: number; name: string; icon: string | null } | null };
};

export type Sibling = { id: number; title: string; type: string; sort_order: number; duration_sec: number };

export type Progress = { status: string; watched_seconds: number; progress_percent: number };

export type QuizState = {
  completed_ids: number[];
  all_completed: boolean;
  quiz: {
    id: number;
    title: string;
    duration_min: number;
    total_marks: number;
    pass_marks: number;
    questions_count: number;
  } | null;
  attempt: { id: number; score: number; total_marks: number; passed: boolean } | null;
};

export type QuizSummary = {
  id: number;
  title: string;
  subject: string | null;
  chapter: string | null;
  duration_min: number;
  total_marks: number;
  questions_count: number;
};

export type Question = {
  id: number;
  body: string;
  type: string;
  marks: number;
  options?: { key?: string; value?: string; text?: string }[];
};

export type Quiz = {
  id: number;
  title: string;
  description: string | null;
  duration_min: number;
  total_marks: number;
  pass_marks: number;
  subject?: { id: number; name: string; icon: string | null } | null;
  chapter?: { id: number; title: string } | null;
  questions?: Question[];
};

export type BadgeView = {
  key: string;
  title: string;
  icon: string;
  tier: string;
  tier_label: string;
  colors: string[];
  glow: string;
  xp: number;
  desc: string;
  earned: boolean;
  earned_at: string | null;
};

export type Dashboard = {
  student: { id: number; name: string; grade: string | null; avatar: string | null; school: string | null };
  stats: {
    streak_days: number;
    subjects_count: number;
    xp: number;
    lessons_completed: number;
    lessons_total: number;
    completion_percent: number;
    lessons_today: number;
    level: number;
    next_level_xp: number;
    xp_to_next: number;
    level_percent: number;
  };
  performance: {
    overall_score: number;
    quizzes_taken: number;
    assignments_done: number;
    assignments_total: number;
    tests_passed: number;
    tests_total: number;
    subject_scores: { name: string; color: string; icon: string; percent: number }[];
  };
  profile_completion_percent: number;
  continue_learning: {
    lesson_id: number;
    title: string;
    subject: string | null;
    chapter: string | null;
    type: string;
    progress_percent: number;
    last_viewed_at: string | null;
  }[];
  subjects: Subject[];
  upcoming_quizzes: QuizSummary[];
};

export type AttemptResult = {
  id: number;
  status: string;
  score: number;
  total_marks: number;
  percent: number;
  passed: boolean;
  submitted_at: string | null;
  quiz: Quiz;
  answers: {
    question_id: number;
    body: string;
    type?: string;
    options: Question['options'] | null;
    /** Old rows hold `{"selected_option_ids": [...]}` instead of a plain list. */
    answer: string[] | { selected_option_ids?: string[] } | string | null;
    correct_answer: string[] | null;
    explanation: string | null;
    is_correct: boolean;
    marks: number;
    marks_awarded: number;
  }[];
};

export type TokenStatus = { limit: number; used: number; remaining: number; percent: number };

export type AiSessionSummary = {
  id: number;
  title: string | null;
  mode: string;
  messages_count: number;
  last_message_at: string | null;
  updated_at?: string | null;
};

export type AiMessage = { id: number; role: 'user' | 'assistant'; content: string; created_at: string | null };

export type LiveClass = {
  id: number;
  title: string;
  scheduled_at: string;
  duration_min: number;
  host_name: string | null;
  live_status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  subject_id: number | null;
  description?: string | null;
  provider?: string;
  meeting_url?: string | null;
  subject?: string | null;
};

export type Submission = {
  id: number;
  status: string;
  note: string | null;
  file_url: string | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
};

export type StudentAssignment = {
  id: number;
  title: string;
  subject: string | null;
  class: string;
  due_date: string | null;
  max_marks: number;
  status: string;
  submission: Submission | null;
};

const get = load;

export type ProfileAttempt = {
  id: number;
  quiz_id: number;
  title: string | null;
  subject: string | null;
  score: number;
  total_marks: number;
  percent: number;
  passed: boolean;
  pass_marks: number | null;
  submitted_at: string | null;
};

export type StudentProfile = {
  student: {
    name: string;
    email: string | null;
    phone: string | null;
    grade: string | null;
    avatar: string | null;
    created_at: string | null;
    school: { name: string } | null;
  };
  lessons_completed: number;
  quizzes_attempted: number;
  avg_score_percent: number;
  streak_days: number;
  xp: number;
  achievements: { id: number; title: string; icon: string | null; earned_at: string }[];
  attempts: ProfileAttempt[];
  attendance: {
    total: number;
    present: number;
    late: number;
    excused: number;
    absent: number;
    percent: number;
    recent: { date: string; status: string }[];
    records: Record<string, string>;
  };
  ai_usage: {
    sessions: number;
    messages: number;
    tokens: number;
    remaining: number;
    limit: number;
    used_percent: number;
    subject_count: number;
    other_count: number;
    subject_pct: number;
    other_pct: number;
  };
  badges_count: number;
  board: string | null;
  syllabus: string | null;
  is_individual: boolean;
  school_name: string | null;
  level: number;
  next_level_xp: number;
  xp_to_next: number;
  level_percent: number;
};

export const studentApi = {
  access: () => get<{ has_access: boolean }>('/student/access'),
  home: () => get<Dashboard>('/student/home'),
  profile: () => get<StudentProfile>('/student/profile'),
  badges: () =>
    get<{ badges: BadgeView[]; earned_count: number; total: number; total_xp: number; completion_percent: number }>(
      '/student/badges',
    ),
  subjects: () => get<Subject[]>('/student/subjects'),
  subject: (id: string) => get<{ subject: Subject; chapters: Chapter[] }>(`/student/subjects/${idSeg(id)}`),
  chapterLessons: (id: string) =>
    get<{ chapter: { id: number; title: string; subject_id: number }; lessons: Lesson[]; quiz_state: QuizState }>(
      `/student/chapters/${idSeg(id)}/lessons`,
    ),
  lesson: (id: string) =>
    get<{ lesson: Lesson; progress: Progress; siblings: Sibling[] }>(
      `/student/lessons/${idSeg(id)}`,
    ),
  quizzes: () => get<QuizSummary[]>('/student/quizzes'),
  quiz: (id: string) => get<Quiz>(`/student/quizzes/${idSeg(id)}`),
  attempt: (id: string) => get<AttemptResult>(`/student/attempts/${idSeg(id)}`),
  aiSessions: () => get<AiSessionSummary[]>('/student/ai/sessions'),
  aiSession: (id: string | number) =>
    get<{ session: { id: number; title: string | null }; messages: AiMessage[] }>(`/student/ai/sessions/${idSeg(id)}`),
  aiTokens: () => get<TokenStatus>('/student/ai/tokens'),
  aiRecommendations: () =>
    get<{
      weak_areas: { subject_id: number; subject: string; icon: string | null; avg_percent: number; suggestion: string }[];
      next_lesson: { id: number; title: string; subject: string | null; chapter: string | null } | null;
    }>('/student/ai/recommendations'),
  liveClasses: () => get<{ live_now: LiveClass[]; upcoming: LiveClass[]; past: LiveClass[] }>('/student/live-classes'),
  liveClass: (id: string) => get<LiveClass>(`/student/live-classes/${idSeg(id)}`),
  assignments: () => get<StudentAssignment[]>('/student/assignments'),
  assignment: (id: string) =>
    get<{
      assignment: {
        id: number;
        title: string;
        description: string | null;
        attachment_url: string | null;
        subject: string | null;
        class: string;
        teacher: string | null;
        due_date: string | null;
        max_marks: number;
      };
      status: string;
      submission: Submission | null;
    }>(`/student/assignments/${idSeg(id)}`),
};
