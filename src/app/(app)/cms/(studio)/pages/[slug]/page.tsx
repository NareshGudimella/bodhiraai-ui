import type { Metadata } from "next";
import { ConfirmButton } from "@/components/confirm-button";
import { Card, PageHeader, SectionTitle, secondaryButtonClass } from "@/components/ui";
import { deletePage } from "@/lib/cms-actions";
import { cmsApi } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";
import { PageForm } from "../page-form";
import { SectionList } from "./section-list";

export const metadata: Metadata = { title: "Edit page" };

/** Legacy `cms.pages.edit`: settings plus the section builder. */
export default async function EditCmsPage({ params }: PageProps<"/cms/pages/[slug]">) {
  const { slug } = await params;
  const { page, section_types } = await cmsApi.page(slug);
  const sections = (page.sections ?? []).map((s) => ({ ...s, media_src: mediaUrl(s.media_url) }));
  return (
    <>
      <PageHeader
        back={{ href: "/cms/pages", label: "Pages" }}
        title={page.name}
        subtitle={`/${page.slug}${page.is_system ? " · system page" : ""}`}
        action={
          <span className="flex flex-wrap gap-2">
            <a href={page.slug === "home" ? "/" : `/${page.slug}`} target="_blank" rel="noreferrer" className={secondaryButtonClass}>View ↗</a>
            {/* system pages can't be deleted (the API refuses), so no button */}
            {!page.is_system && (
              <ConfirmButton action={deletePage.bind(null, page.slug)} message="Delete this page?" className={secondaryButtonClass}>
                Delete page
              </ConfirmButton>
            )}
          </span>
        }
      />
      <div className="grid gap-8 [&>*]:min-w-0 xl:grid-cols-[1fr_1.2fr]">
        <section>
          <SectionTitle>Settings</SectionTitle>
          <Card><PageForm key={page.slug} page={page} /></Card>
        </section>
        <section>
          <SectionTitle>Sections</SectionTitle>
          <SectionList pageSlug={page.slug} sections={sections} types={section_types} />
        </section>
      </div>
    </>
  );
}
