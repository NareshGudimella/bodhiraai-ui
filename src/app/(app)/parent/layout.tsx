import { Suspense, type ReactNode } from "react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { parentApi } from "@/lib/parent-api";

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/parent", icon: "🏠" },
  { label: "Messages", href: "/parent/chat", icon: "💬" },
  { label: "Settings", href: "/parent/settings", icon: "⚙️" },
];

export default function ParentLayout({ children }: LayoutProps<"/parent">) {
  // The static frame first; the linked children join the sidebar once the session resolves.
  return (
    <Suspense fallback={<DashboardShell roles={["parent"]} title="Parent" nav={NAV}>{null}</DashboardShell>}>
      <ParentShell>{children}</ParentShell>
    </Suspense>
  );
}

/** Legacy parent layout: a CHILDREN section in the sidebar, one link per linked child. */
async function ParentShell({ children }: { children: ReactNode }) {
  const kids = await parentApi.children().catch(() => []);
  const nav: NavItem[] = [
    ...NAV,
    ...kids.map((k) => ({
      label: k.name,
      href: `/parent/children/${k.id}`,
      icon: [...k.name][0]?.toUpperCase(),
      group: "Children",
    })),
  ];
  return (
    <DashboardShell roles={["parent"]} title="Parent" nav={nav}>
      {children}
    </DashboardShell>
  );
}
