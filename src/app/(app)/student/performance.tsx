import Link from "next/link";
import { Card, ProgressBar } from "@/components/ui";
import { getT } from "@/lib/i18n";
import type { Dashboard } from "@/lib/student-api";

/** Legacy home.blade.php "Performance Overview": completion donut, subject scores, mini metrics, profile completion, achievements. */
export async function PerformanceOverview({ data }: { data: Dashboard }) {
  const { stats, performance: perf, continue_learning } = data;
  const t = await getT();

  const total = stats.lessons_total;
  const done = stats.lessons_completed;
  const inProgress = Math.min(Math.max(0, total - done), continue_learning.length);
  const notStarted = Math.max(0, total - done - inProgress);
  const doneP = total > 0 ? Math.round((done / total) * 100) : 0;
  const inP = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const nsP = Math.max(0, 100 - doneP - inP);

  const pc = Math.max(0, Math.min(100, data.profile_completion_percent));
  const circ = 326.726;

  // Achievements derived from real stats (legacy `$ach`).
  const ach: { icon: string; name: string; sub: string; xp: string }[] = [];
  if (stats.streak_days >= 7) ach.push({ icon: "🏅", name: "Consistency King", sub: `${stats.streak_days} day streak`, xp: "+50 XP" });
  if (perf.overall_score >= 80) ach.push({ icon: "🎯", name: "Subject Master", sub: `Top score ${perf.overall_score}%`, xp: "+40 XP" });
  if (stats.lessons_completed >= 5) ach.push({ icon: "⚡", name: "Quick Learner", sub: `${stats.lessons_completed} lessons done`, xp: "+30 XP" });

  return (
    <div className="mt-8 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
      <Card>
        <h2 className="mb-4 text-lg font-bold text-brand">📊 {t("Performance Overview")}</h2>

        <div className="grid gap-6 [&>*]:min-w-0 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-ink-2">Course completion status</p>
            <div className="flex flex-wrap items-center gap-5">
              <div
                role="img"
                aria-label={`${doneP}% of lessons completed`}
                className="grid size-32 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(var(--success) 0 ${doneP}%, #E0A93B ${doneP}% ${doneP + inP}%, var(--border) ${doneP + inP}% 100%)`,
                }}
              >
                <div className="grid size-24 place-items-center rounded-full bg-card text-center">
                  <div>
                    <p className="text-2xl font-bold text-brand">{doneP}%</p>
                    <p className="text-[11px] text-ink-3">{t("Completed")}</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-ink-2">
                <li><i className="mr-2 inline-block size-2.5 rounded-full bg-success" />{t("Completed")} <b className="text-ink">{doneP}% ({done})</b></li>
                <li><i className="mr-2 inline-block size-2.5 rounded-full bg-[#E0A93B]" />In progress <b className="text-ink">{inP}% ({inProgress})</b></li>
                <li><i className="mr-2 inline-block size-2.5 rounded-full bg-line" />Not started <b className="text-ink">{nsP}% ({notStarted})</b></li>
              </ul>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-ink-2">Subject-wise scores</p>
            {perf.subject_scores.length ? (
              <div className="flex h-32 items-end gap-3">
                {perf.subject_scores.map((s) => (
                  <div key={s.name} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-xs font-semibold text-ink">{s.percent}%</span>
                    <div className="flex w-full flex-1 items-end overflow-hidden rounded-md bg-primary-light">
                      <div className="w-full rounded-md bg-brand-lift" style={{ height: `${Math.max(6, s.percent)}%` }} />
                    </div>
                    <span className="w-full truncate text-center text-[11px] text-ink-3" title={s.name}>{s.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-3">Take a quiz to see your subject-wise scores here.</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-primary-light/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Enrolled subjects</p>
            <p className="text-2xl font-bold text-brand">{stats.subjects_count}</p>
            <p className="mb-2 text-xs text-ink-2">{stats.completion_percent}% of lessons complete</p>
            <ProgressBar value={stats.completion_percent} />
          </div>
          <div className="rounded-xl bg-primary-light/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Average score</p>
            <p className="text-2xl font-bold text-brand">{perf.overall_score}%</p>
            <p className="mb-2 text-xs text-ink-2">{perf.tests_passed}/{perf.tests_total} quizzes passed</p>
            <ProgressBar value={perf.overall_score} />
          </div>
          <div className="rounded-xl bg-primary-light/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Total XP earned</p>
            <p className="text-2xl font-bold text-brand">{stats.xp.toLocaleString("en-IN")} XP</p>
            <p className="mb-2 text-xs text-ink-2">Level {stats.level} · next level in {stats.xp_to_next} XP</p>
            <ProgressBar value={stats.level_percent} done />
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <p className="mb-3 text-sm font-semibold text-ink-2">Profile completion</p>
          <div className="relative mx-auto size-28">
            <svg viewBox="0 0 120 120" className="size-full" role="img" aria-label={`Profile ${pc}% complete`}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="11" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="var(--brand-lift)" strokeWidth="11" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - pc / 100)} transform="rotate(-90 60 60)"
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-xl font-bold text-brand">{pc}%</span>
          </div>
          <p className="mt-3 text-center text-xs text-ink-2">Complete your profile to unlock more features.</p>
          <Link href="/student/settings" className="mt-3 block text-center text-sm font-medium text-primary-dark hover:underline">
            Complete profile
          </Link>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-semibold text-ink-2">Recent achievements</p>
          {ach.length ? (
            <>
              <ul className="space-y-3">
                {ach.map((a) => (
                  <li key={a.name} className="flex items-center gap-3">
                    <span aria-hidden className="grid size-10 place-items-center rounded-xl bg-primary-light text-xl">{a.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{a.name}</span>
                      <span className="block text-xs text-ink-3">{a.sub}</span>
                    </span>
                    <span className="text-xs font-bold text-success">{a.xp}</span>
                  </li>
                ))}
              </ul>
              <Link href="/student/profile" className="mt-3 block text-sm font-medium text-primary-dark hover:underline">View all →</Link>
            </>
          ) : (
            <p className="text-sm text-ink-3">🏆 Start your journey! Complete lessons &amp; quizzes to earn badges.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
