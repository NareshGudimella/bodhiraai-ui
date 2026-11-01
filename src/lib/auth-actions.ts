'use server';

import { redirect } from 'next/navigation';
import { api, apiEnvelope, ApiError } from './api';
import { setFlash } from './flash';
import { homeFor } from './roles';
import { safeNextPath } from './safe-path';
import { clearSession, getToken, setSession } from './session';

export type LoginState = { message?: string; errors?: Record<string, string[]>; identifier?: string };

export async function login(_: LoginState | undefined, form: FormData): Promise<LoginState> {
  const identifier = String(form.get('identifier') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!identifier || !password) {
    return { identifier, message: 'Enter your email, phone or username and password.' };
  }

  let role: string;
  try {
    const data = await api<{ token: string; user: { role: string } }>('/auth/login', {
      body: { identifier, password, device: 'web' },
      token: null,
    });
    await setSession(data.token, data.user.role);
    role = data.user.role;
  } catch (e) {
    if (e instanceof ApiError) return { identifier, message: e.message, errors: e.errors };
    return { identifier, message: 'Could not reach the server. Try again.' };
  }

  const next = String(form.get('next') ?? '');
  redirect(safeNextPath(next) ?? homeFor(role)); // security: not in legacy (open redirect via /\host)
}

export async function logout() {
  const token = await getToken();
  if (token) {
    await api('/auth/logout', { method: 'POST', token }).catch(() => undefined);
  }
  await clearSession();
  redirect('/login');
}

export type ResetState = { ok?: boolean; message?: string; email?: string } | undefined;

/** Legacy PasswordResetController::sendLink: every outcome is shown as a status. */
export async function sendResetLink(_: ResetState, form: FormData): Promise<ResetState> {
  const email = String(form.get('email') ?? '').trim();
  try {
    const { message } = await apiEnvelope('/auth/password/forgot', { body: { email }, token: null });
    return { ok: true, message: message ?? '', email };
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: Object.values(e.errors ?? {})[0]?.[0] ?? e.message, email };
    return { ok: false, message: 'Could not reach the server. Try again.', email };
  }
}

/** Legacy PasswordResetController::update: success goes to /login with the status. */
export async function resetPassword(_: ResetState, form: FormData): Promise<ResetState> {
  const email = String(form.get('email') ?? '').trim();
  try {
    const { message } = await apiEnvelope('/auth/password/reset', {
      body: {
        token: form.get('token'),
        email,
        password: form.get('password'),
        password_confirmation: form.get('password_confirmation'),
      },
      token: null,
    });
    await setFlash(message);
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: Object.values(e.errors ?? {})[0]?.[0] ?? e.message, email };
    return { ok: false, message: 'Could not reach the server. Try again.', email };
  }
  redirect('/login');
}

/**
 * not in legacy: the button on /auth/handoff. Redeems the single-use code the
 * mobile app sent, sets the same session cookies as `login`, and goes to the
 * page the app asked for (`next`, re-checked as a relative path). A session
 * already in this browser is revoked first (best effort). A bad code goes to
 * /login with a flash.
 */
export async function confirmHandoff(form: FormData): Promise<void> {
  const code = String(form.get('code') ?? '');
  const next = safeNextPath(String(form.get('next') ?? ''));
  const failed = (reason: string) =>
    `/auth/handoff/failed?reason=${reason}${next ? `&next=${encodeURIComponent(next)}` : ''}`;
  if (!code || code.length > 200) redirect(failed('invalid'));

  let target: string;
  try {
    const data = await api<{ token: string; user: { role: string }; next: string }>('/auth/web-handoff/redeem', {
      body: { code },
      token: null,
    });
    const old = await getToken();
    if (old) await api('/auth/logout', { method: 'POST', token: old }).catch(() => undefined);
    await setSession(data.token, data.user.role);
    target = safeNextPath(data.next) ?? next ?? homeFor(data.user.role);
  } catch (e) {
    redirect(failed(e instanceof ApiError && (e.status === 422 || e.status === 403) ? 'expired' : 'error'));
  }
  redirect(target);
}
