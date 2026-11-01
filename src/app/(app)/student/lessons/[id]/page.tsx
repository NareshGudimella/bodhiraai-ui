import Link from "next/link";
import { PageHeader, secondaryButtonClass } from "@/components/ui";
import { mediaUrl } from "@/lib/media";
import { askAi } from "@/lib/student-actions";
import { studentApi } from "@/lib/student-api";
import { ChapterQuiz } from "../../chapter-quiz";
import { LessonPlayer } from "./lesson-player";

const clock = (sec: number) => (sec ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}` : "--:--");

const askClass =
  "inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-primary-light shadow-md transition hover:bg-brand-mid";

export default async function LessonPage({ params }: PageProps<"/student/lessons/[id]">) {
  const { lesson, progress, siblings } = await studentApi.lesson((await params).id);
  const { quiz_state } = await studentApi.chapterLessons(String(lesson.chapter_id));

  const index = siblings.findIndex((s) => s.id === lesson.id);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  const chapter = lesson.chapter;
  const done = new Set(quiz_state.completed_ids);

  // Legacy lesson.blade.php:108-170: the first question each "Ask AI" button sends.
  const where = [chapter?.subject?.name, chapter?.title].filter(Boolean).join(" → ");
  const prompt =
    lesson.type === "video" && lesson.content_url
      ? `I'm watching '${lesson.title}'${where ? ` from ${where}` : ""}. Can you explain the key concepts?`
      : lesson.type === "pdf" && lesson.content_url
        ? `I'm reading '${lesson.title}'. Can you help me understand it?`
        : `I'm reading '${lesson.title}'. Can you explain it more clearly?`;
  const hasContent = !!lesson.content_url || !!lesson.content_body;

  return (
    <>
      <PageHeader
        back={{ href: `/student/chapters/${lesson.chapter_id}`, label: chapter?.title ?? "Chapter" }}
        title={lesson.title}
        subtitle={[
          chapter?.subject?.name,
          index >= 0 && `Lesson ${index + 1} of ${siblings.length}`,
          lesson.duration_sec > 0 && lesson.duration_label,
        ]
          .filter(Boolean)
          .join(" · ")}
        action={
          <form action={askAi.bind(null, `I have a doubt about '${lesson.title}'. Can you help?`)}>
            <button type="submit" className={secondaryButtonClass}>🤖 Ask AI</button>
          </form>
        }
      />

      <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <LessonPlayer
            lessonId={lesson.id}
            type={lesson.type}
            title={lesson.title}
            src={mediaUrl(lesson.content_url)}
            poster={mediaUrl(lesson.thumbnail)}
            body={lesson.content_body ?? null}
            durationSec={lesson.duration_sec}
            initial={progress}
            overlay={
              hasContent ? (
                <form action={askAi.bind(null, prompt)}>
                  <button type="submit" className={askClass}>🤖 Ask AI</button>
                </form>
              ) : undefined
            }
          />

          <nav aria-label="Lesson navigation" className="mt-6 flex flex-wrap justify-between gap-3">
            {prev ? (
              <Link href={`/student/lessons/${prev.id}`} className={secondaryButtonClass}>
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/student/lessons/${next.id}`} className={secondaryButtonClass}>
                {next.title} →
              </Link>
            )}
          </nav>

          <ChapterQuiz state={quiz_state} />
        </div>

        <aside aria-label="Chapter playlist" className="h-fit rounded-2xl bg-card p-4 ring-1 ring-line">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-brand">Chapter playlist</h2>
            <span className="text-xs text-ink-3">{siblings.length} lessons</span>
          </div>
          <ol className="space-y-1">
            {siblings.map((s) => {
              const isNow = s.id === lesson.id;
              const isDone = done.has(s.id);
              // Legacy locks lessons after the current one until you get there.
              const locked = !isNow && !isDone && s.sort_order > lesson.sort_order;
              const state = isNow ? "Now playing" : isDone ? "Completed" : locked ? "Locked" : "";
              const body = (
                <>
                  <span
                    aria-hidden
                    className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm ${
                      isNow ? "bg-brand text-primary-light" : isDone ? "bg-success/15 text-success" : "bg-primary-light text-ink-2"
                    }`}
                  >
                    {isNow ? "▶" : isDone ? "✓" : locked ? "🔒" : "▶"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{s.title}</span>
                    <span className="block text-xs text-ink-3">{[state, clock(s.duration_sec)].filter(Boolean).join(" · ")}</span>
                  </span>
                </>
              );
              return (
                <li key={s.id}>
                  {locked ? (
                    <span aria-disabled="true" className="flex items-center gap-3 rounded-xl p-2 opacity-55">{body}</span>
                  ) : (
                    <Link
                      href={`/student/lessons/${s.id}`}
                      aria-current={isNow ? "page" : undefined}
                      className="flex items-center gap-3 rounded-xl p-2 hover:bg-primary-light aria-[current=page]:bg-primary-light"
                    >
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </>
  );
}
