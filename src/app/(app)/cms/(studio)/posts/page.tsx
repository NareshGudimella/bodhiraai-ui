import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { FilterBar, FilterSelect, Pagination, toParams } from "@/components/list-tools";
import { Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { deletePost } from "@/lib/cms-actions";
import { cmsApi } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";
import { mjY } from "@/lib/money";

export const metadata: Metadata = { title: "Posts" };

/** Legacy `cms.posts.index` (status and category filters; "Success Stories" is the category view). */
export default async function CmsPostsPage({ searchParams }: PageProps<"/cms/posts">) {
  const params = toParams(await searchParams, ["status", "category", "page"]);
  const [{ data: posts, meta }, { categories }] = await Promise.all([cmsApi.posts(params), cmsApi.postOptions()]);
  return (
    <>
      <PageHeader title="Posts" subtitle="Blog articles and success stories" action={<Link href="/cms/posts/new" className={buttonClass}>+ New post</Link>} />
      <FilterBar action="/cms/posts">
        <FilterSelect name="status" label="Status" defaultValue={params.get("status") ?? ""} options={[["draft", "Draft"], ["scheduled", "Scheduled"], ["published", "Published"]]} />
        <FilterSelect name="category" label="Category" defaultValue={params.get("category") ?? ""} options={categories.map((c) => [c.slug, c.name])} />
      </FilterBar>
      {posts.length ? (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 ring-1 ring-line">
              <span className="flex min-w-0 items-center gap-3">
                {p.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- stored media on another origin
                  <img src={mediaUrl(p.cover_image_url) ?? p.cover_image_url} alt="" className="h-12 w-20 shrink-0 rounded-lg bg-page object-cover ring-1 ring-line" />
                ) : (
                  <span aria-hidden className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-page text-ink-3 ring-1 ring-line">✍️</span>
                )}
                <span className="min-w-0">
                <Link href={`/cms/posts/${p.slug}`} className="block truncate font-medium text-ink hover:text-brand">{p.title}</Link>
                <span className="text-xs text-ink-3">
                  {p.category?.name ?? "Uncategorised"} · {p.author?.name ?? "—"} · {p.published_at ? mjY(p.published_at) : "not published"} · {p.views} views
                </span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                {p.is_featured && <Pill tone="brand">featured</Pill>}
                <Pill tone={p.status === "published" ? "success" : "neutral"}>{p.status}</Pill>
                <ConfirmButton action={deletePost.bind(null, p.slug)} message="Delete this post?" className="rounded-lg border border-danger/30 px-2.5 py-1 text-xs text-danger hover:bg-danger-light">
                  Delete
                </ConfirmButton>
              </span>
            </li>
          ))}
        </ul>
      ) : <Empty>No posts{params.get("status") || params.get("category") ? " match these filters" : " yet"}.</Empty>}
      <Pagination base="/cms/posts" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
