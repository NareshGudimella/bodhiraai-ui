/**
 * A relative path that is safe to redirect to: one leading `/`, not `//`, no
 * backslash or control characters (browsers read `/\host` like `//host`).
 * Same rule as the API's `isSafeNextPath` (src/auth/web-handoff.ts).
 */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || next.length > 2000) return null;
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  if (/[\\\u0000-\u001f\u007f]/.test(next)) return null;
  return next;
}
