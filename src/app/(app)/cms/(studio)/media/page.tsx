import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader, SectionTitle } from "@/components/ui";
import { deleteFolder, deleteMedia } from "@/lib/cms-actions";
import { cmsApi } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";
import { CopyUrl, FolderForm, MediaDetails, UploadForm } from "./media-forms";

export const metadata: Metadata = { title: "Media" };

/** Legacy `cms.media.index`: folders, the upload form, a 24-per-page grid. */
export default async function CmsMediaPage({ searchParams }: PageProps<"/cms/media">) {
  const params = toParams(await searchParams, ["folder", "page"]);
  const { data, meta } = await cmsApi.media(params);
  const { folders, active_folder: active, media } = data;
  const kb = (n: number) => `${Math.max(1, Math.round(n / 1024))} KB`;
  return (
    <>
      <PageHeader title="Media" subtitle="Images for pages, posts and settings" />
      <div className="grid gap-6 [&>*]:min-w-0 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-4">
          <nav aria-label="Folders" className="space-y-1 text-sm">
            <Link href="/cms/media" aria-current={!active ? "page" : undefined} className="block rounded-lg px-3 py-1.5 hover:bg-primary-light aria-[current=page]:bg-brand aria-[current=page]:text-white">
              All media
            </Link>
            {folders.map((f) => (
              <span key={f.id} className="flex items-center gap-1">
                <Link
                  href={`/cms/media?folder=${f.id}`}
                  aria-current={active?.id === f.id ? "page" : undefined}
                  className="min-w-0 flex-1 truncate rounded-lg px-3 py-1.5 hover:bg-primary-light aria-[current=page]:bg-brand aria-[current=page]:text-white"
                >
                  📁 {f.name}
                </Link>
                <ConfirmButton action={deleteFolder.bind(null, f.id)} message={`Delete the folder "${f.name}"? Its files stay in All media.`} className="rounded px-1.5 text-xs text-danger hover:bg-danger-light">
                  ✕
                </ConfirmButton>
              </span>
            ))}
          </nav>
          <Card><FolderForm folders={folders} /></Card>
        </aside>
        <section>
          <Card className="mb-4"><UploadForm folders={folders} activeFolder={active?.id ?? null} /></Card>
          <SectionTitle>{active ? active.name : "All media"}</SectionTitle>
          {media.length ? (
            <ul className="grid grid-cols-2 gap-3 [&>*]:min-w-0 sm:grid-cols-3 xl:grid-cols-4">
              {media.map((m) => (
                <li key={m.id} className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(m.url) ?? m.url} alt={m.alt ?? ""} className="aspect-video w-full object-cover" />
                  <div className="space-y-2 p-3 text-xs">
                    <p className="truncate text-ink-3">
                      {m.original_name} · {m.width && m.height ? `${m.width}×${m.height} · ` : ""}{kb(m.size)}
                    </p>
                    <CopyUrl url={mediaUrl(m.url) ?? m.url} />
                    <MediaDetails media={m} folders={folders} />
                    <ConfirmButton action={deleteMedia.bind(null, m.id)} message="Delete this file?" className="text-danger hover:underline">Delete</ConfirmButton>
                  </div>
                </li>
              ))}
            </ul>
          ) : <Empty>No media here yet.</Empty>}
          <Pagination base="/cms/media" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
        </section>
      </div>
    </>
  );
}
