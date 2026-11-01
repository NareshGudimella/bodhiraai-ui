import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";
import { PostForm } from "../post-form";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditPostPage({ params }: PageProps<"/cms/posts/[slug]">) {
  const { slug } = await params;
  const [post, { categories, tags }] = await Promise.all([cmsApi.post(slug), cmsApi.postOptions()]);
  return (
    <>
      <PageHeader back={{ href: "/cms/posts", label: "Posts" }} title={post.title} />
      <Card><PostForm post={post} categories={categories} tags={tags} cover={mediaUrl(post.cover_image_url)} /></Card>
    </>
  );
}
