import { DashboardShell } from "@/components/dashboard-shell";
import { CMS_NAV } from "./nav";

/** The Web Studio (legacy `/cms`): super admins and web admins. */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell roles={["super_admin", "web_admin"]} title="Web Studio" nav={CMS_NAV}>
      {children}
    </DashboardShell>
  );
}
