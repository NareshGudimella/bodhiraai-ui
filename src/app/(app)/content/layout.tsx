import { DashboardShell } from "@/components/dashboard-shell";
import { SUPER_NAV } from "../super/nav";

export default function ContentLayout({ children }: LayoutProps<"/content">) {
  return (
    <DashboardShell roles={["super_admin"]} title="Super Admin" nav={SUPER_NAV}>
      {children}
    </DashboardShell>
  );
}
