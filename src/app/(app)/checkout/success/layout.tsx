import { DashboardShell } from "@/components/dashboard-shell";
import { STUDENT_NAV } from "../../student/nav";

/** The thank-you page sits in the student frame (legacy layouts.student) without the paywall gate. */
export default function CheckoutSuccessLayout({ children }: LayoutProps<"/checkout/success">) {
  return (
    <DashboardShell roles={["student"]} title="Student" nav={STUDENT_NAV}>
      {children}
    </DashboardShell>
  );
}
