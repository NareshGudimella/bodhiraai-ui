import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { PostForm } from "../post-form";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const { categories, tags } = await cmsApi.postOptions();
  return (
    <>
      <PageHeader back={{ href: "/cms/posts", label: "Posts" }} title="New post" />
      <Card><PostForm post={null} categories={categories} tags={tags} cover={null} /></Card>
    </>
  );
}
