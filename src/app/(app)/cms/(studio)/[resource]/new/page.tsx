import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/ui";
import { cmsApi, RESOURCE_SLUGS } from "@/lib/cms-api";
import { ResourceForm } from "../resource-form";

export const metadata: Metadata = { title: "Web Studio" };

export default async function NewResourcePage({ params }: PageProps<"/cms/[resource]/new">) {
  const { resource } = await params;
  if (!RESOURCE_SLUGS.includes(resource as (typeof RESOURCE_SLUGS)[number])) notFound();
  const { fields, labels } = await cmsApi.resource(resource);
  return (
    <>
      <PageHeader back={{ href: `/cms/${resource}`, label: labels[1] }} title={`New ${labels[0].toLowerCase()}`} />
      <Card><ResourceForm slug={resource} fields={fields} row={null} imageUrls={{}} /></Card>
    </>
  );
}
