import Link from "next/link";
import { Card, PageHeader, Pill, Stat, buttonClass, secondaryButtonClass } from "@/components/ui";
import { answerText, givenAnswers, optionParts } from "@/lib/student-answers";
import { studentApi } from "@/lib/student-api";

export default async function AttemptResultPage({ params }: PageProps<"/student/attempts/[id]">) {
  const a = await studentApi.attempt((await params).id);
  const subjectId = a.quiz.subject?.id;

  return (
    <>
      <PageHeader
        back={{ href: "/student/quizzes", label: "Quizzes" }}
        title={`${a.passed ? "🏆" : "📊"} ${a.quiz.title}`}
        subtitle={a.passed ? "You passed. Great work!" : `You need ${a.quiz.pass_marks}/${a.total_marks} to pass. Review the answers below.`}
        action={
          subjectId ? (
            <Link href={`/student/subjects/${subjectId}`} className={buttonClass}>
              Back to {a.quiz.subject?.name}
            </Link>
          ) : undefined
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Score" value={`${a.score}/${a.total_marks}`} />
        <Stat label="Percent" value={`${a.percent}%`} />
        <Stat label="Result" value={a.passed ? "Pass" : "Retry"} />
      </div>

      <ol className="mt-6 space-y-3">
        {a.answers.map((ans, i) => {
          const given = givenAnswers(ans.answer);
          const correct = (ans.correct_answer ?? []).map(String);
          const options = ans.options ?? [];
          return (
            <li key={ans.question_id}>
              <Card>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="font-medium text-ink">
                    {i + 1}. {ans.body}
                  </p>
                  <Pill tone={ans.is_correct ? "success" : "neutral"}>
                    {ans.is_correct ? `✓ ${ans.marks_awarded}/${ans.marks}` : `✗ 0/${ans.marks}`}
                  </Pill>
                </div>

                {options.length ? (
                  <ul className="space-y-1.5">
                    {options.map((opt) => {
                      const { key, text } = optionParts(opt);
                      const isCorrect = correct.includes(key);
                      const isGiven = given.includes(key);
                      return (
                        <li
                          key={key}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                            isCorrect
                              ? "border-success/40 bg-success/10 text-ink"
                              : isGiven
                                ? "border-danger/40 bg-danger-light text-ink"
                                : "border-line text-ink-2"
                          }`}
                        >
                          <span className="font-semibold">{key}.</span>
                          <span className="min-w-0 flex-1">{text}</span>
                          {isCorrect ? (
                            <span className="text-xs font-bold text-success">✓ Correct</span>
                          ) : isGiven ? (
                            <span className="text-xs font-bold text-danger">Your answer</span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-2">
                    Your answer: <strong>{answerText(given, null)}</strong>
                    {!ans.is_correct && correct.length > 0 && (
                      <> · Correct: <strong className="text-success">{answerText(correct, null)}</strong></>
                    )}
                  </p>
                )}
                {ans.explanation && (
                  <p className="mt-3 text-sm text-ink-3">
                    <b>💡 Explanation:</b> {ans.explanation}
                  </p>
                )}
              </Card>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/student/quizzes" className={secondaryButtonClass}>← Back to quizzes</Link>
        <Link href={`/student/quizzes/${a.quiz.id}`} className={buttonClass}>🔁 Try again</Link>
      </div>
    </>
  );
}
