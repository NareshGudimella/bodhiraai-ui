import type { Metadata } from "next";
import { Pagination, toParams } from "@/components/list-tools";
import { Empty, PageHeader, secondaryButtonClass } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { LeadCard, StatusTabs } from "../leads";

export const metadata: Metadata = { title: "Contact Messages" };
const STATUSES = ["new", "read", "replied", "archived"] as const;

/** Legacy `cms.leads.contacts`. */
export default async function ContactsPage({ searchParams }: PageProps<"/cms/contacts">) {
  const params = toParams(await searchParams, ["status", "page"]);
  const { data: messages, meta } = await cmsApi.contacts(params);
  return (
    <>
      <PageHeader title="Contact Messages" subtitle="From the website contact form" action={
          // A route handler that answers with a file: a full request, not a client navigation.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a href="/cms/contacts/export" className={secondaryButtonClass}>⬇ Export CSV</a>
        } />
      <StatusTabs base="/cms/contacts" statuses={STATUSES} active={params.get("status")} />
      {messages.length ? (
        <ul className="space-y-2">
          {messages.map((m) => (
            <LeadCard
              key={m.id}
              kind="contacts"
              lead={m}
              statuses={STATUSES}
              lines={[`${m.name}${m.subject ? ` · ${m.subject}` : ""}`, [m.email, m.phone].filter(Boolean).join(" · "), m.message as string | null]}
            />
          ))}
        </ul>
      ) : <Empty>No messages{params.get("status") ? ` marked ${params.get("status")}` : ""}.</Empty>}
      <Pagination base="/cms/contacts" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
