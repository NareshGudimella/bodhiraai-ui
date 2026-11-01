"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, inputClass } from "@/components/form";
import { buttonClass, secondaryButtonClass } from "@/components/ui";
import { savePost } from "@/lib/cms-actions";
import type { Category, Post, Tag } from "@/lib/cms-api";

/** `Y-m-d\TH:i` for a datetime-local input (legacy prints the stored wall time). */
const local = (iso: string | null) => (iso ? iso.slice(0, 16) : "");

/** Legacy `cms.posts.form`. */
export function PostForm({ post, categories, tags, cover }: { post: Post | null; categories: Category[]; tags: Tag[]; cover: string | null }) {
  const [state, action, pending] = useActionState(savePost.bind(null, post?.slug ?? null), undefined);
  const v = state?.values;
  const e = state?.errors;
  const val = (k: keyof Post) => {
    if (v) return v[k] ?? "";
    const x = post?.[k];
    return x === null || x === undefined ? "" : String(x);
  };
  const text = (k: keyof Post, label: string, hint?: string) => (
    <Field label={label} error={e?.[k]} hint={hint}>
      <input key={`${k}${v?.[k] ?? ""}`} name={k} defaultValue={val(k)} className={inputClass} />
    </Field>
  );
  const tagText = v ? (v.tags ?? "") : (post?.tags ?? []).map((t) => t.name).join(", ");
  return (
    <form action={action} className="grid gap-4 [&>*]:min-w-0 sm:grid-cols-2">
      <div className="sm:col-span-2">{text("title", "Title")}</div>
      {text("slug", "Slug", "Blank: from the title.")}
      <Field label="Category" error={e?.blog_category_id}>
        <select key={`c${v?.blog_category_id ?? ""}`} name="blog_category_id" defaultValue={val("blog_category_id")} className={inputClass}>
          <option value="">—</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Excerpt" error={e?.excerpt}>
          <textarea key={`x${v?.excerpt ?? ""}`} name="excerpt" defaultValue={val("excerpt")} rows={2} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Body" error={e?.body}>
          <textarea key={`b${v?.body ?? ""}`} name="body" defaultValue={val("body")} rows={10} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Cover image" error={e?.cover_image_url ?? e?.cover_file}>
          <span className="flex flex-wrap items-center gap-3">
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="" className="h-14 w-24 rounded-lg object-cover ring-1 ring-line" />
            )}
            <input name="cover_image_url" defaultValue={val("cover_image_url")} placeholder="Image URL" className={`${inputClass} min-w-0 flex-1`} />
            <input name="cover_file" type="file" accept="image/*" className="w-full text-sm" />
          </span>
        </Field>
      </div>
      <Field label="Status" error={e?.status}>
        <select key={`s${v?.status ?? ""}`} name="status" defaultValue={val("status") || "draft"} className={inputClass}>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </Field>
      <Field label="Publish at" error={e?.published_at} hint="Blank when published: now.">
        <input key={`p${v?.published_at ?? ""}`} name="published_at" type="datetime-local" defaultValue={v ? (v.published_at ?? "") : local(post?.published_at ?? null)} className={inputClass} />
      </Field>
      {text("reading_minutes", "Reading minutes")}
      <Field label="Tags" error={e?.tags} hint={tags.length ? `Existing: ${tags.map((t) => t.name).join(", ")}` : "Comma separated"}>
        <input key={`t${tagText}`} name="tags" defaultValue={tagText} placeholder="comma, separated" className={inputClass} />
      </Field>
      {text("meta_title", "Meta title")}
      {text("og_image", "OG image URL")}
      <div className="sm:col-span-2">
        <Field label="Meta description" error={e?.meta_description}>
          <textarea key={`m${v?.meta_description ?? ""}`} name="meta_description" defaultValue={val("meta_description")} rows={2} className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-2">
        <input type="hidden" name="is_featured" value="0" />
        <input type="checkbox" name="is_featured" value="1" defaultChecked={v ? v.is_featured === "1" : post?.is_featured} /> Featured
      </label>
      <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>{pending ? "Saving…" : "Save post"}</button>
        <Link href="/cms/posts" className={secondaryButtonClass}>Cancel</Link>
      </div>
    </form>
  );
}
