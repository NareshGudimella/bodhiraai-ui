import type { Metadata } from "next";
import { Pagination, toParams } from "@/components/list-tools";
import { Empty, PageHeader, secondaryButtonClass } from "@/components/ui";
import { cmsApi } from "@/lib/cms-api";
import { LeadCard, StatusTabs } from "../leads";

export const metadata: Metadata = { title: "Newsletter" };
const STATUSES = ["subscribed", "unsubscribed", "pending"] as const;

/** Legacy `cms.leads.subscribers`. */
export default async function SubscribersPage({ searchParams }: PageProps<"/cms/subscribers">) {
  const params = toParams(await searchParams, ["status", "page"]);
  const { data: subscribers, meta } = await cmsApi.subscribers(params);
  return (
    <>
      <PageHeader title="Newsletter" subtitle="Footer sign-ups" action={
          // A route handler that answers with a file: a full request, not a client navigation.
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a href="/cms/subscribers/export" className={secondaryButtonClass}>⬇ Export CSV</a>
        } />
      <StatusTabs base="/cms/subscribers" statuses={STATUSES} active={params.get("status")} />
      {subscribers.length ? (
        <ul className="space-y-2">
          {subscribers.map((s) => <LeadCard key={s.id} kind="subscribers" lead={s} lines={[s.email as string, s.name as string | null]} />)}
        </ul>
      ) : <Empty>No subscribers{params.get("status") ? ` marked ${params.get("status")}` : " yet"}.</Empty>}
      <Pagination base="/cms/subscribers" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
