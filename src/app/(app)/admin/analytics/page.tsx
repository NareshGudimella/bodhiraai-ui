import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, ProgressBar, SectionTitle, Stat } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const { classes, attendance_trend, totals } = await adminApi.analytics();
  const max = Math.max(100, ...attendance_trend.map((d) => d.percent));
  // Legacy analytics.blade.php: the mean of the 7 daily percentages.
  const avgAttendance = attendance_trend.length
    ? Math.round(attendance_trend.reduce((n, d) => n + d.percent, 0) / attendance_trend.length)
    : 0;
  return (
    <>
      <PageHeader title="Analytics" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Average quiz score" value={`${totals.avg_quiz_percent}%`} hint="across classes" />
        <Stat label="Avg Attendance (7 days)" value={`${avgAttendance}%`} hint="last 7 days avg" />
        <Stat label="Quiz attempts" value={totals.quiz_attempts} hint="total submitted" />
        <Stat label="Lessons completed" value={totals.lessons_completed} />
      </div>
      <section className="mt-8">
        <SectionTitle>Attendance, last 7 days</SectionTitle>
        <Card>
          <ol className="flex h-40 items-end gap-2" aria-label="Attendance percent by day">
            {attendance_trend.map((d) => (
              <li key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-ink-2">{d.percent}%</span>
                <span className="w-full rounded-t bg-primary" style={{ height: `${(d.percent / max) * 100}px` }} aria-hidden />
                <span className="text-[11px] text-ink-3">{d.date}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>
      <section className="mt-8">
        <SectionTitle>By class</SectionTitle>
        {classes.length ? (
          <ul className="grid gap-3 md:grid-cols-2">
            {classes.map((c) => (
              <li key={c.id}>
                <Card className="space-y-3 p-4">
                  <p className="flex items-baseline justify-between gap-2 font-semibold text-brand">
                    <span>{c.label} <span className="text-xs font-normal text-ink-3">· {c.students} students</span></span>
                    <Link href={`/admin/classes/${c.id}`} className="text-xs font-semibold hover:underline">Open →</Link>
                  </p>
                  <div><p className="mb-1 flex justify-between text-xs text-ink-2"><span>Attendance</span><span>{c.attendance_percent}%</span></p><ProgressBar value={c.attendance_percent} /></div>
                  <div><p className="mb-1 flex justify-between text-xs text-ink-2"><span>Quiz average</span><span>{c.avg_quiz_percent}%</span></p><ProgressBar value={c.avg_quiz_percent} /></div>
                </Card>
              </li>
            ))}
          </ul>
        ) : <Empty>No classes yet.</Empty>}
      </section>
    </>
  );
}
