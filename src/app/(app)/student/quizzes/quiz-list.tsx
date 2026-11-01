"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import type { QuizSummary } from "@/lib/student-api";

/** Quiz cards with legacy's subject filter chips. */
export function QuizList({ quizzes }: { quizzes: QuizSummary[] }) {
  const subjects = [...new Set(quizzes.map((q) => q.subject).filter((s): s is string => !!s))];
  const [subject, setSubject] = useState<string | null>(null);
  const shown = quizzes.filter((q) => !subject || q.subject === subject);
  const chip = (label: string, value: string | null) => (
    <button
      key={label}
      type="button"
      aria-pressed={subject === value}
      onClick={() => setSubject(value)}
      className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-ink-2 transition hover:bg-primary-light aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-primary-light"
    >
      {label}
    </button>
  );
  return (
    <>
      {subjects.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {chip("🎯 All quizzes", null)}
          {subjects.map((s) => chip(s, s))}
        </div>
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {shown.map((q, i) => (
          <li key={q.id}>
            <Link href={`/student/quizzes/${q.id}`} className="block h-full">
              <Card className="ccard h-full p-4 transition hover:ring-primary" style={cardTone(i)}>
                <p className="font-semibold text-ink">{q.title}</p>
                <p className="mt-1 text-xs text-ink-2">{[q.subject, q.chapter].filter(Boolean).join(" · ")}</p>
                <p className="mt-3 text-xs text-ink-3">
                  {q.questions_count} questions · {q.duration_min} min · {q.total_marks} marks
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
