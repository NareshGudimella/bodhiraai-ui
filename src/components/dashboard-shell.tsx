import { Suspense, type ReactNode } from "react";
import { logout } from "@/lib/auth-actions";
import Link from "next/link";
import { requireRole, type User } from "@/lib/dal";
import { getT } from "@/lib/i18n";
import { inboxApi } from "@/lib/inbox-api";
import { homeFor } from "@/lib/roles";
import type { Role } from "@/lib/roles";
import { Flash } from "./flash";
import { NavLinks, NavList, type NavItem } from "./nav-links";

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
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="bg-brand text-primary-light md:w-62 md:shrink-0">
        <div className="px-5 py-5 text-lg font-bold tracking-tight">
          Bodhira <span className="font-medium text-primary">· {title}</span>
        </div>
        <Suspense fallback={<NavList items={nav} />}>
          <TranslatedNav items={nav} />
        </Suspense>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-page">
        <Suspense fallback={<div className="p-6 text-ink-3">Loading…</div>}>
          <Gate authorize={authorize ?? (() => requireRole(...roles))}>{children}</Gate>
        </Suspense>
      </div>
    </div>
  );
}

/** Sidebar labels in the visitor's language (legacy layouts wrap them in __()). */
async function TranslatedNav({ items }: { items: NavItem[] }) {
  const t = await getT();
  return <NavLinks items={items.map((i) => ({ ...i, label: t(i.label) }))} />;
}

async function Gate({ authorize, children }: { authorize: () => Promise<User>; children: ReactNode }) {
  const user = await authorize();
  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-line bg-card px-6 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-ink-3">
            {user.role_label}
            {user.school ? ` · ${user.school.name}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Bell user={user} />
          <form action={logout}>
          <button className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-2 hover:bg-primary-light">
            Log out
          </button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Flash />
        {children}
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
      className="relative rounded-lg border border-line px-2.5 py-1.5 text-sm hover:bg-primary-light"
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
