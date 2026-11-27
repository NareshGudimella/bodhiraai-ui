import 'server-only';
import { cookies } from 'next/headers';
import { homeFor } from './roles';

/** httpOnly cookie holding the Sanctum-format API token (`<id>|<secret>`). */
export const TOKEN_COOKIE = 'bodhira_token';
/** Role hint for optimistic redirects in proxy.ts. Never trusted for authorization. */
export const ROLE_COOKIE = 'bodhira_role';

const MAX_AGE = 60 * 60 * 24 * 30;

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
};

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

export async function setSession(token: string, role: string) {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, base);
  store.set(ROLE_COOKIE, role, base);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(ROLE_COOKIE);
}

/**
 * Not in legacy (it always showed Sign In): the site's account link. Signed in →
 * "My Account" to their dashboard; the role cookie is only a hint (the dashboard
 * checks access), and an unknown role goes to /login, which redirects signed-in users home.
 */
export async function accountLink(): Promise<{ href: string; label: string }> {
  const jar = await cookies();
  if (!jar.get(TOKEN_COOKIE)?.value) return { href: '/login', label: 'Sign In' };
  const home = homeFor(jar.get(ROLE_COOKIE)?.value);
  return { href: home === '/' ? '/login' : home, label: 'My Account' };
}
