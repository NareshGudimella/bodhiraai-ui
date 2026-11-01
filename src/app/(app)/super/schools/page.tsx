import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterInput, FilterSelect, Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { PLAN_KEYS, superApi } from "@/lib/super-api";
import { tone } from "../format";
import { DirectBadge } from "./direct-badge";

export const metadata: Metadata = { title: "Schools" };

const STATUSES: [string, string][] = [["active", "Active"], ["inactive", "Inactive"], ["suspended", "Suspended"]];

export default async function SuperSchoolsPage({ searchParams }: PageProps<"/super/schools">) {
  const params = toParams(await searchParams, ["q", "status", "plan", "page"]);
  const { schools, meta } = await superApi.schools(params);
  return (
    <>
      <PageHeader title="Schools" action={<Link href="/super/schools/new" className={buttonClass}>+ Add school</Link>} />
      <FilterBar action="/super/schools">
        <FilterInput name="q" label="Search" defaultValue={params.get("q") ?? ""} placeholder="Name, code or email" />
        <FilterSelect name="status" label="Status" defaultValue={params.get("status") ?? ""} options={STATUSES} />
        <FilterSelect name="plan" label="Plan" defaultValue={params.get("plan") ?? ""} options={PLAN_KEYS.map((p) => [p, p])} />
      </FilterBar>
      {schools.length ? (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-3">
              <tr><th className="px-4 py-2">School</th><th className="px-4 py-2">Location</th><th className="px-4 py-2">Plan</th><th className="px-4 py-2">Users</th><th className="px-4 py-2">Classes</th><th className="px-4 py-2">Status</th></tr>
            </thead>
            <tbody>
              {schools.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-4 py-2">
                    <Link href={`/super/schools/${s.id}`} className="font-medium text-ink hover:underline">{s.name}</Link>
                    {s.is_direct && <span className="ml-2"><DirectBadge /></span>}
                    <span className="block text-xs text-ink-3">{s.code}{s.email ? ` · ${s.email}` : ""}</span>
                  </td>
                  <td className="px-4 py-2 text-ink-2">{[s.city, s.state].filter(Boolean).join(", ") || "—"}</td>
                  <td className="px-4 py-2 capitalize text-ink-2">{s.plan}{s.plan_expires_at && <span className="block text-xs normal-case text-ink-3">until {s.plan_expires_at}</span>}</td>
                  <td className="px-4 py-2 text-ink-2">{s.users_count}</td>
                  <td className="px-4 py-2 text-ink-2">{s.classes_count}</td>
                  <td className="px-4 py-2"><Pill tone={tone(s.status)}>{s.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <Empty>No schools match.</Empty>}
      <Pagination base="/super/schools" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
