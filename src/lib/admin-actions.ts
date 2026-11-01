'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, apiEnvelope } from './api';
import { failure, type FormState } from './action-result';
import { idSeg } from '@/lib/api-path';

/** Server Actions for the school admin (and super) consoles. JSON endpoints: plain objects. */

/** Only the fields the form actually contains: a missing input must never become a null write. */
const pick = (form: FormData, fields: string[]) =>
  Object.fromEntries(fields.filter((f) => typeof form.get(f) === 'string').map((f) => [f, form.get(f)]));

const USER_FIELDS = ['name', 'email', 'phone', 'username', 'role', 'gender', 'grade', 'dob', 'password'];

export async function saveUser(userId: number | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    if (userId) {
      await api(`/admin/users/${idSeg(userId)}`, { method: 'PATCH', body: pick(form, USER_FIELDS) });
    } else {
      await api('/admin/users', { body: pick(form, USER_FIELDS) });
    }
  } catch (e) {
    const state = failure(e, 'Could not save the user.', form);
    return state && { ...state, values: { ...state.values, password: '' } };
  }
  redirect('/admin/users');
}

export async function toggleUser(id: number) {
  await api(`/admin/users/${idSeg(id)}/toggle`, { method: 'POST' });
  refresh();
}

export async function createClass(_: FormState, form: FormData): Promise<FormState> {
  let id: number;
  try {
    ({ id } = await api<{ id: number }>('/admin/classes', {
      body: pick(form, ['grade', 'section', 'academic_year', 'class_teacher_id']),
    }));
  } catch (e) {
    return failure(e, 'Could not create the class.', form);
  }
  redirect(`/admin/classes/${id}`);
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

export async function enrolStudent(classId: number, _: FormState, form: FormData) {
  return mutate(`/admin/classes/${idSeg(classId)}/students`, 'POST', pick(form, ['student_id', 'roll_no']), form);
}

export async function unenrolStudent(classId: number, studentId: number) {
  await mutate(`/admin/classes/${idSeg(classId)}/students/${idSeg(studentId)}`, 'DELETE');
}

export async function linkSubject(classId: number, _: FormState, form: FormData) {
  return mutate(`/admin/classes/${idSeg(classId)}/subjects`, 'POST', pick(form, ['subject_id', 'teacher_id']), form);
}

export async function unlinkSubject(classId: number, subjectId: number) {
  await mutate(`/admin/classes/${idSeg(classId)}/subjects/${idSeg(subjectId)}`, 'DELETE');
}

const SUBJECT_FIELDS = ['name', 'grade', 'icon', 'color', 'description'];

export async function createSubject(_: FormState, form: FormData): Promise<FormState> {
  return mutate('/admin/subjects', 'POST', pick(form, SUBJECT_FIELDS), form);
}

export async function updateSubject(id: number, _: FormState, form: FormData): Promise<FormState> {
  return mutate(`/admin/subjects/${idSeg(id)}`, 'PATCH', pick(form, [...SUBJECT_FIELDS, 'is_active']), form);
}

export async function setSubjectActive(id: number, name: string, active: boolean) {
  await mutate(`/admin/subjects/${idSeg(id)}`, 'PATCH', { name, is_active: active ? 1 : 0 });
}

export async function deleteSubject(id: number) {
  await mutate(`/admin/subjects/${idSeg(id)}`, 'DELETE');
}

export async function linkUser(userId: number, otherKey: 'student_id' | 'parent_id', _: FormState, form: FormData) {
  return mutate(`/admin/users/${idSeg(userId)}/links`, 'POST', pick(form, [otherKey, 'relation']), form);
}

export async function unlinkUser(userId: number, otherId: number) {
  await mutate(`/admin/users/${idSeg(userId)}/links/${idSeg(otherId)}`, 'DELETE');
}

export async function toggleSyllabus(id: number): Promise<FormState> {
  return mutate(`/admin/syllabi/${idSeg(id)}/toggle`, 'POST');
}
