import { DashboardShell } from "@/components/dashboard-shell";
import { SUPER_NAV } from "./nav";

export default function SuperAdminLayout({ children }: LayoutProps<"/super">) {
  return (
    <DashboardShell roles={["super_admin"]} title="Super Admin" nav={SUPER_NAV}>
      {children}
    </DashboardShell>
  );
}
