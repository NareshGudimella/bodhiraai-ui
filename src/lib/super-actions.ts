'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, apiEnvelope } from './api';
import { failure, forwardForm, type FormState } from './action-result';
import { idSeg } from '@/lib/api-path';
import { setFlash } from './flash';

const SCHOOL_FIELDS = [
  'name', 'email', 'phone', 'city', 'state', 'country', 'plan', 'plan_expires_at',
  'max_teachers', 'max_students', 'ai_daily_token_limit',
];

const pick = (form: FormData, fields: string[]) =>
  Object.fromEntries(fields.map((f) => [f, typeof form.get(f) === 'string' ? form.get(f) : null]));

/**
 * The legacy web school form (multipart): text fields, the ticked syllabi and
 * the logo when one was chosen. As in legacy, with no box ticked nothing is
 * sent, so an edit keeps the school's current syllabi.
 */
function schoolForm(form: FormData, extra: string[] = []) {
  const out = forwardForm(form, [...SCHOOL_FIELDS, ...extra], 'logo');
  for (const id of form.getAll('syllabi[]')) if (typeof id === 'string') out.append('syllabi[]', id);
  return out;
}

export async function createSchool(_: FormState, form: FormData): Promise<FormState> {
  let id: number;
  try {
    ({ id } = await api<{ id: number }>('/super/schools/web', { body: schoolForm(form, ['code']) }));
  } catch (e) {
    return failure(e, 'Could not create the school.', form);
  }
  redirect(`/super/schools/${id}`);
}

export async function updateSchool(id: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    await api(`/super/schools/${idSeg(id)}/web`, { method: 'POST', body: schoolForm(form) });
    refresh();
    return { ok: true, message: 'School updated.' };
  } catch (e) {
    return failure(e, 'Could not update the school.', form);
  }
}

export async function toggleSchool(id: number) {
  await api(`/super/schools/${idSeg(id)}/toggle`, { method: 'POST' });
  refresh();
}

const SYLLABUS_FIELDS = ['board', 'grade', 'name', 'description', 'sort_order', 'is_active'];

export async function saveSyllabus(id: number | null, _: FormState, form: FormData): Promise<FormState> {
  let target: number;
  try {
    ({ id: target } = id
      ? await api<{ id: number }>(`/super/syllabi/${idSeg(id)}`, { method: 'PATCH', body: pick(form, SYLLABUS_FIELDS) })
      : await api<{ id: number }>('/super/syllabi', { body: pick(form, SYLLABUS_FIELDS) }));
  } catch (e) {
    return failure(e, 'Could not save the syllabus.', form);
  }
  redirect(`/super/syllabi/${target}`);
}

export async function deleteSyllabus(id: number) {
  await api(`/super/syllabi/${idSeg(id)}`, { method: 'DELETE' });
  redirect('/super/syllabi');
}

async function mutate(path: string, method: string, body?: object, form?: FormData): Promise<FormState> {
  try {
    const r = await apiEnvelope(path, { method, body });
    refresh();
    return { ok: true, message: r.message ?? 'Saved.' };
  } catch (e) {
    return failure(e, undefined, form);
  }
}

export async function addSyllabusSubject(syllabusId: number, _: FormState, form: FormData) {
  return mutate(`/super/syllabi/${idSeg(syllabusId)}/subjects`, 'POST', pick(form, ['name', 'icon', 'color', 'description']), form);
}

export async function deleteSyllabusSubject(syllabusId: number, subjectId: number) {
  await mutate(`/super/syllabi/${idSeg(syllabusId)}/subjects/${idSeg(subjectId)}`, 'DELETE');
}

export async function addSyllabusChapter(syllabusId: number, subjectId: number, _: FormState, form: FormData) {
  return mutate(`/super/syllabi/${idSeg(syllabusId)}/subjects/${idSeg(subjectId)}/chapters`, 'POST', pick(form, ['title', 'description']), form);
}

const PLAN_FIELDS = [
  'key', 'audience', 'name', 'tagline', 'description', 'features', 'monthly_price', 'yearly_price',
  'trial_days', 'is_featured', 'is_active', 'sort_order',
];

export async function savePlan(id: number | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    if (id) await api(`/super/plans/${idSeg(id)}`, { method: 'PATCH', body: pick(form, PLAN_FIELDS) });
    else await api('/super/plans', { body: pick(form, PLAN_FIELDS) });
  } catch (e) {
    return failure(e, 'Could not save the plan.', form);
  }
  redirect('/super/plans');
}

export async function togglePlan(id: number) {
  await mutate(`/super/plans/${idSeg(id)}/toggle`, 'POST');
}

export async function deletePlan(id: number) {
  await mutate(`/super/plans/${idSeg(id)}`, 'DELETE');
}

export async function setEnquiryStatus(id: number, _: FormState, form: FormData) {
  return mutate(`/super/enquiries/${idSeg(id)}`, 'PATCH', pick(form, ['status']));
}

// not in legacy: the platform's outgoing-mail settings (/super/mail-settings).
const MAIL_FIELDS = ['mailer', 'host', 'port', 'encryption', 'username', 'password', 'from_address', 'from_name'];

/** Never hand a typed password back to the browser in the refill values. */
function withoutPassword(state: FormState): FormState {
  if (state?.values) delete state.values.password;
  return state;
}

export async function saveMailSettings(_: FormState, form: FormData): Promise<FormState> {
  try {
    await api('/super/mail-settings', { method: 'PUT', body: pick(form, MAIL_FIELDS) });
  } catch (e) {
    return withoutPassword(failure(e, 'Could not save the mail settings.', form));
  }
  await setFlash('Mail settings saved.');
  redirect('/super/mail-settings');
}

export async function sendTestMail(_: FormState, form: FormData): Promise<FormState> {
  try {
    const r = await api<{ sent: boolean; error?: string }>('/super/mail-settings/test', {
      body: pick(form, ['to']),
    });
    const to = String(form.get('to') ?? '');
    return r.sent
      ? { ok: true, message: `Test email sent to ${to}.`, values: { to } }
      : { ok: false, message: `The test email failed: ${r.error ?? 'unknown error'}`, values: { to } };
  } catch (e) {
    return failure(e, 'Could not send the test email.', form);
  }
}
