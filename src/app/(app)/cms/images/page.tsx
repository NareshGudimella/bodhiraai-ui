import type { Metadata } from "next";
import Link from "next/link";
import { Pagination, toParams } from "@/components/list-tools";
import { PageHeader, SectionTitle } from "@/components/ui";
import { siteImagesApi } from "@/lib/cms-api";
import { fileSize, imageFolders, imagesIn } from "@/lib/site-files";
import { ImageCard, VideoCard } from "./image-card";

export const metadata: Metadata = { title: "Site Images" };

const LEGACY_URL = (process.env.LEGACY_URL ?? "http://localhost:8001").replace(/\/$/, "");

/**
 * Legacy Cms\SiteImageController: replace the public site's images without
 * touching its markup. A replacement is stored and overrides the bundled
 * file everywhere it appears; "Restore original" removes the override.
 * Super admins also get the full folder browser.
 */
export default async function SiteImagesPage({ searchParams }: PageProps<"/cms/images">) {
  const params = toParams(await searchParams, ["folder", "page"]);
  const { main, videos, overrides, can_browse_all } = await siteImagesApi.index();
  const describe = async (path: string, label?: string) => ({
    path,
    label: label ?? path.split("/").pop()!,
    url: overrides[path] ?? `/${path}`,
    replaced: Boolean(overrides[path]),
    size: overrides[path] ? null : await fileSize(path),
  });
  const groups = await Promise.all(
    Object.entries(main).map(async ([group, items]) => [group, await Promise.all(items.map((i) => describe(i.path, i.label)))] as const),
  );

  let browser = null;
  if (can_browse_all) {
    const folder = params.get("folder") ?? "";
    const page = Math.max(1, Number(params.get("page")) || 1);
    const [folders, files] = await Promise.all([imageFolders(), imagesIn(folder)]);
    const shown = await Promise.all(files.slice((page - 1) * 24, page * 24).map((p) => describe(p)));
    browser = { folder, folders, files, shown, page, lastPage: Math.max(1, Math.ceil(files.length / 24)) };
  }

  return (
    <>
      <PageHeader title="Site Images" subtitle="Replace the public website's images. Replacements show everywhere the image appears." />
      {groups.map(([group, items]) => (
        <section key={group} className="mb-8">
          <SectionTitle>{group}</SectionTitle>
          <ul className="grid grid-cols-1 gap-3 [&>*]:min-w-0 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((img) => <ImageCard key={img.path} image={img} />)}
          </ul>
        </section>
      ))}
      <section className="mb-8">
        <SectionTitle>Videos</SectionTitle>
        <ul className="grid grid-cols-1 gap-3 [&>*]:min-w-0 sm:grid-cols-2">
          {videos.map((v) => (
            <VideoCard
              key={v.path}
              video={{ ...v, url: overrides[v.path] ?? `${LEGACY_URL}/${v.path.split("/").map(encodeURIComponent).join("/")}`, replaced: Boolean(overrides[v.path]) }}
            />
          ))}
        </ul>
      </section>
      {browser && (
        <section>
          <SectionTitle>All theme images</SectionTitle>
          <nav aria-label="Folders" className="mb-4 flex flex-wrap gap-1.5">
            {browser.folders.map((f) => (
              <Link
                key={f || "root"}
                href={f ? `/cms/images?folder=${encodeURIComponent(f)}` : "/cms/images"}
                aria-current={f === browser.folder ? "page" : undefined}
                className="rounded-full px-3 py-1 text-xs ring-1 ring-line aria-[current=page]:bg-brand aria-[current=page]:text-white"
              >
                {f || "assets/img"}
              </Link>
            ))}
          </nav>
          <ul className="grid grid-cols-1 gap-3 [&>*]:min-w-0 sm:grid-cols-2 xl:grid-cols-3">
            {browser.shown.map((img) => <ImageCard key={img.path} image={img} />)}
          </ul>
          <Pagination base="/cms/images" params={params} page={browser.page} lastPage={browser.lastPage} total={browser.files.length} />
        </section>
      )}
    </>
  );
}
