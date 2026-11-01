import Link from "next/link";
import { Card, buttonClass } from "@/components/ui";
import { getT } from "@/lib/i18n";
import type { QuizState } from "@/lib/student-api";

/** Quiz call-to-action: locked until every lesson is complete (legacy lessons.blade.php). */
export async function ChapterQuiz({ state }: { state: QuizState }) {
  const { quiz, attempt, all_completed } = state;
  if (!quiz) return null;
  const t = await getT();

  const percent = attempt && attempt.total_marks > 0 ? Math.round((attempt.score / attempt.total_marks) * 100) : 0;
  return (
    <Card className={`mt-6 flex flex-wrap items-center gap-4 ${all_completed || attempt ? "" : "border border-dashed border-line bg-page shadow-none"}`}>
      <span aria-hidden className="text-3xl">{attempt ? (attempt.passed ? "🏆" : "📊") : all_completed ? "📝" : "🔒"}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-3">Chapter quiz</p>
        <p className="font-semibold text-ink">{quiz.title}</p>
        <p className="text-sm text-ink-2">
          {attempt
            ? `You scored ${attempt.score}/${attempt.total_marks} (${percent}%) · ${attempt.passed ? "Passed" : "Not passed yet"}`
            : all_completed
              ? `${quiz.questions_count} questions · ${quiz.duration_min} min`
              : "Finish every lesson in this chapter to unlock the quiz."}
        </p>
      </div>
      {attempt ? (
        <Link href={`/student/attempts/${attempt.id}`} className={buttonClass}>View result</Link>
      ) : all_completed ? (
        <Link href={`/student/quizzes/${quiz.id}`} className={buttonClass}>{t("Take Quiz")}</Link>
      ) : null}
    </Card>
  );
}
