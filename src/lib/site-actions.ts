'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiEnvelope, ApiError } from './api';
import { setSiteFlash } from './site-flash';

/** `back()`: the page the form was on (same site only). */
async function back(fallback = '/') {
  const h = await headers();
  const ref = h.get('referer');
  const host = h.get('host');
  if (ref && host) {
    const url = new URL(ref);
    if (url.host === host) return url.pathname + url.search;
  }
  return fallback;
}

const fields = (form: FormData) =>
  Object.fromEntries(
    [...form.entries()].filter(([k, v]) => typeof v === 'string' && !k.startsWith('$')) as [string, string][],
  );

/**
 * Post a lead form to the API, then go back like Laravel: the status message
 * under `key` on success; errors and old input on a 422.
 */
async function submit(path: string, form: FormData, key: string, to?: string) {
  const body = fields(form);
  const target = to ?? (await back());
  try {
    const { message } = await apiEnvelope(path, { body, token: null });
    await setSiteFlash({ messages: { [key]: message ?? '' } });
  } catch (e) {
    if (!(e instanceof ApiError) || !e.errors) throw e;
    await setSiteFlash({ errors: e.errors, old: body });
    redirect(await back());
  }
  redirect(target);
}

/** PageController::contactSubmit. */
export async function contactSubmit(form: FormData) {
  await submit('/leads/contact', form, 'status');
}

/** PageController::newsletterSubscribe. */
export async function newsletterSubscribe(form: FormData) {
  await submit('/leads/newsletter', form, 'newsletter_status');
}

/** PageController::enquiryStore. */
export async function enquiryStore(form: FormData) {
  await submit('/leads/enquiry', form, 'status');
}

/** DemoController::store: success goes to /book-demo with `demo_success`. */
export async function demoStore(form: FormData) {
  await submit('/leads/demo', form, 'demo_success', '/book-demo');
}
