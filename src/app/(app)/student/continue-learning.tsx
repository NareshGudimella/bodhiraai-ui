"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, ProgressBar } from "@/components/ui";
import type { Dashboard } from "@/lib/student-api";

const SHOWN = 5;

/** Continue learning: five rows, then "View more" for the rest (legacy home.blade.php `$clShown`/`$clMore`). */
export function ContinueLearning({ items }: { items: Dashboard["continue_learning"] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, SHOWN);
  const more = items.length - SHOWN;
  return (
    <>
      <ul className="space-y-2">
        {shown.map((c) => (
          <li key={c.lesson_id}>
            <Link href={`/student/lessons/${c.lesson_id}`} className="block">
              <Card className="p-4 transition hover:ring-primary">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-medium text-ink">
                    <span aria-hidden>{c.type === "pdf" ? "📄 " : "▶️ "}</span>
                    {c.title}
                  </p>
                  <span className="shrink-0 text-xs text-ink-3">{c.progress_percent}%</span>
                </div>
                <p className="mb-2 truncate text-xs text-ink-2">
                  {[c.subject, c.chapter, all && c.last_viewed_at].filter(Boolean).join(" · ")}
                </p>
                <ProgressBar value={c.progress_percent} />
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      {more > 0 && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="mt-3 w-full rounded-lg border border-line bg-card py-2 text-sm font-medium text-ink-2 hover:bg-primary-light"
        >
          {all ? "▴ Show less" : `▾ View more (${more} more)`}
        </button>
      )}
    </>
  );
}
