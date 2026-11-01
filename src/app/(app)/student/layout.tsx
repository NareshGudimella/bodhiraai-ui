import { DashboardShell } from "@/components/dashboard-shell";
import { requireStudent } from "@/lib/dal";
import { STUDENT_NAV } from "./nav";

export default function StudentLayout({ children }: LayoutProps<"/student">) {
  return (
    <DashboardShell roles={["student"]} title="Student" nav={STUDENT_NAV} authorize={requireStudent}>
      {children}
    </DashboardShell>
  );
}
