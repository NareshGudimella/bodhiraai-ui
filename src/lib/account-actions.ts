'use server';

import { refresh } from 'next/cache';
import { api } from './api';
import { failure, forwardForm, type FormState } from './action-result';

/** Account settings (every role): POST /me/profile (multipart) and /me/password. */

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  try {
    await api('/me/profile', { body: forwardForm(form, ['name', 'phone', 'dob', 'gender'], 'avatar') });
    refresh();
    return { ok: true, message: 'Profile updated successfully.' };
  } catch (e) {
    return failure(e, 'Could not update your profile.', form);
  }
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  try {
    // JSON endpoint (no file), so send a plain object, not multipart.
    const field = (k: string) => (typeof form.get(k) === 'string' ? (form.get(k) as string) : null);
    await api('/me/password', {
      body: {
        current_password: field('current_password'),
        password: field('password'),
        password_confirmation: field('password_confirmation'),
      },
    });
    return { ok: true, message: 'Password changed successfully.' };
  } catch (e) {
    // Never echo passwords back into the form.
    const state = failure(e, 'Could not change your password.');
    return state && { ...state, values: undefined };
  }
}
