import { DashboardShell } from "@/components/dashboard-shell";

const NAV = [
  { label: "Dashboard", href: "/teacher", icon: "🏠" },
  { label: "Classes", href: "/teacher/classes", icon: "🏫" },
  { label: "Assignments", href: "/teacher/assignments", icon: "📝" },
  { label: "Quizzes", href: "/teacher/quizzes", icon: "📊" },
  { label: "Live classes", href: "/teacher/live", icon: "🎥" },
  { label: "Messages", href: "/teacher/chat", icon: "💬" },
  { label: "Settings", href: "/teacher/settings", icon: "⚙️" },
];

export default function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  return (
    <DashboardShell roles={["teacher"]} title="Teacher" nav={NAV}>
      {children}
    </DashboardShell>
  );
}
