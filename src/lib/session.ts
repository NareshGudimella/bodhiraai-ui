import 'server-only';
import { cookies } from 'next/headers';

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
