import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { FLASH_COOKIE } from '@/lib/flash';
import { getLocale, isLocale, LOCALE_COOKIE, translate } from '@/lib/i18n';
import { getToken } from '@/lib/session';
import { siteUrl } from '@/lib/site-url';

/**
 * Legacy LocaleController (`/locale/{locale}`): remember the language for this
 * browser session and, when signed in, on the user; then back with
 * "Language updated.". Like legacy, the flash is in the language the request
 * started in (SetLocale ran before the switch). Unlike legacy's back(), an
 * off-site Referer goes to / instead.
 */
export async function GET(request: Request, { params }: RouteContext<'/locale/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) return new NextResponse('Not Found', { status: 404 });
  const before = await getLocale();
  if (await getToken()) await api('/me/locale', { body: { locale } }).catch(() => undefined);

  const res = NextResponse.redirect(backUrl(request), 302);
  const secure = process.env.NODE_ENV === 'production';
  // A session cookie, as legacy keeps the choice in the session; the user's saved locale outlives it.
  res.cookies.set(LOCALE_COOKIE, locale, { path: '/', httpOnly: true, sameSite: 'lax', secure });
  res.cookies.set(FLASH_COOKIE, encodeURIComponent(translate(before, 'Language updated.')), { path: '/', maxAge: 60, sameSite: 'lax', secure });
  return res;
}

function backUrl(request: Request) {
  const home = siteUrl('/', request.url);
  try {
    const referer = new URL(request.headers.get('referer') ?? '');
    return referer.host === home.host ? referer : home;
  } catch {
    return home;
  }
}
