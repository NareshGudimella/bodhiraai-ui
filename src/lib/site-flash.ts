import 'server-only';
import { cookies } from 'next/headers';

/**
 * Laravel's session flash for the marketing forms: a status message under a
 * key (`status`, `newsletter_status`, `demo_success`), validation errors and
 * the old input, kept for the redirect back and read once by the page.
 */
export const SITE_FLASH_COOKIE = 'bodhira_site_flash';

export type SiteFlash = {
  messages?: Record<string, string>;
  errors?: Record<string, string[]>;
  old?: Record<string, string>;
};

export async function setSiteFlash(flash: SiteFlash) {
  // Cookies hold ~4 KB: long old input (a message) is cut short rather than lost entirely.
  const old = Object.fromEntries(Object.entries(flash.old ?? {}).map(([k, v]) => [k, v.slice(0, 600)]));
  (await cookies()).set(SITE_FLASH_COOKIE, encodeURIComponent(JSON.stringify({ ...flash, old })), {
    path: '/',
    maxAge: 60,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getSiteFlash(): Promise<SiteFlash> {
  const raw = (await cookies()).get(SITE_FLASH_COOKIE)?.value;
  if (!raw) return {};
  try {
    return JSON.parse(decodeURIComponent(raw)) as SiteFlash;
  } catch {
    return {};
  }
}
