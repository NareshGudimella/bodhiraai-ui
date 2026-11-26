"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { ProgressBar, buttonClass, secondaryButtonClass } from "@/components/ui";
import type { FormState } from "@/lib/action-result";
import { startLessonVideoUpload, saveLessonFields, updateLesson } from "@/lib/content-actions";
import { putWithProgress } from "@/lib/direct-upload";
import { isSignedFileUrl } from "@/lib/signed-file";

type Initial = Partial<{
  title: string;
  type: string;
  content_url: string | null;
  content_body: string | null;
  thumbnail: string | null;
  duration_sec: number;
  sort_order: number;
  is_free: boolean;
  is_published: boolean;
}>;

const DIRECT_MAX = 5_000_000_000; // stream upload limit (docs/video-hls-contract.md)
const MULTIPART_MAX = 200 * 1024 * 1024; // local-driver fallback through the server action
const mb = (n: number) => (n / 1e6).toFixed(n < 1e7 ? 1 : 0);

/**
 * Add / edit lesson form (legacy content/chapter and lesson-edit). Picking a
 * video fills the duration and grabs a frame at 25% as the thumbnail, sent as
 * `thumbnail_data`, like the legacy form's script.
 */
export function LessonForm({
  action: run,
  initial = {},
  edit = false,
  submitLabel,
  chapterId,
  lessonId,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  initial?: Initial;
  edit?: boolean;
  submitLabel: string;
  chapterId: number;
  lessonId?: number;
}) {
  const router = useRouter();
  const [formState, action, formPending] = useActionState(run, undefined);
  // Video upload (browser to the API's host): runs from onSubmit, outside the form action.
  const [local, setLocal] = useState<FormState>();
  const state = local ?? formState;
  const [busy, startTransition] = useTransition();
  const [sent, setSent] = useState<{ done: number; total: number } | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const xhr = useRef<XMLHttpRequest | null>(null);
  const createdId = useRef<number | null>(null); // a retry must not create the lesson twice
  const uploading = sent !== null;
  const pending = formPending || busy || uploading;

  useEffect(() => {
    if (!uploading) return;
    const warn = (ev: BeforeUnloadEvent) => ev.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [uploading]);

  async function submitVideo(form: HTMLFormElement, file: File) {
    const fail = (message: string) => {
      setSent(null);
      // values refill the fields after the form remounts; the file must be chosen again
      const values = Object.fromEntries([...new FormData(form)].filter(([k, x]) => typeof x === "string" && k !== "thumbnail_data")) as Record<string, string>;
      setLocal({ ok: false, message, values });
    };
    setLocal(undefined);
    setInfo(null);
    if (file.size > DIRECT_MAX) return fail("The video is larger than 5 GB.");
    const data = new FormData(form);
    data.delete("content_file");
    setSent({ done: 0, total: file.size });
    const saved = await saveLessonFields(chapterId, createdId.current ?? lessonId ?? null, data);
    if ("error" in saved) {
      setSent(null);
      return setLocal(saved.error);
    }
    createdId.current = saved.id;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const contentType = file.type || (ext === "mkv" ? "video/x-matroska" : "video/mp4");
    const presign = await startLessonVideoUpload(saved.id, { filename: file.name, size: file.size, content_type: contentType });
    if ("message" in presign) return fail(presign.message);
    const up = presign.data;
    if (up.mode === "multipart") {
      // Local storage: today's path, the file posted with the form (200 MB).
      if (file.size > MULTIPART_MAX) return fail("The video is larger than 200 MB.");
      setSent(null);
      return startTransition(async () => {
        setLocal((await updateLesson(saved.id, chapterId, undefined, new FormData(form))) ?? undefined);
      });
    }
    let res;
    try {
      const req = (xhr.current = new XMLHttpRequest());
      res = await putWithProgress(up.upload_url, contentType, file, (done) => setSent({ done, total: file.size }), req);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return fail("Upload cancelled.");
      return fail("Upload failed, retry");
    } finally {
      xhr.current = null;
    }
    // 200 = the API has finished everything (the body is the lesson resource).
    if (res.status === 403) return fail("Upload link expired, try again");
    if (res.status === 422) {
      let msg = "Upload failed, retry";
      try { msg = JSON.parse(res.body).message ?? msg; } catch { /* not JSON */ }
      return fail(msg);
    }
    if (res.status !== 200) return fail("Upload failed, retry");
    setSent(null);
    setInfo("Processing: the video will be ready in a few minutes");
    if (edit) setTimeout(() => router.push(`/content/chapters/${chapterId}`), 1500);
    else {
      createdId.current = null;
      setResetKey((k) => k + 1);
      router.refresh();
    }
  }

  const e = state?.errors ?? {};
  const v = { ...initial, ...(state?.ok === false ? state.values : {}) } as Record<string, string | number | boolean | null | undefined>;
  const [type, setType] = useState(String(v.type ?? "video"));
  const [thumb, setThumb] = useState<string | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const duration = useRef<HTMLInputElement>(null);
  const text = (k: string) => (v[k] == null ? "" : String(v[k]));
  // The current file's link is only a hint; a signed link of ours (it expires) isn't worth showing.
  // security: not in legacy
  const current = (k: string) => (isSignedFileUrl(text(k)) ? "Uploaded file" : text(k));
  const checked = (k: string, fallback: boolean) => (v[k] === undefined ? fallback : v[k] === true || v[k] === "1");

  function grab(at: number) {
    const el = video.current;
    if (!el) return;
    el.addEventListener(
      "seeked",
      () => {
        const canvas = document.createElement("canvas");
        canvas.width = el.videoWidth || 640;
        canvas.height = el.videoHeight || 360;
        canvas.getContext("2d")?.drawImage(el, 0, 0, canvas.width, canvas.height);
        try {
          setThumb(canvas.toDataURL("image/jpeg", 0.85));
        } catch {
          setThumb(null);
        }
      },
      { once: true },
    );
    el.currentTime = Math.min(at, Math.max(0.1, el.duration - 0.1));
  }

  function picked(file: File | undefined) {
    setThumb(null);
    if (!file || !file.type.startsWith("video/")) return;
    if (video.current?.src) URL.revokeObjectURL(video.current.src);
    const el = (video.current ??= Object.assign(document.createElement("video"), { muted: true, playsInline: true, preload: "metadata" }));
    el.addEventListener(
      "loadedmetadata",
      () => {
        if (duration.current && !duration.current.value) duration.current.value = String(Math.round(el.duration));
        grab(el.duration * 0.25);
      },
      { once: true },
    );
    el.src = URL.createObjectURL(file);
  }

  return (
    <form
      action={action}
      className="space-y-3"
      key={JSON.stringify(state ?? null) + resetKey}
      onSubmit={(ev) => {
        const file = (ev.currentTarget.elements.namedItem("content_file") as HTMLInputElement | null)?.files?.[0];
        if (type !== "video" || !file) return;
        ev.preventDefault();
        void submitVideo(ev.currentTarget, file);
      }}
    >
      <Field label="Title" error={e.title}><input name="title" required maxLength={160} defaultValue={text("title")} className={inputClass} /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Type" error={e.type}>
          <select name="type" value={type} onChange={(ev) => setType(ev.target.value)} className={inputClass}>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
          </select>
        </Field>
        <Field label="Duration (seconds)" error={e.duration_sec}>
          <input ref={duration} name="duration_sec" type="number" min={0} defaultValue={text("duration_sec")} className={inputClass} />
        </Field>
      </div>
      {type !== "text" && (
        <div className="space-y-3 rounded-xl bg-page p-3 ring-1 ring-line">
          <Field label={edit ? "Replace file" : "Upload file"} error={e.content_file} hint={type === "pdf" ? "PDF up to 50 MB" : "MP4, MOV, WebM or MKV up to 5 GB"}>
            <input name="content_file" type="file" accept={type === "pdf" ? "application/pdf" : "video/*"} onChange={(ev) => picked(ev.target.files?.[0])} className="block w-full text-sm" />
          </Field>
          <Field label="…or a URL" error={e.content_url} hint={edit ? "Leave blank to keep the current file" : undefined}>
            <input name="content_url" type="url" defaultValue={edit ? "" : text("content_url")} placeholder={edit ? current("content_url") : "https://"} className={inputClass} />
          </Field>
        </div>
      )}
      <Field label="Body" error={e.content_body} hint="Text lessons, or notes shown under the media">
        <textarea name="content_body" rows={type === "text" ? 6 : 3} defaultValue={text("content_body")} className={inputClass} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Thumbnail image" error={e.thumbnail_file}>
          <input name="thumbnail_file" type="file" accept="image/*" className="block w-full text-sm" />
        </Field>
        <Field label="…or thumbnail URL" error={e.thumbnail}>
          <input name="thumbnail" type="url" defaultValue={edit ? "" : text("thumbnail")} placeholder={edit ? current("thumbnail") : "https://"} className={inputClass} />
        </Field>
      </div>
      {thumb && (
        <div className="flex items-center gap-3 text-xs text-ink-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- a data URL preview */}
          <img src={thumb} alt="Frame from the chosen video" className="h-16 rounded-md ring-1 ring-line" />
          <span>Thumbnail from the video</span>
          <button type="button" onClick={() => video.current && grab(Math.random() * video.current.duration)} className={secondaryButtonClass}>
            Another frame
          </button>
          <input type="hidden" name="thumbnail_data" value={thumb} />
        </div>
      )}
      {edit && (
        <Field label="Position" error={e.sort_order}>
          <input name="sort_order" type="number" min={0} max={999} defaultValue={text("sort_order")} className={inputClass} />
        </Field>
      )}
      <div className="flex flex-wrap gap-4 text-sm text-ink-2">
        <label className="flex items-center gap-2"><input type="checkbox" name="is_free" value="1" defaultChecked={checked("is_free", false)} /> Free preview</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_published" value="1" defaultChecked={checked("is_published", true)} /> Published</label>
      </div>
      {sent && (
        <div className="space-y-1.5 text-xs text-ink-2" aria-live="polite">
          <ProgressBar value={(sent.done / sent.total) * 100} />
          <div className="flex items-center justify-between">
            <span>{Math.floor((sent.done / sent.total) * 100)}% · {mb(sent.done)} MB / {mb(sent.total)} MB</span>
            <button type="button" onClick={() => xhr.current?.abort()} className={secondaryButtonClass}>Cancel</button>
          </div>
        </div>
      )}
      {info && <p role="status" className="text-sm text-success">{info}</p>}
      <FormMessage state={state} />
      <button disabled={pending} className={buttonClass}>{uploading ? "Uploading…" : pending ? "Saving…" : submitLabel}</button>
    </form>
  );
}
