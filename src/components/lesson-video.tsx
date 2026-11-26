"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { lessonPlayback, type LessonPlayback } from "@/lib/playback-actions";
import { HlsPlayer } from "@/components/hls-player";
import { isSignedFileUrl, signedFileExpiry } from "@/lib/signed-file";

/**
 * A lesson's video. `playback === "hls"`: asks the API for a short-lived
 * playlist URL (Server Action, so the token stays on the server) and plays our
 * encrypted HLS in `HlsPlayer`, with a moving watermark naming the viewer.
 * Otherwise the plain `<video>` with downloads, picture in
 * picture and the context menu turned off. Shared by every role that may play
 * lessons (students, teachers of the subject, and school admins for
 * their curricula; not in legacy).
 * security: not in legacy
 */

export type LessonVideoProps = {
  lessonId: number;
  /** `processing`: an upload still being transcoded (not in legacy). */
  playback: "hls" | "url" | "processing" | null | undefined;
  /** The lesson's `content_url` (signed or external), for the `url` player; null fetches it via the playback action. */
  src: string | null;
  poster: string | null;
  title: string;
  /** Floated over the player (the student's "Ask AI" button). */
  overlay?: ReactNode;
  /** Every time update: current position and duration, in seconds. */
  onTime?: (current: number, duration: number) => void;
  onEnded?: (current: number, duration: number) => void;
};

export function LessonVideo(props: LessonVideoProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
      {props.overlay && <div className="absolute right-3 top-3 z-10">{props.overlay}</div>}
      {props.playback === "processing" ? (
        <ProcessingNotice />
      ) : props.playback === "hls" || (props.playback === "url" && !props.src) ? (
        // A `url` lesson without its link (the admin content list doesn't send one) fetches it too.
        <HlsLesson {...props} />
      ) : props.src ? (
        <UrlVideo {...props} src={props.src} />
      ) : (
        <Notice icon title="Video unavailable" />
      )}
    </div>
  );
}

/** Refresh a signed link this long before it expires. */
const REFRESH_AHEAD_MS = 60_000;

/**
 * Plain `<video>`. A signed `/files/...` link expires (30 min), after which
 * the next byte-range request answers 403 and the video errors: fetch a fresh
 * link (the playback Server Action) and carry on from the same position, also
 * shortly before the link expires so playback doesn't stall.
 * security: not in legacy (legacy links never expire)
 */
function UrlVideo({ lessonId, src: initialSrc, poster, onTime, onEnded }: LessonVideoProps & { src: string }) {
  const [src, setSrc] = useState(initialSrc);
  const [shownSrc, setShownSrc] = useState(initialSrc);
  const [error, setError] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const playing = useRef(false);
  // Where to carry on once the new link's metadata has loaded.
  const resume = useRef<{ at: number; play: boolean } | null>(null);
  const lastRefresh = useRef(0);
  const refreshing = useRef(false);

  // A new lesson (or a new link from the server): start over with it.
  if (initialSrc !== shownSrc) {
    setShownSrc(initialSrc);
    setSrc(initialSrc);
    setError(false);
  }

  const report = (fn: LessonVideoProps["onTime"]) => (e: SyntheticEvent<HTMLVideoElement>) =>
    fn?.(e.currentTarget.currentTime, e.currentTarget.duration || 0);

  /** A fresh signed link for this lesson; false when none could be had. */
  async function refreshLink(): Promise<boolean> {
    if (refreshing.current) return true;
    refreshing.current = true;
    lastRefresh.current = Date.now();
    const v = video.current;
    const at = v?.currentTime ?? 0;
    const play = playing.current;
    try {
      const p = await lessonPlayback(lessonId);
      if (p.ok && p.provider === "url") {
        resume.current = { at, play };
        setSrc(p.url);
        setError(false);
        return true;
      }
    } catch {
      // fall through: show the error
    } finally {
      refreshing.current = false;
    }
    return false;
  }
  // Latest closure for the timer below.
  const refreshRef = useRef(refreshLink);
  useEffect(() => {
    refreshRef.current = refreshLink;
  });

  // Before the link expires, swap in a fresh one.
  useEffect(() => {
    const exp = signedFileExpiry(src);
    if (!exp) return;
    const timer = window.setTimeout(() => void refreshRef.current(), Math.max(0, exp - REFRESH_AHEAD_MS - Date.now()));
    return () => window.clearTimeout(timer);
  }, [src]);

  return (
    <>
      <video
        key={src}
        ref={video}
        src={src}
        controls
        playsInline
        controlsList="nodownload"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        preload="metadata"
        poster={poster ?? undefined}
        onPlay={() => {
          playing.current = true;
        }}
        onPause={() => {
          playing.current = false;
        }}
        onLoadedMetadata={(e) => {
          const r = resume.current;
          if (!r) return;
          resume.current = null;
          const v = e.currentTarget;
          if (r.at > 0) v.currentTime = r.at;
          if (r.play) void v.play().catch(() => undefined);
        }}
        onTimeUpdate={report(onTime)}
        onEnded={report(onEnded)}
        onError={() => {
          // One refresh per 10 s at most, so a link that keeps failing shows the error.
          if (isSignedFileUrl(src) && Date.now() - lastRefresh.current > 10_000) {
            void refreshLink().then((ok) => {
              if (!ok) setError(true);
            });
          } else {
            setError(true);
          }
        }}
        className="size-full object-contain"
      />
      {error && (
        <Notice icon title="Video unavailable">
          {/* Legacy shows the link; a signed link of ours stays out of sight. */}
          {!isSignedFileUrl(src) && (
            <a href={src} target="_blank" rel="noopener" className="mt-1 block break-all text-xs text-primary">
              {src}
            </a>
          )}
        </Notice>
      )}
    </>
  );
}

