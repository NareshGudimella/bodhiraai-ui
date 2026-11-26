import { Suspense, type ReactNode } from "react";
import { logout } from "@/lib/auth-actions";
import Link from "next/link";
import { requireRole, type User } from "@/lib/dal";
import { getT } from "@/lib/i18n";
import { inboxApi } from "@/lib/inbox-api";
import { homeFor } from "@/lib/roles";
import type { Role } from "@/lib/roles";
import { Flash } from "./flash";
import { Breadcrumbs, NavLinks, NavList, type NavItem } from "./nav-links";
import { NavDrawer, NavProvider, NavToggle } from "./shell-nav";

export type { NavItem };

/**
 * Frame shared by every role dashboard. The frame is static; everything that
 * depends on the session renders inside <Suspense> behind requireRole().
 */
export function DashboardShell({
  roles,
  title,
  nav,
  authorize,
  children,
}: {
  roles: Role[];
  title: string;
  nav: NavItem[];
  /** Extra access check (e.g. the student paywall). Defaults to requireRole(...roles). */
  authorize?: () => Promise<User>;
  children: ReactNode;
}) {
  return (
    <NavProvider>
      <div className="flex flex-1 flex-col md:flex-row">
        <NavDrawer>
          <div className="flex items-center gap-3 px-5 py-5">
            <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-base font-bold text-brand">B</span>
            <span className="min-w-0 leading-tight">
              <span className="block text-base font-semibold tracking-tight text-white">Bodhira</span>
              <span className="block truncate text-xs text-primary">{title}</span>
            </span>
          </div>
          <Suspense fallback={<NavList items={nav} />}>
            <TranslatedNav items={nav} />
          </Suspense>
        </NavDrawer>

        <div className="flex min-w-0 flex-1 flex-col bg-page">
          <Suspense fallback={<div className="p-6 text-ink-3">Loading…</div>}>
            <Gate title={title} nav={nav} authorize={authorize ?? (() => requireRole(...roles))}>{children}</Gate>
          </Suspense>
        </div>
      </div>
    </NavProvider>
  );
}

/** Sidebar labels in the visitor's language (legacy layouts wrap them in __()). */
async function TranslatedNav({ items }: { items: NavItem[] }) {
  const t = await getT();
  return <NavLinks items={items.map((i) => ({ ...i, label: t(i.label) }))} />;
}

async function Gate({ title, nav, authorize, children }: { title: string; nav: NavItem[]; authorize: () => Promise<User>; children: ReactNode }) {
  const user = await authorize();
  const t = await getT();
  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <NavToggle />
          <Breadcrumbs section={title} items={nav.map((i) => ({ ...i, label: t(i.label) }))} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Bell user={user} />
          <div className="flex items-center gap-2.5 sm:border-l sm:border-line sm:pl-3">
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-primary-light">
              {user.name.trim().charAt(0).toUpperCase()}
            </span>
            <div className="hidden min-w-0 max-w-48 leading-tight sm:block">
              <p className="truncate text-sm font-medium text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-3">
                {user.role_label}
                {user.school ? ` · ${user.school.name}` : ""}
              </p>
            </div>
          </div>
          <form action={logout}>
            {/* Legacy layouts' "Logout" (the student layout wraps it in __()). */}
            <button className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-2 transition hover:bg-primary-light">
              {t("Logout")}
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-7xl">
          <Flash />
          {children}
        </div>
      </main>
    </>
  );
}

/** Body for dashboards whose modules haven't been migrated yet. */
export function PendingModule({ area }: { area: string }) {
  return (
    <section className="max-w-xl rounded-2xl bg-card p-6 shadow-sm ring-1 ring-line">
      <h1 className="text-xl font-bold text-brand">{area}</h1>
      <p className="mt-2 text-sm text-ink-2">
        This dashboard is being migrated from the legacy Laravel app. Its features are listed in the migration
        plan and will appear here module by module.
      </p>
    </section>
  );
}

/** Roles with an inbox at /<role>/notifications. */
const INBOX_ROLES = new Set(["student", "teacher", "parent"]);

async function Bell({ user }: { user: User }) {
  if (!INBOX_ROLES.has(user.role)) return null;
  const { meta } = await inboxApi.notifications(1);
  const unread = meta.unread_count;
  return (
    <Link
      href={`${homeFor(user.role)}/notifications`}
      aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
      className="relative rounded-lg border border-line px-2.5 py-1.5 text-sm transition hover:bg-primary-light"
    >
      <span aria-hidden>🔔</span>
      {unread > 0 && (
        <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-brand px-1 text-center text-[11px] font-semibold text-primary-light">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
