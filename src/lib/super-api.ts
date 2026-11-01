import 'server-only';
import { apiEnvelope } from './api';
import { load } from './load';
import type { PageMeta } from './admin-api';
import { idSeg } from '@/lib/api-path';

/** Typed reads for /api/v1/super/* (legacy contract). */

export type SchoolRow = {
  id: number;
  name: string;
  code: string;
  email: string | null;
  plan: string;
  status: string;
  users_count: number;
  classes_count: number;
  city: string | null;
  state: string | null;
  plan_expires_at: string | null;
};

export type SchoolModel = {
  id: number;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  plan: string;
  status: string;
  created_at: string | null;
  plan_expires_at: string | null;
  max_teachers: number;
  max_students: number;
  ai_daily_token_limit: number;
  logo: string | null;
  settings: { theme?: Record<string, string> } | null;
};

export type Syllabus = {
  id: number;
  board: string;
  grade: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Plan = {
  id: number;
  key: string;
  audience: 'individual' | 'school';
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[] | null;
  monthly_price: number;
  yearly_price: number;
  trial_days: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  grade: string | null;
  board: string | null;
  city: string | null;
  school_name: string | null;
  message: string | null;
  status: string;
  created_at: string | null;
};

/** not in legacy: the platform's outgoing-mail settings. The password is write-only. */
export type MailSettings = {
  source: 'database' | 'env';
  mailer: 'smtp' | 'log';
  host: string | null;
  port: number | null;
  encryption: 'tls' | 'ssl' | 'none';
  username: string | null;
  password_set: boolean;
  from_address: string;
  from_name: string | null;
  updated_at: string | null;
};

export const ENQUIRY_STATUSES = ['new', 'contacted', 'enrolled', 'closed'] as const;

export const PLAN_KEYS = ['free', 'starter', 'pro', 'enterprise'] as const;

export const superApi = {
  home: () =>
    load<{
      platform: Record<string, number>;
      growth: { date: string; users: number; attempts: number }[];
      top_schools: { id: number; name: string; code: string; plan: string; users_count: number; classes_count: number; status: string }[];
    }>('/super/home'),
  schools: async (params: URLSearchParams) => {
    const { data, meta } = await apiEnvelope<SchoolRow[]>(`/super/schools?${params}`);
    return { schools: data, meta: meta as PageMeta };
  },
  school: (id: string) =>
    load<{
      school: SchoolModel;
      stats: {
        students: number;
        teachers: number;
        parents: number;
        classes: number;
        subjects: number;
        attendance_percent: number;
        avg_quiz_percent: number;
        mrr: number;
      };
      admins: { id: number; name: string; email: string | null; phone: string | null; status: string }[];
    }>(`/super/schools/${idSeg(id)}`),
  users: async (params: URLSearchParams) => {
    const { data, meta } = await apiEnvelope<
      { id: number; name: string; email: string | null; phone: string | null; role: string; school: string | null; status: string; created_at: string | null }[]
    >(`/super/users?${params}`);
    return { users: data, meta: meta as PageMeta };
  },
  revenue: () =>
    load<{
      mrr: number;
      arr: number;
      by_plan: { plan: string; count: number; price: number; mrr_contribution: number }[];
      by_status: { active: number; inactive: number; suspended: number };
      expiring_soon: { id: number; name: string; plan: string; plan_expires_at: string }[];
    }>('/super/revenue'),
  aiUsage: () =>
    load<{
      totals: { sessions: number; messages: number; tokens: number; avg_messages_per_session: number };
      top_users: { name: string; role: string | null; sessions: number }[];
      engagement_14d: { date: string; sessions: number; lessons: number; attempts: number }[];
    }>('/super/ai-usage'),
  health: () =>
    load<{
      overall: string;
      checks: { name: string; status: string; detail: string | null; latency_ms: number | null }[];
      environment: string;
      node_version?: string;
      app_url?: string | null;
      checked_at: string;
    }>('/super/health'),
  schoolFormOptions: (schoolId?: string) =>
    load<{ syllabi: Syllabus[]; selected: number[]; plan_prices: Record<string, number> }>(
      `/super/schools/form-options${schoolId ? `?school=${schoolId}` : ''}`,
    ),
  syllabi: () => load<(Syllabus & { subjects_count: number; schools_count: number })[]>('/super/syllabi'),
  syllabus: (id: string) =>
    load<{
      syllabus: Syllabus;
      subjects: { id: number; name: string; icon: string | null; color: string | null; description: string | null; chapters_count: number }[];
    }>(`/super/syllabi/${idSeg(id)}`),
  syllabusSubject: (id: string, subjectId: string) =>
    load<{
      syllabus: Syllabus;
      subject: { id: number; name: string; icon: string | null; grade: string | null };
      chapters: { id: number; title: string; description: string | null; is_published: boolean; lessons_count: number }[];
    }>(`/super/syllabi/${idSeg(id)}/subjects/${idSeg(subjectId)}`),
  mailSettings: () => load<MailSettings>('/super/mail-settings'),
  plans: () => load<Plan[]>('/super/plans'),
  plan: (id: string) => load<Plan>(`/super/plans/${idSeg(id)}`),
  enquiries: async (params: URLSearchParams) => {
    const { data, meta } = await apiEnvelope<{ enquiries: Enquiry[]; counts: Record<string, number>; status: string | null }>(
      `/super/enquiries?${params}`,
    );
    return { ...data, meta: meta as PageMeta };
  },
};

export { BOARDS, boardLabel } from './boards';
