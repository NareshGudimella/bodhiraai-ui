"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { Card, ProgressBar, buttonClass } from "@/components/ui";
import { saveProgress } from "@/lib/student-actions";
import type { Progress } from "@/lib/student-api";

/** Sends watch progress at most every 5 s while a video plays (legacy lesson.blade.php). */
const TICK_MS = 5000;

export function LessonPlayer({
  lessonId,
  type,
  title,
  src,
  poster,
  body,
  durationSec,
  initial,
  overlay,
}: {
  lessonId: number;
  type: string;
  title: string;
  src: string | null;
  poster: string | null;
  body: string | null;
  durationSec: number;
  initial: Progress;
  /** The "Ask AI" button, floated over the content (legacy `.ask-ai-fab`). */
  overlay?: ReactNode;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTick = useRef(0);
  const [progress, setProgress] = useState(initial);
  const [videoError, setVideoError] = useState(false);
  const [pending, startTransition] = useTransition();
  const done = progress.status === "completed";

  function apply(next: Progress | null) {
    if (!next) return;
    const justCompleted = next.status === "completed" && progress.status !== "completed";
    setProgress(next);
    // Re-render the server parts (chapter quiz unlock) once the lesson completes.
    if (justCompleted) router.refresh();
  }

  function onTimeUpdate() {
    const now = Date.now();
    if (done || now - lastTick.current < TICK_MS || !videoRef.current) return;
    lastTick.current = now;
    void saveProgress(lessonId, videoRef.current.currentTime).then(apply);
  }

  function markComplete() {
    const v = videoRef.current;
    const watched = v ? v.currentTime || v.duration || 0 : durationSec;
    startTransition(async () => apply(await saveProgress(lessonId, watched, true)));
  }

  return (
    <>
      {type === "video" && src ? (
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
          {overlay && <div className="absolute right-3 top-3 z-10">{overlay}</div>}
          <video
            ref={videoRef}
            controls
            playsInline
            controlsList="nodownload"
            preload="metadata"
            poster={poster ?? undefined}
            onTimeUpdate={onTimeUpdate}
            onError={() => setVideoError(true)}
            className="size-full object-contain"
          >
            <source src={src} type="video/mp4" />
          </video>
          {videoError && (
            <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center text-white">
              <div>
                <p className="text-4xl" aria-hidden>⚠️</p>
                <p className="mt-2 font-semibold">Video unavailable</p>
                <a href={src} target="_blank" rel="noopener" className="mt-1 block break-all text-xs text-primary">
                  {src}
                </a>
              </div>
            </div>
          )}
        </div>
      ) : type === "pdf" && src ? (
        <div className="relative">
          {overlay && <div className="absolute right-6 top-3 z-10">{overlay}</div>}
          <iframe src={src} title={title} className="h-[75vh] min-h-120 w-full rounded-2xl border border-line bg-[#1a1a1a]" />
        </div>
      ) : body ? (
        <Card className="relative">
          {overlay && <div className="absolute right-3 top-3">{overlay}</div>}
          <div className="whitespace-pre-line pr-32 text-[15px] leading-7 text-ink">{body}</div>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-ink-3">This lesson has no content yet.</p>
        </Card>
      )}

      <Card className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="text-ink-2">{progress.progress_percent}% complete</span>
          <button type="button" onClick={markComplete} disabled={done || pending} className={buttonClass}>
            {done ? "✅ Completed" : pending ? "Saving…" : "Mark complete"}
          </button>
        </div>
        <ProgressBar value={progress.progress_percent} done={done} />
        {type === "video" && body && (
          <details className="mt-4 text-sm text-ink-2">
            <summary className="cursor-pointer font-medium text-ink">Lesson notes</summary>
            <div className="mt-2 whitespace-pre-line leading-6">{body}</div>
          </details>
        )}
      </Card>
    </>
  );
}
