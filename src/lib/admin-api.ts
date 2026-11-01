import 'server-only';
import { apiEnvelope } from './api';
import { load } from './load';
import { idSeg } from '@/lib/api-path';

/** Typed reads for /api/v1/admin/* (legacy contract plus the two web helpers). */

export type PageMeta = { current_page: number; per_page: number; total: number; last_page: number };

export type AdminUserRow = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  grade: string | null;
  status: string;
  avatar: string | null;
};

export type AdminUser = AdminUserRow & { username: string | null; gender: string | null; dob: string | null };

export type AdminSubject = {
  id: number;
  name: string;
  slug: string;
  grade: string | null;
  icon: string | null;
  color: string | null;
  description: string | null;
  is_active: boolean;
  chapters_count: number;
};

/** GET /admin/content: published Super Admin curricula the school uses (plus its own subjects). not in legacy */
export type AdminContentLesson = {
  id: number;
  title: string;
  type: string;
  duration_sec: number;
  playback: 'vdocipher' | 'url' | null;
  /** Signed link (expires): plain `<img>`, never cached. */
  thumbnail: string | null;
};
export type AdminContent = {
  syllabi: {
    /** Null for the last group: the school's own subjects outside any used curriculum. */
    id: number | null;
    name: string;
    subjects: {
      id: number;
      name: string;
      grade: string | null;
      chapters: { id: number; title: string; lessons: AdminContentLesson[] }[];
    }[];
  }[];
};

export const adminApi = {
  home: () =>
    load<{
      admin: { name: string; school: string | null; school_code: string | null };
      stats: {
        students: number;
        teachers: number;
        parents: number;
        classes: number;
        subjects: number;
        attendance_percent: number;
        active_assignments: number;
      };
      recent_signups: { id: number; name: string; role_label: string | null; created_at: string | null }[];
      recent_attempts: { student: string | null; quiz: string | null; subject: string | null; percent: number; submitted_at: string | null }[];
    }>('/admin/home'),
  users: async (params: URLSearchParams) => {
    const { data, meta } = await apiEnvelope<AdminUserRow[]>(`/admin/users?${params}`);
    return { users: data, meta: meta as PageMeta };
  },
  /** Seat usage vs the school's caps (null without a school). */
  seats: () =>
    load<{ teachers_used: number; teachers_max: number; students_used: number; students_max: number } | null>('/admin/users/seats'),
  user: (id: string) => load<AdminUser>(`/admin/users/${idSeg(id)}`),
  classes: () =>
    load<
      {
        id: number;
        label: string;
        academic_year: string | null;
        class_teacher: string | null;
        students_count: number;
        subjects_count: number;
      }[]
    >('/admin/classes'),
  class: (id: string) =>
    load<{
      class: { id: number; label: string; academic_year: string | null; class_teacher: string | null };
      students: { id: number; name: string; roll_no: string | null; grade: string | null; avatar: string | null }[];
      subjects: { id: number; name: string; teacher_id: number | null; icon: string | null; grade: string | null }[];
    }>(`/admin/classes/${idSeg(id)}`),
  classOptions: (id: string) =>
    load<{
      available_students: { id: number; name: string; grade: string | null }[];
      available_subjects: { id: number; name: string; grade: string | null }[];
      teachers: { id: number; name: string }[];
    }>(`/admin/classes/${idSeg(id)}/options`),
  subjects: () => load<AdminSubject[]>('/admin/subjects'),
  content: () => load<AdminContent>('/admin/content'),
  analytics: () =>
    load<{
      classes: { id: number; label: string; students: number; attendance_percent: number; avg_quiz_percent: number }[];
      attendance_trend: { date: string; percent: number }[];
      totals: { lessons_completed: number; quiz_attempts: number; avg_quiz_percent: number };
    }>('/admin/analytics'),
  links: (id: string) =>
    load<{
      links: { id: number; name: string; role: string; pivot: { relation: string | null } }[];
      linkable: { id: number; name: string; grade?: string | null; phone?: string | null }[];
    }>(`/admin/users/${idSeg(id)}/links`),
  syllabi: () =>
    load<{
      school: { id: number; name: string };
      syllabi: { id: number; board: string; grade: string; name: string; description: string | null; subjects_count: number }[];
      opted_ids: number[];
    }>('/admin/syllabi'),
};
