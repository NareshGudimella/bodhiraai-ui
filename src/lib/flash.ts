import 'server-only';
import { cookies } from 'next/headers';

/**
 * One-shot status message across a redirect (Laravel's `->with('status', …)`).
 * Readable by the browser so <Flash> can clear it once shown.
 */
export const FLASH_COOKIE = 'bodhira_flash';

export async function setFlash(message: string | null | undefined) {
  if (!message) return;
  (await cookies()).set(FLASH_COOKIE, encodeURIComponent(message), {
    path: '/',
    maxAge: 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getFlash(): Promise<string | null> {
  const raw = (await cookies()).get(FLASH_COOKIE)?.value;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}
