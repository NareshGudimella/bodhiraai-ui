"use client";

import { useActionState } from "react";
import { ConfirmButton } from "@/components/confirm-button";
import { replaceSiteImage, replaceSiteVideo, restoreSiteImage } from "@/lib/cms-actions";

type Image = { path: string; label: string; url: string; replaced: boolean; size: number | null };
const kb = (n: number | null) => (n === null ? "" : ` · ${Math.max(1, Math.round(n / 1024))} KB`);
const firstError = (s: { errors?: Record<string, string[]>; message?: string; ok?: boolean } | undefined) =>
  s?.errors ? Object.values(s.errors)[0]?.[0] : s?.ok === false ? s.message : undefined;

export function ImageCard({ image }: { image: Image }) {
  const [state, action, pending] = useActionState(replaceSiteImage.bind(null, image.path), undefined);
  const error = firstError(state);
  return (
    <li className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
      <div className="flex aspect-video items-center justify-center bg-[repeating-conic-gradient(#f3ece2_0_25%,#fff_0_50%)] bg-[length:16px_16px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt={image.label} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="space-y-2 p-3 text-xs">
        <p className="font-medium text-ink">{image.label}</p>
        <p className="truncate text-ink-3" title={image.path}>
          {image.path}{kb(image.size)}{image.replaced && <span className="ml-1 rounded bg-primary-light px-1.5 py-0.5 font-semibold text-primary-dark">replaced</span>}
        </p>
        <form action={action} className="flex flex-wrap items-center gap-2">
          <input name="image" type="file" accept="image/*" required aria-label={`New image for ${image.label}`} className="min-w-0 flex-1 text-xs" />
          <button type="submit" disabled={pending} className="rounded-lg bg-brand px-2.5 py-1 font-semibold text-primary-light disabled:opacity-60">
            {pending ? "Uploading…" : "Replace"}
          </button>
        </form>
        {error && <p role="alert" className="text-danger">{error}</p>}
        {image.replaced && (
          <ConfirmButton action={restoreSiteImage.bind(null, image.path)} message="Restore the original image?" className="text-brand hover:underline">
            Restore original
          </ConfirmButton>
        )}
      </div>
    </li>
  );
}

export function VideoCard({ video }: { video: { path: string; label: string; rec: string; url: string; replaced: boolean } }) {
  const [state, action, pending] = useActionState(replaceSiteVideo.bind(null, video.path), undefined);
  const error = firstError(state);
  return (
    <li className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
      <video src={video.url} controls preload="metadata" className="aspect-video w-full bg-black" />
      <div className="space-y-2 p-3 text-xs">
        <p className="font-medium text-ink">{video.label}</p>
        <p className="text-ink-3">{video.rec}{video.replaced && <span className="ml-1 rounded bg-primary-light px-1.5 py-0.5 font-semibold text-primary-dark">replaced</span>}</p>
        <form action={action} className="flex flex-wrap items-center gap-2">
          <input name="video" type="file" accept="video/mp4,video/webm" required aria-label={`New video for ${video.label}`} className="min-w-0 flex-1 text-xs" />
          <button type="submit" disabled={pending} className="rounded-lg bg-brand px-2.5 py-1 font-semibold text-primary-light disabled:opacity-60">
            {pending ? "Uploading…" : "Replace"}
          </button>
        </form>
        {error && <p role="alert" className="text-danger">{error}</p>}
      </div>
    </li>
  );
}
