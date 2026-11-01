import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, PageHeader } from "@/components/ui";
import { cmsApi, RESOURCE_SLUGS } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";
import { ResourceForm } from "../resource-form";

export const metadata: Metadata = { title: "Web Studio" };

export default async function EditResourcePage({ params }: PageProps<"/cms/[resource]/[id]">) {
  const { resource, id } = await params;
  if (!RESOURCE_SLUGS.includes(resource as (typeof RESOURCE_SLUGS)[number])) notFound();
  const { row, fields, labels } = await cmsApi.resourceRow(resource, id);
  const imageUrls = Object.fromEntries(
    fields.filter((f) => f.type === "image").map((f) => [f.name, typeof row[f.name] === "string" ? mediaUrl(row[f.name] as string) : null]),
  );
  return (
    <>
      <PageHeader back={{ href: `/cms/${resource}`, label: labels[1] }} title={`Edit ${labels[0].toLowerCase()}`} />
      <Card><ResourceForm slug={resource} fields={fields} row={row} imageUrls={imageUrls} /></Card>
    </>
  );
}
