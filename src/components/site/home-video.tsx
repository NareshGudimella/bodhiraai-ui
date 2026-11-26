"use client";

import { useEffect, useRef, useState } from "react";
import { BrandIcon } from "./icons";

/** A YouTube watch/short/embed link as its embed URL, else null. */
function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] ?? null;
    }
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
  } catch {
    return null;
  }
}

/**
 * Any `.home-video-play` element opens this overlay with the `home.video_url`
 * site setting: an MP4 in a <video>, or a YouTube link embedded (not in legacy:
 * replaces VdoCipher). The page renders this, and the play button, only when
 * the setting is set. Tailwind since the migration.
 */
export function HomeVideo({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const embed = youtubeEmbed(url);
  const closeRef = useRef<() => void>(() => undefined);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // Keyboard (not in legacy): focus moves to Close on open, Tab stays in the dialog, focus returns to the play button.
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) closeBtn.current?.focus();
  }, [open]);

  useEffect(() => {
    const close = () => {
      document.body.style.overflow = "";
      setOpen(false);
      opener.current?.focus();
      opener.current = null;
    };
    closeRef.current = close;
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element | null)?.closest?.(".home-video-play");
      if (!btn) return;
      e.preventDefault();
      opener.current = btn as HTMLElement;
      document.body.style.overflow = "hidden";
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (!opener.current) return;
      if (e.key === "Escape") close();
      else if (e.key === "Tab") {
        const dialog = document.getElementById("homeVideoModal");
        const items = Array.from(dialog?.querySelectorAll<HTMLElement>("button, iframe, video") ?? []);
        const i = items.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => closeRef.current();
  return (
    <div
      id="homeVideoModal"
      className={`fixed inset-0 z-99999 items-center justify-center ${open ? "flex" : "hidden"}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div className="absolute inset-0 cursor-pointer bg-[rgba(10,5,7,.88)] backdrop-blur-[4px]" onClick={close}></div>
      <div className="relative z-1 aspect-video w-[min(960px,92vw)]">
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label="Close video"
          className="absolute -top-[46px] right-0 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-maroon text-[17px] text-white transition-all duration-150 hover:bg-gold focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright max-sm:-top-[42px] max-sm:h-9 max-sm:w-9"
        >
          <BrandIcon name="xmark" size={17} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[14px] bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]">
          {open &&
            (embed ? (
              <iframe
                src={embed}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                title="Bodhira.ai video"
                className="block h-full w-full max-w-full border-0"
              />
            ) : (
              <video src={url} controls autoPlay playsInline controlsList="nodownload" className="h-full w-full bg-black object-contain" />
            ))}
        </div>
      </div>
    </div>
  );
}
