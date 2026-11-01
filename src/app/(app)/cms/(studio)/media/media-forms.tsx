"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass, secondaryButtonClass } from "@/components/ui";
import { createFolder, updateMedia, uploadMedia } from "@/lib/cms-actions";
import type { Folder, Media } from "@/lib/cms-api";

const firstError = (errors?: Record<string, string[]>) => (errors ? Object.values(errors)[0]?.[0] : undefined);

export function UploadForm({ folders, activeFolder }: { folders: Folder[]; activeFolder: number | null }) {
  const [state, action, pending] = useActionState(uploadMedia, undefined);
  const error = firstError(state?.errors);
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <Field label="Images (up to 10 MB each)">
        <input name="files[]" type="file" accept="image/*" multiple required className="text-sm" />
      </Field>
      <Field label="Folder">
        <select name="media_folder_id" defaultValue={activeFolder ?? ""} className={inputClass}>
          <option value="">— None —</option>
          {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </Field>
      <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Uploading…" : "Upload"}</button>
      {error ? <p role="alert" className="w-full text-sm text-danger">{error}</p> : state?.ok === false && <FormMessage state={state} />}
    </form>
  );
}

export function FolderForm({ folders }: { folders: Folder[] }) {
  const [state, action, pending] = useActionState(createFolder, undefined);
  const v = state?.ok ? undefined : state?.values;
  return (
    <form action={action} className="space-y-2">
      <Field label="New folder" error={state?.errors?.name}>
        <input key={`n${v?.name}`} name="name" defaultValue={v?.name} required className={inputClass} />
      </Field>
      <Field label="Inside" error={state?.errors?.parent_id}>
        <select name="parent_id" defaultValue="" className={inputClass}>
          <option value="">— Top level —</option>
          {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </Field>
      <button type="submit" disabled={pending} className={secondaryButtonClass}>Create folder</button>
    </form>
  );
}

/** Alt text, title and folder for one file. */
export function MediaDetails({ media, folders }: { media: Media; folders: Folder[] }) {
  const [state, action, pending] = useActionState(updateMedia.bind(null, media.id), undefined);
  return (
    <form action={action} className="space-y-1.5">
      <input name="alt" defaultValue={media.alt ?? ""} placeholder="Alt text" aria-label="Alt text" className={`${inputClass} py-1 text-xs`} />
      <input name="title" defaultValue={media.title ?? ""} placeholder="Title" aria-label="Title" className={`${inputClass} py-1 text-xs`} />
      <select name="media_folder_id" defaultValue={media.media_folder_id ?? ""} aria-label="Folder" className={`${inputClass} py-1 text-xs`}>
        <option value="">— No folder —</option>
        {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      {firstError(state?.errors) && <p className="text-danger">{firstError(state?.errors)}</p>}
      <button type="submit" disabled={pending} className="font-semibold text-brand hover:underline">Save</button>
    </form>
  );
}

/** The file's URL in a read-only box (legacy `onclick=select`) with a copy button. */
export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="flex items-center gap-1">
      <input type="text" readOnly value={url} onClick={(e) => e.currentTarget.select()} aria-label="File URL" className={`${inputClass} min-w-0 flex-1 py-1 font-mono text-[10px]`} />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard blocked: the box above is still selectable */
          }
        }}
        className="shrink-0 rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
