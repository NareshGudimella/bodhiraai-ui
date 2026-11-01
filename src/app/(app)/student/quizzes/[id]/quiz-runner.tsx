"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Card, buttonClass, secondaryButtonClass } from "@/components/ui";
import { startQuiz, submitQuiz, type Celebration } from "@/lib/student-actions";
import type { Question, Quiz } from "@/lib/student-api";

const optionKey = (o: NonNullable<Question["options"]>[number]) => o.key ?? o.value ?? o.text ?? "";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<{ id: number; questions: Question[] } | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [remaining, setRemaining] = useState(quiz.duration_min * 60);
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ attemptId: number; data: Celebration } | null>(null);
  const [pending, startTransition] = useTransition();
  const submitted = useRef(false);

  const submit = useCallback(() => {
    if (!attempt || submitted.current) return;
    submitted.current = true;
    startTransition(async () => {
      const result = await submitQuiz(attempt.id, answers);
      if (!result.ok) {
        submitted.current = false;
        setError(result.message);
        return;
      }
      if (result.celebration) setCelebration({ attemptId: result.attemptId, data: result.celebration });
      else router.push(`/student/attempts/${result.attemptId}`);
    });
  }, [attempt, answers, router]);

  // Countdown from the full duration on each visit, like the legacy quiz page; auto-submits at 0.
  useEffect(() => {
    if (!attempt) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [attempt]);

  useEffect(() => {
    if (attempt && remaining === 0) submit();
  }, [attempt, remaining, submit]);

  // Warn before leaving an unfinished attempt.
  useEffect(() => {
    if (!attempt || celebration) return;
    const warn = (e: BeforeUnloadEvent) => {
      if (!submitted.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [attempt, celebration]);

  function begin() {
    setError(null);
    startTransition(async () => {
      try {
        const { attempt: a, quiz: q } = await startQuiz(quiz.id);
        setAttempt({ id: a.id, questions: q.questions ?? [] });
      } catch {
        setError("Could not start the quiz. Try again.");
      }
    });
  }

  if (celebration) return <CelebrationPanel {...celebration} />;

  if (!attempt) {
    return (
      <Card className="max-w-xl">
        {quiz.description && <p className="mb-4 text-sm text-ink-2">{quiz.description}</p>}
        <dl className="mb-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Questions", quiz.questions?.length ?? 0],
            ["Minutes", quiz.duration_min],
            ["Pass mark", `${quiz.pass_marks}/${quiz.total_marks}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-primary-light p-3">
              <dt className="text-xs text-ink-3">{label}</dt>
              <dd className="text-lg font-bold text-brand">{value}</dd>
            </div>
          ))}
        </dl>
        {error && <p role="alert" className="mb-3 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{error}</p>}
        <button type="button" onClick={begin} disabled={pending} className={buttonClass}>
          {pending ? "Starting…" : "Start quiz"}
        </button>
      </Card>
    );
  }

  const answered = Object.keys(answers).length;
  const total = attempt.questions.length;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between gap-3 border-b border-line bg-page/95 px-6 py-3 backdrop-blur">
        <span className="text-sm text-ink-2">
          {answered}/{total} answered
        </span>
        <span
          role="timer"
          aria-label="Time remaining"
          className={`rounded-lg px-3 py-1 font-mono text-lg font-bold ${remaining <= 60 ? "bg-danger-light text-danger" : "bg-brand text-primary-light"}`}
        >
          ⏱ {mm}:{ss}
        </span>
      </div>

      <ol className="space-y-4">
        {attempt.questions.map((q, i) => (
          <li key={q.id}>
            <Card>
              <fieldset>
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-3">
                  Question {i + 1} of {total} · {q.marks} {q.marks === 1 ? "mark" : "marks"}
                </legend>
                <p className="mb-3 font-medium text-ink">{q.body}</p>
                <div className="space-y-2">
                  {(q.options ?? []).map((o) => {
                    const key = optionKey(o);
                    return (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3 py-2.5 text-sm transition hover:bg-primary-light has-checked:border-primary has-checked:bg-primary-light"
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={key}
                          checked={answers[q.id] === key}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: key }))}
                          className="accent-brand"
                        />
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-card text-xs font-bold text-brand ring-1 ring-line">
                          {key}
                        </span>
                        <span className="text-ink">{o.text ?? key}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </Card>
          </li>
        ))}
      </ol>

      {error && <p role="alert" className="mt-4 rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">{error}</p>}
      <div className="mt-6 flex items-center gap-3">
        <button type="submit" disabled={pending || answered < total} className={buttonClass}>
          {pending ? "Submitting…" : "Submit quiz →"}
        </button>
        {answered < total && <span className="text-sm text-ink-3">Answer every question to submit.</span>}
      </div>
    </form>
  );
}

const TIER_STYLE: Record<string, string> = {
  bronze: "from-[#F6D9B8] via-[#CD7F32] to-[#8C5A24]",
  silver: "from-[#F4F7FA] via-[#AEB8C2] to-[#7D8893]",
  gold: "from-[#FFF1C9] via-[#F5C84B] to-[#C9982E]",
  platinum: "from-[#EAFBFF] via-[#B9F2FF] to-[#6DD5FA]",
};

/** Newly earned badges after a passed quiz (legacy partials/badge-celebration). */
function CelebrationPanel({ attemptId, data }: { attemptId: number; data: Celebration }) {
  return (
    <Card className="mx-auto max-w-lg text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">Badge unlocked</p>
      <div
        className={`mx-auto mt-4 flex size-28 items-center justify-center rounded-full bg-linear-to-br text-5xl shadow-lg ${TIER_STYLE[data.headline.tier] ?? TIER_STYLE.bronze}`}
        aria-hidden
      >
        {data.headline.icon}
      </div>
      <h2 className="mt-4 text-2xl font-bold text-brand">{data.headline.title}</h2>
      <p className="text-sm text-ink-2">{data.headline.desc}</p>
      <p className="mt-3 text-sm text-ink">
        Score {data.score_percent}% · <strong>+{data.xp} XP</strong> · Level {data.progress.level}
      </p>
      {data.badges.length > 1 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {data.badges.slice(1).map((b) => (
            <li key={b.key} className="rounded-full bg-primary-light px-3 py-1 text-sm text-ink">
              {b.icon} {b.title}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link href={`/student/attempts/${attemptId}`} className={buttonClass}>
          See result
        </Link>
        <Link href="/student/badges" className={secondaryButtonClass}>
          My badges
        </Link>
      </div>
    </Card>
  );
}
