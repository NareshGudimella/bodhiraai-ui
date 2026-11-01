import Link from "next/link";
import { Card, Empty } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import type { Subject } from "@/lib/student-api";

export function SubjectGrid({ subjects }: { subjects: Subject[] }) {
  if (!subjects.length) return <Empty>No subjects are available for your class yet.</Empty>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((s, i) => (
        <li key={s.id}>
          <Link href={`/student/subjects/${s.id}`} className="block h-full">
            <Card className="ccard h-full p-4 transition hover:ring-primary" style={cardTone(i)}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="ccard-tile flex size-11 shrink-0 items-center justify-center rounded-xl text-2xl"
                >
                  {s.icon ?? "📘"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{s.name}</p>
                  <p className="text-xs text-ink-3">
                    {s.grade ? `Grade ${s.grade}` : "All grades"}
                    {s.chapters_count !== undefined && ` · ${s.chapters_count} ${s.chapters_count === 1 ? "chapter" : "chapters"}`}
                    {!!s.completion?.lessons_total && ` · 🎬 ${s.completion.lessons_total} ${s.completion.lessons_total === 1 ? "lesson" : "lessons"}`}
                  </p>
                </div>
              </div>
              {s.description && <p className="mt-3 line-clamp-2 text-sm text-ink-2">{s.description}</p>}
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
