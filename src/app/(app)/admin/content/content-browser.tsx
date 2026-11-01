"use client";

import { useState } from "react";
import { LessonVideo } from "@/components/lesson-video";
import { Card, Pill } from "@/components/ui";
import type { AdminContent, AdminContentLesson } from "@/lib/admin-api";

const clock = (sec: number) => (sec > 0 ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}` : null);

const playable = (l: AdminContentLesson) => l.type === "video" && !!l.playback;

/** Curriculum tree plus the player for the chosen lesson. not in legacy */
export function ContentBrowser({ syllabi }: { syllabi: AdminContent["syllabi"] }) {
  const [lesson, setLesson] = useState<AdminContentLesson | null>(null);
  return (
    <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-4">
        {syllabi.map((sy) => (
          <section key={sy.id ?? 'own'}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-3">{sy.name}</h2>
            {sy.subjects.length ? (
              <ul className="space-y-2">
                {sy.subjects.map((s) => (
                  <li key={s.id}>
                    <details className="rounded-2xl bg-card ring-1 ring-line">
                      <summary className="cursor-pointer px-4 py-3 font-medium text-ink">
                        {s.name}
                        <span className="ml-2 text-xs font-normal text-ink-3">
                          {s.grade ? `Grade ${s.grade}` : "All grades"} · {s.chapters.length} {s.chapters.length === 1 ? "chapter" : "chapters"}
                        </span>
                      </summary>
                      <div className="space-y-3 border-t border-line px-4 py-3">
                        {s.chapters.length ? s.chapters.map((c) => (
                          <div key={c.id}>
                            <p className="text-sm font-semibold text-brand">{c.title}</p>
                            {c.lessons.length ? (
                              <ul className="mt-1 space-y-1">
                                {c.lessons.map((l) => (
                                  <li key={l.id}>
                                    <LessonButton lesson={l} active={lesson?.id === l.id} onPlay={() => setLesson(l)} />
                                  </li>
                                ))}
                              </ul>
                            ) : <p className="mt-1 text-xs text-ink-3">No lessons yet.</p>}
                          </div>
                        )) : <p className="text-xs text-ink-3">No chapters yet.</p>}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            ) : <p className="text-xs text-ink-3">No subjects yet.</p>}
          </section>
        ))}
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start">
        {lesson ? (
          <>
            <LessonVideo key={lesson.id} lessonId={lesson.id} playback={lesson.playback} src={null} poster={lesson.thumbnail} title={lesson.title} />
            <p className="mt-3 font-semibold text-ink">{lesson.title}</p>
            {clock(lesson.duration_sec) && <p className="text-xs text-ink-3">{clock(lesson.duration_sec)}</p>}
          </>
        ) : (
          <Card className="grid aspect-video place-items-center text-center text-sm text-ink-3">Choose a video lesson to watch it here.</Card>
        )}
      </div>
    </div>
  );
}

function LessonButton({ lesson: l, active, onPlay }: { lesson: AdminContentLesson; active: boolean; onPlay: () => void }) {
  const time = clock(l.duration_sec);
  const label = (
    <>
      <span className="min-w-0 truncate">{playable(l) ? "▶" : "📄"} {l.title}</span>
      <span className="flex shrink-0 items-center gap-2 text-xs text-ink-3">
        {time}
        {!playable(l) && <Pill>{l.type}</Pill>}
      </span>
    </>
  );
  if (!playable(l)) return <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-2">{label}</div>;
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-current={active ? "true" : undefined}
      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-ink hover:bg-primary-light aria-[current=true]:bg-primary-light aria-[current=true]:font-semibold"
    >
      {label}
    </button>
  );
}
