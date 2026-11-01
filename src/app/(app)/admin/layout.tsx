import { DashboardShell } from "@/components/dashboard-shell";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "🏠" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Classes", href: "/admin/classes", icon: "🏫" },
  { label: "Subjects", href: "/admin/subjects", icon: "📚" },
  // not in legacy: watch the Super Admin curricula the school uses.
  { label: "Content", href: "/admin/content", icon: "🎬" },
  { label: "Syllabi", href: "/admin/syllabi", icon: "🗂️" },
  { label: "Analytics", href: "/admin/analytics", icon: "📈" },
  { label: "Billing", href: "/admin/billing", icon: "💳" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <DashboardShell roles={["admin"]} title="School Admin" nav={NAV}>
      {children}
    </DashboardShell>
  );
}
