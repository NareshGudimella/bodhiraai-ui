"use client";

import { useEffect, useRef, useState } from "react";
import { BrandIcon } from "./icons";

type State = { open: boolean; otp?: string; playbackInfo?: string; message: string };

/**
 * partials/vdocipher-player: any `.vdo-play` element with data-vdo-video opens
 * this overlay, which asks /video/otp for a fresh OTP and embeds the player.
 * Tailwind since the migration (was an inline <style> and a Font Awesome close icon).
 */
export function VdoPlayer() {
  const [state, setState] = useState<State>({ open: false, message: "Loading secure video…" });
  const closeRef = useRef<() => void>(() => undefined);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // Keyboard (not in legacy): focus moves to Close on open, Tab stays in the dialog, focus returns to the play button.
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (state.open) closeBtn.current?.focus();
  }, [state.open]);

  useEffect(() => {
    const open = (videoId: string | null) => {
      document.body.style.overflow = "hidden";
      setState({ open: true, message: "Loading secure video…" });
      fetch(`/video/otp${videoId ? `?video=${encodeURIComponent(videoId)}` : ""}`, { headers: { Accept: "application/json" } })
        .then((r) => r.json())
        .then((d: { otp?: string; playbackInfo?: string }) =>
          setState(d?.otp ? { open: true, otp: d.otp, playbackInfo: d.playbackInfo, message: "" } : { open: true, message: "This video is currently unavailable." }),
        )
        .catch(() => setState({ open: true, message: "Could not load the video. Please try again." }));
    };
    const close = () => {
      document.body.style.overflow = "";
      setState({ open: false, message: "Loading secure video…" });
      opener.current?.focus();
      opener.current = null;
    };
    closeRef.current = close;
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element | null)?.closest?.(".vdo-play");
      if (!btn) return;
      e.preventDefault();
      opener.current = btn as HTMLElement;
      open(btn.getAttribute("data-vdo-video"));
    };
    const onKey = (e: KeyboardEvent) => {
      if (!opener.current) return;
      if (e.key === "Escape") close();
      else if (e.key === "Tab") {
        const dialog = document.getElementById("vdoModal");
        const items = Array.from(dialog?.querySelectorAll<HTMLElement>("button, iframe") ?? []);
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
      id="vdoModal"
      className={`fixed inset-0 z-99999 items-center justify-center ${state.open ? "flex" : "hidden"}`}
      aria-hidden={!state.open}
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
          {state.open && state.otp ? (
            <iframe
              src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(state.otp)}&playbackInfo=${encodeURIComponent(state.playbackInfo ?? "")}&autoplay=true`}
              allow="encrypted-media; autoplay; fullscreen"
              allowFullScreen
              title="Bodhira.ai video"
              className="block h-full w-full max-w-full border-0"
            />
          ) : (
            <div className="text-sm tracking-[.02em] text-gold-bright">{state.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}