function HlsLesson(props: LessonVideoProps) {
  const { lessonId } = props;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ attempt: number; playback: LessonPlayback } | null>(null);

  useEffect(() => {
    let live = true;
    lessonPlayback(lessonId).then(
      (playback) => live && setResult({ attempt, playback }),
      () => live && setResult({ attempt, playback: { ok: false, status: 0, message: "Could not load the video. Please try again." } }),
    );
    return () => {
      live = false;
    };
  }, [lessonId, attempt]);

  const current = result?.attempt === attempt ? result.playback : null;

  if (!current) return <Notice title="Loading secure video…" />;
  if (!current.ok) {
    if (current.code === "video_failed") return <Notice icon title="Video unavailable"><p className="mt-1 text-sm text-white/80">{current.message}</p></Notice>;
    if (current.status === 409) return <ProcessingNotice onRetry={() => setAttempt((n) => n + 1)} />;
    return (
      <Notice icon title={current.status === 403 || current.status === 404 ? "Video unavailable" : "Can't play this video"}>
        <p className="mt-1 text-sm text-white/80">{current.message}</p>
        {current.status === 402 ? (
          <Link href="/paywall" className="mt-3 inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand">
            Choose a plan
          </Link>
        ) : current.status !== 403 && current.status !== 404 ? (
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className="mt-3 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand">
            Try again
          </button>
        ) : null}
      </Notice>
    );
  }
  if (current.provider === "url") return <UrlVideo {...props} src={current.url} />;
  return <HlsPlayer key={current.url} lessonId={lessonId} initial={current} poster={props.poster} onTime={props.onTime} onEnded={props.onEnded} />;
}

/** not in legacy: the video was uploaded and is still being prepared (API 409 `video_processing`). */
function ProcessingNotice({ onRetry }: { onRetry?: () => void }) {
  return (
    <Notice title="Video is processing">
      <p className="mt-1 text-sm text-white/80">This video is still processing. Please try again in a few minutes.</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-brand">
          Try again
        </button>
      )}
    </Notice>
  );
}

function Notice({ title, icon, children }: { title: string; icon?: boolean; children?: ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-black/85 p-6 text-center text-white">
      <div>
        {icon && <p className="text-4xl" aria-hidden>⚠️</p>}
        <p className={icon ? "mt-2 font-semibold" : "font-semibold"}>{title}</p>
        {children}
      </div>
    </div>
  );
}
