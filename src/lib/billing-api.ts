import 'server-only';
import type { PageMeta } from './admin-api';
import { api, apiEnvelope } from './api';
import { load } from './load';
import type { Plan, SchoolModel } from './super-api';
import { idSeg } from '@/lib/api-path';

export type { Plan };

export type Subscription = {
  id: number;
  subscribable_id: number;
  plan: string;
  status: string;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  meta: Record<string, unknown> | null;
};

export type Invoice = {
  id: number;
  number: string;
  plan_name: string;
  cycle: string;
  amount_paise: number;
  tax_paise: number;
  total_paise: number;
  tax_rate_bps: number;
  currency: string;
  status: string;
  issued_at: string;
  paid_at: string | null;
  pdf_path: string | null;
  email_sent_at: string | null;
  billing_name: string | null;
  billing_email: string | null;
};

export type Payment = {
  id: number;
  school_id: number;
  gateway: string;
  plan: string;
  amount_paise: number;
  currency: string;
  status: string;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
  school?: { id: number; name: string } | null;
};

/** SuperAdminService::INDIVIDUAL_PLANS, as the paywall gets them. */
export type IndividualPlan = { name: string; tagline: string; features: string[]; monthly: number; yearly: number };

export type CheckoutSummary = {
  subscription: Subscription;
  plan: Plan;
  cycle: 'monthly' | 'yearly';
  amount_paise: number;
  tax_paise: number;
  total_paise: number;
  tax_rate_pct: number;
  gateway: string;
  demo_mode: boolean;
  key_id: string | null;
  order_id: string | null;
};

export type SignupOptions = {
  syllabi: { board: string; syllabi: { id: number; board: string; grade: string; name: string }[] }[];
  plan: Plan | null;
  cycle: 'monthly' | 'yearly';
};

export const billingApi = {
  /** Public: no session token. */
  pricing: () => api<{ individual: Plan[]; school: Plan[] }>('/pricing', { token: null }),
  signupOptions: (plan: string, cycle: string) =>
    api<SignupOptions>(
      `/auth/register/student?${new URLSearchParams({ plan, cycle })}`,
      { token: null },
    ),
  paywall: () =>
    api<{
      subscription: (Subscription & { in_trial: boolean; days_remaining: number }) | null;
      plans: Record<string, IndividualPlan>;
    }>('/billing/paywall'),
  /** Throws ApiError 422 (`no_plan`) when the subscription has no plan to pay for. */
  checkout: (id: string, cycle: string) =>
    api<CheckoutSummary>(`/billing/checkout/${idSeg(id)}?${new URLSearchParams({ cycle })}`),
  invoice: (id: string) => load<Invoice>(`/billing/invoices/${idSeg(id)}`),
  school: () =>
    load<{
      school: SchoolModel | null;
      payments: Payment[];
      pricing: Record<string, number>;
      gateway: string;
      configured: boolean;
      students_used: number;
    }>('/admin/billing'),
  payments: async (params: URLSearchParams) => {
    const { data, meta } = await apiEnvelope<Payment[]>(`/super/billing?${params}`);
    return { payments: data, meta: meta as PageMeta };
  },
};
