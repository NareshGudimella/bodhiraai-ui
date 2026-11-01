/** Mirrors Role in bodhiraai-api (and App\Enums\Role in the legacy app). */
export type Role =
  | 'student'
  | 'teacher'
  | 'parent'
  | 'admin'
  | 'super_admin'
  | 'content_manager'
  | 'web_admin';

/** Role → dashboard home. Same targets as the legacy redirectUsersTo() in bootstrap/app.php. */
export const ROLE_HOME: Record<Role, string> = {
  student: '/student',
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
  super_admin: '/super',
  web_admin: '/cms',
  // Legacy sends content managers to the site image manager (Phase 6b).
  content_manager: '/cms/images',
};

/**
 * Sections that belong to particular roles: legacy `/content` is the super
 * admin's; the CMS is for super and web admins (content managers only get the
 * site images); B2C checkout and invoices are the student's. The longest
 * matching prefix wins.
 */
export const ROLE_AREAS: Record<string, Role[]> = {
  '/content': ['super_admin'],
  '/cms': ['super_admin', 'web_admin'],
  '/cms/images': ['super_admin', 'web_admin', 'content_manager'],
  '/checkout': ['student'],
  '/invoices': ['student'],
};

/** Roles allowed in the area that owns `path`, or null when no area claims it. */
export function areaRoles(path: string): Role[] | null {
  const prefix = Object.keys(ROLE_AREAS)
    .filter((p) => path === p || path.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0];
  return prefix ? ROLE_AREAS[prefix] : null;
}

/** Path prefixes that need a signed-in user; checked optimistically in proxy.ts. */
export const PROTECTED_PREFIXES = [...Object.values(ROLE_HOME), ...Object.keys(ROLE_AREAS), '/paywall', '/billing'];

/** Pages for guests only (legacy `guest` middleware): signed-in users go home. */
export const GUEST_ONLY = ['/login', '/register/student', '/web-admin/login', '/forgot-password', '/reset-password'];

export function homeFor(role: string | undefined): string {
  return ROLE_HOME[role as Role] ?? '/';
}
