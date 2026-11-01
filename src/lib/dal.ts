import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { api, ApiError } from './api';
import { homeFor, type Role } from './roles';
import { getToken } from './session';

/** Shape of UserResource from bodhiraai-api. */
export type User = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  role_label: string | null;
  avatar: string | null;
  grade: string | null;
  gender: string | null;
  dob: string | null;
  status: string;
  locale: string | null;
  school: { id: number; name: string; code: string; logo: string | null } | null;
};

/** Current user from GET /auth/me, memoised per request. Redirects to /login when signed out. */
export const getCurrentUser = cache(async (): Promise<User> => {
  const token = await getToken();
  if (!token) redirect('/login');
  try {
    return await api<User>('/auth/me', { token });
  } catch (e) {
    // The cookie outlived its token (revoked, logged out elsewhere): `expired`
    // tells proxy.ts to show the login page instead of bouncing back here.
    if (e instanceof ApiError && e.status === 401) redirect('/login?expired=1');
    throw e;
  }
});

/** Authorise a dashboard: wrong role → that user's own home (legacy EnsureRole sends 403). */
export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await getCurrentUser();
  if (!roles.includes(user.role)) redirect(homeFor(user.role));
  return user;
}

/**
 * Student dashboards: role check plus the legacy `subscribed` gate. Unpaid
 * students go to /paywall, as in the legacy web app.
 */
export async function requireStudent(): Promise<User> {
  const user = await requireRole('student');
  const { has_access } = await api<{ has_access: boolean }>('/student/access');
  if (!has_access) redirect('/paywall');
  return user;
}
