import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui";
import { PageForm } from "../page-form";

export const metadata: Metadata = { title: "New page" };

export default function NewCmsPage() {
  return (
    <>
      <PageHeader back={{ href: "/cms/pages", label: "Pages" }} title="New page" />
      <Card><PageForm page={null} /></Card>
    </>
  );
}
