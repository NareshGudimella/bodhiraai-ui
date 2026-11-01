import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { mediaUrl } from "@/lib/media";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Global Settings" };

/** Legacy `cms.settings`: one tab per settings group. */
export default async function CmsSettingsPage({ searchParams }: PageProps<"/cms/settings">) {
  const tab = (await searchParams).tab;
  const { schema, values } = await cmsApi.settings();
  const active = typeof tab === "string" && schema[tab] ? tab : "general";
  const group = schema[active];
  const current = Object.fromEntries(group.fields.map((f) => [f.key, values[`${active}.${f.key}`] ?? null]));
  const previews = Object.fromEntries(
    group.fields.filter((f) => f.type === "image").map((f) => [f.key, typeof current[f.key] === "string" ? mediaUrl(current[f.key] as string) : null]),
  );
  return (
    <>
      <PageHeader title="Global Settings" subtitle="Brand, contact details, SEO and footer for the public site" />
      <nav aria-label="Settings groups" className="mb-4 flex flex-wrap gap-2">
        {Object.entries(schema).map(([key, g]) => (
          <Link
            key={key}
            href={`/cms/settings?tab=${key}`}
            aria-current={key === active ? "page" : undefined}
            className="rounded-full px-3 py-1 text-sm ring-1 ring-line aria-[current=page]:bg-brand aria-[current=page]:text-white"
          >
            {g.label}
          </Link>
        ))}
      </nav>
      <Card>
        <SettingsForm key={active} group={active} fields={group.fields} values={current} previews={previews} />
      </Card>
    </>
  );
}
