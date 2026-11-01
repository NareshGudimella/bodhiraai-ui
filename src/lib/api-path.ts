import { ApiError } from './api';

/**
 * Building API paths from route params or form values. A value is one path
 * segment, never more: `..%2F..%2Fauth%2Flogout-all%3F` must not reach another
 * endpoint (security: not in legacy).
 */

/** A slug or key: percent-encoded, and never `.` or `..`. */
export function seg(value: unknown): string {
  const s = String(value ?? '');
  if (!s || s === '.' || s === '..') throw new ApiError('Not found.', 404);
  return encodeURIComponent(s);
}

/** A numeric id: digits only, otherwise the same as a missing record (404). */
export function idSeg(value: unknown): string {
  const s = String(value ?? '');
  if (!/^\d{1,18}$/.test(s)) throw new ApiError('Not found.', 404);
  return s;
}

/** Defence in depth for api(): the path part must not climb or smuggle separators. */
export function assertSafeApiPath(path: string): void {
  const pathname = path.split('?')[0];
  if (/[\\\u0000-\u001f\u007f#]/.test(pathname) || /%(2f|5c|2e|00)/i.test(pathname) || pathname.split('/').some((s) => s === '.' || s === '..')) {
    throw new ApiError('Not found.', 404);
  }
}
