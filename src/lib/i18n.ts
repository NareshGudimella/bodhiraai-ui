import 'server-only';
import { cookies } from 'next/headers';
import hi from './lang/hi.json';
import te from './lang/te.json';
import { getToken } from './session';
import { getCurrentUser } from './dal';

/**
 * Legacy localisation (SetLocale + lang/*.json, copied from the legacy app):
 * the chosen language from the session (here a cookie), else the signed-in
 * user's saved `locale`, else English. Strings without a translation stay
 * English, as with Laravel's __().
 */
export const LOCALES = { en: 'English', hi: 'हिन्दी', te: 'తెలుగు' } as const;
export type Locale = keyof typeof LOCALES;
export const LOCALE_COOKIE = 'bodhira_locale';

const DICTS: Record<Locale, Record<string, string>> = { en: {}, hi, te };

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && v in LOCALES;

export async function getLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  if (await getToken()) {
    const saved = (await getCurrentUser()).locale;
    if (isLocale(saved)) return saved;
  }
  return 'en';
}

/** `__()` for the current request. */
export async function getT() {
  const dict = DICTS[await getLocale()];
  return (key: string) => dict[key] ?? key;
}

/** `__()` for a known locale (e.g. the flash after switching). */
export const translate = (locale: Locale, key: string) => DICTS[locale][key] ?? key;
