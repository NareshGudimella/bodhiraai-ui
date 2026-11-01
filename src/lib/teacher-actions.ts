'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, apiEnvelope } from './api';
import { failure, forwardForm, type FormState } from './action-result';
import { idSeg } from '@/lib/api-path';

/** Server Actions for teacher forms. Each returns FormState for useActionState. */

const field = (form: FormData, name: string) => {
  const v = form.get(name);
  return typeof v === 'string' ? v : null;
};

export async function saveAttendance(classId: number, _: FormState, form: FormData): Promise<FormState> {
  const records: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    const m = /^status\[(\d+)\]$/.exec(key);
    if (m && typeof value === 'string' && value) records[m[1]] = value;
  }
  try {
    const { saved } = await api<{ saved: number }>(`/teacher/classes/${idSeg(classId)}/attendance`, {
      body: { date: field(form, 'date'), records },
    });
    refresh();
    return { ok: true, message: `Attendance saved for ${saved} student${saved === 1 ? '' : 's'}.` };
  } catch (e) {
    return failure(e, 'Could not save attendance.');
  }
}

export async function createAssignment(_: FormState, form: FormData): Promise<FormState> {
  let id: number;
  try {
    // Multipart: the optional `attachment` file goes through the API's storage service.
    const body = forwardForm(
      form,
      ['class_id', 'subject_id', 'title', 'description', 'attachment_url', 'due_date', 'max_marks'],
      'attachment',
    );
    ({ id } = await api<{ id: number }>('/teacher/assignments', { body }));
  } catch (e) {
    return failure(e, 'Could not create the assignment.', form);
  }
  redirect(`/teacher/assignments/${id}`);
}

export async function gradeSubmission(submissionId: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    await api(`/teacher/submissions/${idSeg(submissionId)}/grade`, {
      body: { score: field(form, 'score'), feedback: field(form, 'feedback') },
    });
    refresh();
    return { ok: true, message: 'Graded.' };
  } catch (e) {
    return failure(e, 'Could not save the grade.', form);
  }
}

export async function scheduleLiveClass(_: FormState, form: FormData): Promise<FormState> {
  let id: number;
  try {
    ({ id } = await api<{ id: number }>('/teacher/live-classes', {
      body: {
        title: field(form, 'title'),
        description: field(form, 'description'),
        scope_type: field(form, 'scope_type'),
        class_id: field(form, 'class_id'),
        syllabus_id: field(form, 'syllabus_id'),
        subject_id: field(form, 'subject_id'),
        scheduled_at: field(form, 'scheduled_at'),
        duration_min: field(form, 'duration_min'),
        provider: field(form, 'provider'),
        meeting_url: field(form, 'meeting_url'),
      },
    }));
  } catch (e) {
    return failure(e, 'Could not schedule the class.', form);
  }
  redirect(`/teacher/live/${id}`);
}

export async function cancelLiveClass(id: number) {
  await api(`/teacher/live-classes/${idSeg(id)}/cancel`, { method: 'POST' });
  refresh();
}

const STUDENT_FIELDS = ['name', 'roll_no', 'email', 'phone', 'dob', 'gender', 'password'];

export async function addStudent(classId: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    const r = await apiEnvelope<{ username: string }>(`/teacher/classes/${idSeg(classId)}/students`, {
      body: forwardForm(form, STUDENT_FIELDS, 'avatar'),
    });
    refresh();
    return { ok: true, message: `${r.message ?? 'Student added.'} Login: ${r.data.username}` };
  } catch (e) {
    return failure(e, 'Could not add the student.', form);
  }
}

export async function updateStudent(classId: number, studentId: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    const r = await apiEnvelope(`/teacher/classes/${idSeg(classId)}/students/${idSeg(studentId)}`, {
      method: 'PUT',
      body: forwardForm(form, STUDENT_FIELDS, 'avatar'),
    });
    refresh();
    return { ok: true, message: r.message ?? 'Saved.' };
  } catch (e) {
    return failure(e, 'Could not update the student.', form);
  }
}

export async function setStudentStatus(classId: number, studentId: number, form: FormData) {
  await api(`/teacher/classes/${idSeg(classId)}/students/${idSeg(studentId)}/status`, {
    method: 'PATCH',
    body: { status: form.get('status') },
  });
  refresh();
}

export async function removeStudent(classId: number, studentId: number) {
  await api(`/teacher/classes/${idSeg(classId)}/students/${idSeg(studentId)}`, { method: 'DELETE' });
  refresh();
}
