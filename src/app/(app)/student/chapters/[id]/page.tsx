import Link from "next/link";
import { Card, Empty, PageHeader, Pill } from "@/components/ui";
import { cardTone } from "@/lib/appearance";
import { studentApi } from "@/lib/student-api";
import { ChapterQuiz } from "../../chapter-quiz";

const TYPE_ICON: Record<string, string> = { video: "▶️", pdf: "📄", text: "📖" };

export default async function ChapterPage({ params }: PageProps<"/student/chapters/[id]">) {
  const { chapter, lessons, quiz_state } = await studentApi.chapterLessons((await params).id);
  const done = new Set(quiz_state.completed_ids);

  return (
    <>
      <PageHeader
        back={{ href: `/student/subjects/${chapter.subject_id}`, label: "Chapters" }}
        title={chapter.title}
        subtitle={`${done.size} of ${lessons.length} lessons complete`}
      />
      {lessons.length ? (
        <ol className="space-y-2">
          {lessons.map((l, i) => (
            <li key={l.id}>
              <Link href={`/student/lessons/${l.id}`} className="block">
                <Card className="ccard flex items-center gap-4 p-4 transition hover:ring-primary" style={cardTone(i)}>
                  <span aria-hidden className="text-xl">
                    {done.has(l.id) ? "✅" : (TYPE_ICON[l.type] ?? "📘")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{l.title}</p>
                    <p className="text-xs capitalize text-ink-3">
                      {l.type}
                      {l.duration_sec > 0 && ` · ${l.duration_label}`}
                    </p>
                  </div>
                  {l.is_free && <Pill>Free</Pill>}
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <Empty>No lessons have been published in this chapter yet.</Empty>
      )}
      <ChapterQuiz state={quiz_state} />
    </>
  );
}
