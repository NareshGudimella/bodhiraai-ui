import 'server-only';
import { notFound } from 'next/navigation';
import { api, ApiError } from './api';

/**
 * GET for pages. 404 and 403 → the not-found page (someone else's
 * conversation, a class the teacher doesn't teach); it doesn't reveal whether
 * the item exists. Other errors propagate to the error boundary.
 */
export async function load<T>(path: string): Promise<T> {
  try {
    return await api<T>(path);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
}
