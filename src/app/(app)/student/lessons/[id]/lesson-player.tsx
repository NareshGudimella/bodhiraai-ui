"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { LessonVideo } from "@/components/lesson-video";
import { Card, ProgressBar, buttonClass, secondaryButtonClass } from "@/components/ui";
import { lessonFileUrl, saveProgress } from "@/lib/student-actions";
import { isSignedFileUrl, signedFileExpiry } from "@/lib/signed-file";
import type { Progress } from "@/lib/student-api";

/** Sends watch progress at most every 5 s while a video plays (legacy lesson.blade.php). */
const TICK_MS = 5000;

export function LessonPlayer({
  lessonId,
  type,
  playback,
  title,
  src,
  poster,
  body,
  durationSec,
  initial,
  overlay,
  labels,
}: {
  lessonId: number;
  type: string;
  /** API `playback`: "vdocipher" plays through VdoCipher (security: not in legacy). */
  playback?: "vdocipher" | "url" | null;
  title: string;
  src: string | null;
  poster: string | null;
  body: string | null;
  durationSec: number;
  initial: Progress;
  /** The "Ask AI" button, floated over the content (legacy `.ask-ai-fab`). */
  overlay?: ReactNode;
  /** Legacy __() strings, translated on the server (lib/i18n.ts is server-only). */
  labels: { markComplete: string; completed: string; notes: string };
}) {
  const router = useRouter();
  const position = useRef({ current: 0, duration: 0 });
  const lastTick = useRef(0);
  const [progress, setProgress] = useState(initial);
  const [pending, startTransition] = useTransition();
  const done = progress.status === "completed";

  function apply(next: Progress | null) {
    if (!next) return;
    const justCompleted = next.status === "completed" && progress.status !== "completed";
    setProgress(next);
    // Re-render the server parts (chapter quiz unlock) once the lesson completes.
    if (justCompleted) router.refresh();
  }

  function onTime(current: number, duration: number) {
    position.current = { current, duration };
    const now = Date.now();
    if (done || now - lastTick.current < TICK_MS) return;
    lastTick.current = now;
    void saveProgress(lessonId, current).then(apply);
  }

  /** The end always reports the final position (the 90% rule completes the lesson). */
  function onEnded(current: number, duration: number) {
    position.current = { current, duration };
    if (done) return;
    lastTick.current = Date.now();
    void saveProgress(lessonId, current).then(apply);
  }

  const isVideo = type === "video" && (playback === "vdocipher" || !!src);

  function markComplete() {
    const { current, duration } = position.current;
    const watched = isVideo ? current || duration || 0 : durationSec;
    startTransition(async () => apply(await saveProgress(lessonId, watched, true)));
  }

  return (
    <>
      {isVideo ? (
        <LessonVideo
          lessonId={lessonId}
          playback={playback}
          src={src}
          poster={poster}
          title={title}
          overlay={overlay}
          onTime={onTime}
          onEnded={onEnded}
        />
      ) : type === "pdf" && src ? (
        <PdfViewer key={src} lessonId={lessonId} src={src} title={title} overlay={overlay} />
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
            {done ? `✅ ${labels.completed}` : pending ? "Saving…" : labels.markComplete}
          </button>
        </div>
        <ProgressBar value={progress.progress_percent} done={done} />
        {type === "video" && body && (
          <details className="mt-4 text-sm text-ink-2">
            <summary className="cursor-pointer font-medium text-ink">📄 {labels.notes}</summary>
            <div className="mt-2 whitespace-pre-line leading-6">{body}</div>
          </details>
        )}
      </Card>
    </>
  );
}

/** Refresh a signed link this long before it expires. */
const REFRESH_AHEAD_MS = 60_000;

/**
 * An uploaded PDF. Its signed `/files/...` link expires (30 min): shortly
 * before, a fresh link is fetched (Server Action). A document still loading
 * switches to it at once; an open one keeps its place, and a "Reload document"
 * button appears for when the viewer needs more of the file. A load that got
 * the 403 JSON instead of the PDF (same origin) also refreshes.
 * security: not in legacy (legacy links never expire)
 */
function PdfViewer({ lessonId, src: initialSrc, title, overlay }: { lessonId: number; src: string; title: string; overlay?: ReactNode }) {
  const [src, setSrc] = useState(initialSrc);
  const [stale, setStale] = useState(false);
  const [pending, startTransition] = useTransition();
  const loaded = useRef(false);
  const lastRefresh = useRef(0);

  function reload(onlyIfNotOpen = false) {
    lastRefresh.current = Date.now();
    startTransition(async () => {
      const url = await lessonFileUrl(lessonId).catch(() => null);
      if (!url) return;
      if (onlyIfNotOpen && loaded.current) {
        setStale(true);
        return;
      }
      loaded.current = false;
      setStale(false);
      setSrc(url);
    });
  }
  const reloadRef = useRef(reload);
  useEffect(() => {
    reloadRef.current = reload;
  });

  useEffect(() => {
    const exp = signedFileExpiry(src);
    if (!exp) return;
    const timer = window.setTimeout(() => reloadRef.current(true), Math.max(0, exp - REFRESH_AHEAD_MS - Date.now()));
    return () => window.clearTimeout(timer);
  }, [src]);

  const signed = isSignedFileUrl(src);
  const retryOnce = () => {
    if (signed && Date.now() - lastRefresh.current > 10_000) reload();
  };

  return (
    <div className="relative">
      {overlay && <div className="absolute right-6 top-3 z-10">{overlay}</div>}
      <iframe
        key={src}
        src={src}
        title={title}
        onLoad={(e) => {
          loaded.current = true;
          // Same-origin links only (production); a cross-origin frame throws and is left alone.
          try {
            if (e.currentTarget.contentDocument?.contentType === "application/json") retryOnce();
          } catch {
            // cross-origin
          }
        }}
        onError={retryOnce}
        className="h-[75vh] min-h-120 w-full rounded-2xl border border-line bg-[#1a1a1a]"
      />
      {stale && (
        <div className="mt-2 flex justify-end">
          <button type="button" onClick={() => reload()} disabled={pending} className={secondaryButtonClass}>
            {pending ? "Reloading…" : "Reload document"}
          </button>
        </div>
      )}
    </div>
  );
}
