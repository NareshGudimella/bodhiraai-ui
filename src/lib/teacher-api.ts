import 'server-only';
import { load } from './load';
import type { LiveClass } from './student-api';
import { idSeg } from '@/lib/api-path';

/** Typed reads for /api/v1/teacher/* (legacy contract). */

export type ClassSummary = {
  id: number;
  label: string;
  grade: string;
  section: string;
  students_count: number;
  academic_year: string | null;
  /** Not in legacy's API. */
  class_teacher: string | null;
};

type UserRow = {
  id: number;
  name: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  dob: string | null;
  status: string;
};

export type ClassDetail = {
  class: {
    id: number;
    grade: string;
    section: string;
    academic_year: string | null;
    students: (UserRow & { pivot: { roll_no: string | null } })[];
    subjects: { id: number; name: string; icon: string | null; pivot: { teacher_id: number | null } }[];
    class_teacher: UserRow | null;
  };
  stats: { students: number; subjects: number; attendance_percent: number; assignments_count: number };
  assignments: { id: number; title: string; due_date: string | null; max_marks: number; is_published: boolean }[];
  recent_scores: { student: string | null; score: number; total: number; percent: number; submitted_at: string | null }[];
};

export type AttendanceSheet = {
  class: { id: number; grade: string; section: string };
  date: string;
  records: { student_id: number; name: string; roll_no: string | null; status: string | null }[];
};

export type AssignmentRow = {
  id: number;
  title: string;
  class: string | null;
  subject: string | null;
  due_date: string | null;
  max_marks: number;
  submissions_count: number;
  is_published: boolean;
};

export type AssignmentDetail = {
  assignment: {
    id: number;
    title: string;
    description: string | null;
    attachment_url: string | null;
    due_date: string | null;
    max_marks: number;
    klass: { grade: string; section: string };
    subject: { name: string } | null;
    submissions: { id: number; note: string | null; file_url: string | null; feedback: string | null; student_id: number }[];
  };
  roster: {
    student_id: number;
    name: string;
    submission_id: number | null;
    status: string;
    score: number | null;
    submitted_at: string | null;
    graded: boolean;
  }[];
};

export type QuizRow = {
  id: number;
  title: string;
  subject: string | null;
  chapter: string | null;
  duration_min: number;
  total_marks: number;
  questions_count: number;
  attempts_count: number;
  is_published: boolean;
};

export type QuizAnalytics = {
  quiz: { id: number; title: string; pass_marks: number; total_marks: number; subject: { name: string } | null; chapter: { title: string } | null };
  stats: { attempts: number; avg_percent: number; pass_rate: number; highest: number; lowest: number };
  attempts: { id: number; student: string | null; score: number; total: number; percent: number; submitted_at: string | null }[];
};

export type TeacherLive = LiveClass & {
  status: string;
  class_id: number | null;
  syllabus_id: number | null;
  /** Names and counts below are not in legacy's API. */
  class: string | null;
  audience: { type: 'class' | 'syllabus' | 'school'; label: string };
  attendees_count: number;
  attendees?: { user_id: number; name: string | null; joined_at: string | null }[];
};

export const teacherApi = {
  home: () =>
    load<{
      teacher: { name: string; school: string | null };
      stats: {
        classes_count: number;
        students_count: number;
        pending_grading: number;
        assignments_active: number;
        quizzes_published: number;
        attendance_today: number;
        /** Not in legacy's API. */
        attendance_today_percent: number;
      };
      classes: { id: number; label: string; students_count: number }[];
      recent_submissions: {
        id: number;
        assignment_title: string | null;
        student: string | null;
        class: string | null;
        status: string;
        submitted_at: string | null;
        graded: boolean;
      }[];
    }>('/teacher/home'),
  classes: () => load<ClassSummary[]>('/teacher/classes'),
  class: (id: string) => load<ClassDetail>(`/teacher/classes/${idSeg(id)}`),
  attendance: (id: string, date?: string) =>
    load<AttendanceSheet>(`/teacher/classes/${idSeg(id)}/attendance${date ? `?date=${encodeURIComponent(date)}` : ''}`),
  assignments: () => load<AssignmentRow[]>('/teacher/assignments'),
  assignment: (id: string) => load<AssignmentDetail>(`/teacher/assignments/${idSeg(id)}`),
  quizzes: () => load<QuizRow[]>('/teacher/quizzes'),
  quizAnalytics: (id: string) => load<QuizAnalytics>(`/teacher/quizzes/${idSeg(id)}/analytics`),
  liveClasses: () => load<TeacherLive[]>('/teacher/live-classes'),
  liveClass: (id: string) => load<TeacherLive>(`/teacher/live-classes/${idSeg(id)}`),
  student: (id: string) =>
    load<{
      student: UserRow & { grade: string | null; last_login_at: string | null; school: { name: string } | null };
      stats: {
        attendance_percent: number;
        attendance_present: number;
        attendance_total: number;
        avg_quiz_percent: number;
        quizzes_attempted: number;
        lessons_completed: number;
        lessons_started: number;
        pending_assignments: number;
      };
      recent_lessons: { title: string | null; subject: string | null; status: string; progress: number; last_viewed_at: string | null }[];
      recent_quizzes: { title: string | null; subject: string | null; score: number; total: number; percent: number; submitted_at: string | null }[];
      subjects: { subject_id: number; subject: string; icon: string | null; color: string | null; avg_percent: number; attempts: number; highest: number; rating: string }[];
      overall_avg: number;
      attendance: { month_label: string; totals: { percent: number; present: number; absent: number; late: number; excused: number } };
      ai_activity: { id: number; title: string; mode: string; messages_count: number; last_at: string | null }[];
      parents: { id: number; name: string; avatar: string | null; relation: string | null; phone: string | null; email: string | null }[];
    }>(`/teacher/students/${idSeg(id)}`),
  liveScopes: () =>
    load<{
      classes: { id: number; label: string; students_count: number }[];
      subjects: { id: number; name: string; class_id: number }[];
      syllabi: { id: number; name: string; board: string; grade: string }[];
    }>('/teacher/live-classes/scopes'),
};
