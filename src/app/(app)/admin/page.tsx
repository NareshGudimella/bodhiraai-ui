import Link from "next/link";
import { Card, Empty, PageHeader, SectionTitle, Stat, buttonClass } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";

/** Legacy admin/home.blade.php: stat cards link to their lists, plus Quick Actions. */
const QUICK = [
  { href: "/admin/users/new", icon: "🧑‍💼", title: "Add User", sub: "Add student, teacher or parent" },
  { href: "/admin/classes", icon: "🏫", title: "Add Class", sub: "Create a new class or section" },
  { href: "/admin/subjects", icon: "📚", title: "Manage Subjects", sub: "Create and manage subjects" },
  { href: "/admin/analytics", icon: "📊", title: "View Analytics", sub: "Track performance and trends" },
];

function LinkStat({ href, ...stat }: { href: string; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Link href={href} className="block rounded-2xl transition hover:ring-2 hover:ring-primary">
      <Stat {...stat} hint={stat.hint ?? "View all →"} />
    </Link>
  );
}

export default async function AdminHome() {
  const { admin, stats, recent_signups, recent_attempts } = await adminApi.home();
  return (
    <>
      <PageHeader
        title={admin.school ?? "Your school"}
        subtitle={admin.school_code ? `School code ${admin.school_code}` : undefined}
        action={<Link href="/admin/analytics" className={buttonClass}>View analytics →</Link>}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        <LinkStat href="/admin/users?role=student" label="Students" value={stats.students} />
        <LinkStat href="/admin/users?role=teacher" label="Teachers" value={stats.teachers} />
        <LinkStat href="/admin/users?role=parent" label="Parents" value={stats.parents} />
        <LinkStat href="/admin/classes" label="Classes" value={stats.classes} />
        <LinkStat href="/admin/subjects" label="Subjects" value={stats.subjects} />
        <Stat label="Present today" value={`${stats.attendance_percent}%`} />
        <Stat label="Assignments" value={stats.active_assignments} hint="published" />
      </div>
      <section className="mt-8">
        <SectionTitle>Quick actions</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK.map((q) => (
            <li key={q.title}>
              <Link href={q.href} className="block h-full">
                <Card className="h-full p-4 transition hover:ring-primary">
                  <p className="font-semibold text-brand"><span aria-hidden>{q.icon}</span> {q.title}</p>
                  <p className="mt-1 text-xs text-ink-2">{q.sub} →</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Recent sign-ups</h2>
            <Link href="/admin/users" className="text-xs font-semibold text-brand hover:underline">All users →</Link>
          </div>
          {recent_signups.length ? (
            <ul className="space-y-1 text-sm">
              {recent_signups.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-2 ring-1 ring-line">
                  <span className="min-w-0 truncate text-ink">{u.name} <span className="text-ink-3">· {u.role_label}</span></span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-ink-3">{u.created_at}</span>
                    <Link href={`/admin/users/${u.id}`} className="text-xs font-semibold text-brand hover:underline">Edit</Link>
                  </span>
                </li>
              ))}
            </ul>
          ) : <Empty>No users yet.</Empty>}
        </section>
        <section>
          <SectionTitle>Recent quiz results</SectionTitle>
          {recent_attempts.length ? (
            <ul className="space-y-2">
              {recent_attempts.map((a, i) => (
                <li key={i}>
                  <Card className="flex items-center justify-between gap-2 p-3">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">{a.student}</span>
                      <span className="block truncate text-xs text-ink-3">{a.quiz} · {a.submitted_at}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-brand">{a.percent}%</span>
                  </Card>
                </li>
              ))}
            </ul>
          ) : <Empty>No quiz attempts yet.</Empty>}
        </section>
      </div>
    </>
  );
}
