import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { api, ApiError } from './api';

/**
 * A 402 from the API (`subscription_inactive`: the student's plan lapsed
 * mid-session) sends the student to /paywall instead of the error page, as
 * legacy's `subscribed` middleware does on the next request. Call it first in
 * a `catch` of pages and Server Actions; anything else falls through.
 */
export function paywallOn402(e: unknown): void {
  if (e instanceof ApiError && e.status === 402) redirect('/paywall');
}

/**
 * GET for pages. 404 and 403 → the not-found page (someone else's
 * conversation, a class the teacher doesn't teach); it doesn't reveal whether
 * the item exists. 402 → /paywall. Other errors propagate to the error boundary.
 */
export async function load<T>(path: string): Promise<T> {
  try {
    return await api<T>(path);
  } catch (e) {
    paywallOn402(e);
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
}
