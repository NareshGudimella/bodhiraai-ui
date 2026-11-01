import 'server-only';
import { load } from './load';
import { idSeg } from '@/lib/api-path';

/** Typed reads for /api/v1/parent/* (legacy contract). */

export type ChildStats = {
  attendance_total: number;
  attendance_present: number;
  attendance_percent: number;
  quizzes_attempted: number;
  avg_quiz_percent: number;
  pending_assignments: number;
  lessons_started: number;
  lessons_completed: number;
};

export type Student = { id: number; name: string; grade: string | null; avatar: string | null };

export const parentApi = {
  /** Linked children (sidebar). `avatar` is not in legacy. */
  children: () =>
    load<{ id: number; name: string; grade: string | null; relation: string | null; avatar?: string | null }[]>(
      '/parent/children',
    ),
  home: () =>
    load<{
      parent: { name: string; children_count: number };
      children: {
        id: number;
        name: string;
        grade: string | null;
        avatar_letter: string;
        /** Not in legacy: the child's photo path. */
        avatar?: string | null;
        relation: string | null;
        school: string | null;
        stats: ChildStats;
      }[];
      /** `child_id` is not in legacy. */
      alerts: { type: string; child: string; child_id?: number; message: string }[];
    }>('/parent/home'),
  child: (id: string) =>
    load<{
      student: Student & { school: { name: string } | null };
      stats: ChildStats;
      recent_lessons: { title: string | null; subject: string | null; status: string; progress: number; last_viewed_at: string | null }[];
      recent_quizzes: { title: string | null; subject: string | null; score: number; total: number; percent: number; submitted_at: string | null }[];
    }>(`/parent/children/${idSeg(id)}`),
  attendance: (id: string, month?: string) =>
    load<{
      student: Student;
      month: string;
      month_label: string;
      totals: { present: number; absent: number; late: number; excused: number; total: number; percent: number };
      records: { date: string; date_label: string; status: string; remarks: string | null }[];
    }>(`/parent/children/${idSeg(id)}/attendance${month ? `?month=${encodeURIComponent(month)}` : ''}`),
  performance: (id: string) =>
    load<{
      student: Student;
      by_subject: {
        subject_id: number;
        subject: string;
        icon: string | null;
        attempts: number;
        avg_percent: number;
        highest: number;
        rating: 'strong' | 'fair' | 'weak';
      }[];
      progress: { subject: string; started: number; completed: number }[];
      overall_avg: number;
    }>(`/parent/children/${idSeg(id)}/performance`),
  assignments: (id: string) =>
    load<{
      student: Student;
      assignments: {
        id: number;
        title: string;
        subject: string | null;
        class: string | null;
        due_date: string | null;
        max_marks: number;
        status: string;
        score: number | null;
        feedback: string | null;
        submitted_at: string | null;
      }[];
      totals: { total: number; graded: number; submitted: number; pending: number; missed: number };
    }>(`/parent/children/${idSeg(id)}/assignments`),
};
