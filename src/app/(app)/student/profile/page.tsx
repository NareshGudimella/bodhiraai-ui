import type { Metadata } from "next";
import Link from "next/link";
import { Card, Empty, PageHeader, Pill, ProgressBar, Stat, buttonClass, secondaryButtonClass } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { studentApi } from "@/lib/student-api";
import { AttendanceCalendar } from "./attendance-calendar";

export const metadata: Metadata = { title: "Profile" };

const monthYear = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : "—";
const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";

/** Legacy student/profile.blade.php: hero details, statistics, test reports, attendance, AI usage, achievements. */
export default async function ProfilePage() {
  const p = await studentApi.profile();
  const { student, attendance: att, ai_usage: ai } = p;
  const avatar = mediaUrl(student.avatar);

  const details: [string, string][] = [
    ["Grade", student.grade ? `Grade ${student.grade}` : "—"],
    ["Board / Syllabus", p.board ?? p.syllabus ?? "—"],
    [p.is_individual ? "Membership" : "School", p.is_individual ? "Individual Learner" : (p.school_name ?? "Bodhira.ai")],
    ["Email", student.email ?? "—"],
    ["Phone", student.phone ?? "—"],
    ["Member Since", monthYear(student.created_at)],
  ];

  return (
    <>
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {avatar ? (
            // Avatars are served by the legacy app; next/image would need its host configured.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-16 rounded-full object-cover ring-2 ring-primary" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-primary-light text-2xl font-bold text-brand">
              {student.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-brand">{student.name}</h1>
            <p className="text-sm text-ink-2">
              ⭐ {p.xp.toLocaleString("en-IN")} XP · Level {p.level} · 🔥 {p.streak_days} day streak
            </p>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            {/* A file download, not a page: a plain anchor, so Next does not prefetch the PDF. */}
            <a href="/student/profile/report" className={buttonClass}>⬇ Download Report</a>
            <Link href="/student/settings" className={secondaryButtonClass}>✏️ Edit Profile</Link>
            {p.is_individual && <Link href="/student/plan" className={secondaryButtonClass}>💳 My Plan</Link>}
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-3">
          {details.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{label}</dt>
              <dd className="truncate text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <PageHeader title={<span className="text-lg">📊 Statistics</span>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="XP" value={p.xp.toLocaleString("en-IN")} hint={`Level ${p.level}`} />
        <Stat label="Day streak" value={`${p.streak_days} 🔥`} />
        <Stat label="Lessons done" value={p.lessons_completed} />
        <Stat label="Quizzes taken" value={p.quizzes_attempted} />
        <Stat label="Average score" value={`${p.avg_score_percent}%`} />
        <Stat label="Badges earned" value={p.badges_count} />
      </div>

      <div className="mt-8">
        <PageHeader
          title={<span className="text-lg">📝 Test &amp; Quiz Reports</span>}
          action={<a href="/student/profile/report" className="text-sm font-medium text-primary-dark hover:underline">⬇ Download all (PDF)</a>}
        />
        {p.attempts.length ? (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-3">
                <tr>
                  <th className="px-4 py-3 font-semibold">Test</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Subject</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Result</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Date</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {p.attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-medium text-ink">{a.title ?? "Quiz"}</td>
                    <td className="hidden px-4 py-3 text-ink-2 sm:table-cell">{a.subject ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${a.passed ? "text-success" : "text-danger"}`}>
                        {a.score}/{a.total_marks}
                      </span>{" "}
                      <span className="text-xs text-ink-3">({a.percent}%)</span>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={a.passed ? "success" : "neutral"}>{a.passed ? "✓ Passed" : "✗ Failed"}</Pill>
                    </td>
                    <td className="hidden px-4 py-3 text-ink-3 sm:table-cell">{day(a.submitted_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/student/attempts/${a.id}`} className="font-medium text-primary-dark hover:underline">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Empty>No test reports yet. Take a quiz to see your results here.</Empty>
        )}
      </div>

      <div className="mt-8 grid gap-6 [&>*]:min-w-0 lg:grid-cols-2">
        <div>
          <PageHeader title={<span className="text-lg">🗓 Attendance</span>} />
          <Card>
            {att.total > 0 ? (
              <AttendanceCalendar records={att.records} percent={att.percent} total={att.total} />
            ) : (
              <p className="py-6 text-center text-sm text-ink-3">
                {p.is_individual ? "Attendance applies to school programs." : "Your attendance will appear here."}
              </p>
            )}
          </Card>
        </div>

        <div>
          <PageHeader title={<span className="text-lg">🤖 AI Tutor Usage</span>} />
          <Card>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-primary-light p-3">
                <p className="text-xl font-bold text-brand">{ai.sessions.toLocaleString("en-IN")}</p>
                <p className="text-xs text-ink-2">Conversations</p>
              </div>
              <div className="rounded-xl bg-primary-light p-3">
                <p className="text-xl font-bold text-brand">{ai.messages.toLocaleString("en-IN")}</p>
                <p className="text-xs text-ink-2">Messages</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-ink">⚡ AI credits left today</span>
                <b className="text-ink">
                  {ai.remaining.toLocaleString("en-IN")} / {ai.limit.toLocaleString("en-IN")}
                </b>
              </div>
              <ProgressBar value={Math.max(2, 100 - ai.used_percent)} />
              <p className="mt-1 text-xs text-ink-3">
                {ai.used_percent}% used · {ai.tokens.toLocaleString("en-IN")} tokens spent · resets tomorrow
              </p>
            </div>
            <div className="mt-4">
              <p className="mb-1 text-sm font-medium text-ink">🎯 What you ask about</p>
              <div className="flex h-2 overflow-hidden rounded-full bg-primary-light">
                <span className="bg-brand" style={{ width: `${ai.subject_pct}%` }} />
                <span className="bg-primary" style={{ width: `${ai.other_pct}%` }} />
              </div>
              <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-ink-2">
                <span>Subject doubts <b>{ai.subject_pct}%</b> ({ai.subject_count})</span>
                <span>Other doubts <b>{ai.other_pct}%</b> ({ai.other_count})</span>
              </p>
            </div>
            <Link href="/student/ai" className="mt-4 inline-block text-sm font-medium text-primary-dark hover:underline">
              Open AI Doubt Solver →
            </Link>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <PageHeader
          title={<span className="text-lg">Recent achievements</span>}
          action={<Link href="/student/badges" className="text-sm font-medium text-primary-dark hover:underline">All badges →</Link>}
        />
        {p.achievements.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.achievements.map((a) => (
              <li key={a.id}>
                <Card className="flex items-center gap-3 p-4">
                  <span aria-hidden className="text-3xl">{a.icon ?? "🏅"}</span>
                  <div>
                    <p className="font-medium text-ink">{a.title}</p>
                    <p className="text-xs text-ink-3">{new Date(a.earned_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Pass a quiz to earn your first badge.</Empty>
        )}
      </div>
    </>
  );
}
