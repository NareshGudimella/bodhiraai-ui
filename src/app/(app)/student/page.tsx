import Link from "next/link";
import { Card, Empty, PageHeader, SectionTitle, Stat } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { studentApi } from "@/lib/student-api";
import { ContinueLearning } from "./continue-learning";
import { PerformanceOverview } from "./performance";
import { SubjectGrid } from "./subjects/subject-grid";

export default async function StudentHome() {
  const data = await studentApi.home();
  const { student, stats, continue_learning, subjects, upcoming_quizzes } = data;

  return (
    <>
      <PageHeader
        title={`Hi, ${student.name.split(" ")[0]} 👋`}
        subtitle={[student.grade && `Grade ${student.grade}`, student.school].filter(Boolean).join(" · ") || undefined}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Streak" value={`${stats.streak_days} 🔥`} hint="days in a row" />
        <Stat label="XP" value={stats.xp.toLocaleString("en-IN")} />
        <Stat
          label="Lessons"
          value={`${stats.lessons_completed}/${stats.lessons_total}`}
          hint={`${stats.completion_percent}% complete`}
        />
        <Stat label="Subjects" value={stats.subjects_count} />
      </div>

      <PerformanceOverview data={data} />

      <div className="mt-8 grid gap-8 [&>*]:min-w-0 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0">
          <SectionTitle>Continue learning</SectionTitle>
          {continue_learning.length ? (
            <ContinueLearning items={continue_learning} />
          ) : (
            <Empty>Start a lesson and it will show up here.</Empty>
          )}
        </div>

        <div>
          <SectionTitle>Up next: quizzes</SectionTitle>
          {upcoming_quizzes.length ? (
            <ul className="space-y-2">
              {upcoming_quizzes.map((q, i) => (
                <li key={q.id}>
                  <Link href={`/student/quizzes/${q.id}`} className="block">
                    <Card className="ccard p-4 transition hover:ring-primary" style={cardTone(i)}>
                      <p className="font-medium text-ink">{q.title}</p>
                      <p className="text-xs text-ink-2">
                        {q.subject} · {q.questions_count} questions · {q.duration_min} min
                      </p>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No pending quizzes. Nice work!</Empty>
          )}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle>Your subjects</SectionTitle>
        <SubjectGrid subjects={subjects} />
      </div>
    </>
  );
}
