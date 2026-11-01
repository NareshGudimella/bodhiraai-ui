import type { Metadata } from "next";
import { Empty, PageHeader } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";
import { ContentBrowser } from "./content-browser";

export const metadata: Metadata = { title: "Content" };

/**
 * The Super Admin curricula the school uses (GET /admin/content):
 * syllabi → subjects → chapters → lessons, with the lesson videos playable
 * (watch only; the moving watermark names the admin). not in legacy
 */
export default async function AdminContentPage() {
  const { syllabi } = await adminApi.content();
  return (
    <>
      <PageHeader title="Content" subtitle="Lessons from the curricula your school uses. Pick a video lesson to watch it." />
      {syllabi.length ? <ContentBrowser syllabi={syllabi} /> : <Empty>No published content yet. Choose curricula under Syllabi.</Empty>}
    </>
  );
}
