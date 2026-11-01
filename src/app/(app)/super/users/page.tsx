import type { Metadata } from "next";
import { FilterBar, FilterInput, FilterSelect, Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader, Pill } from "@/components/ui";
import { superApi } from "@/lib/super-api";
import { tone } from "../format";

export const metadata: Metadata = { title: "Users" };

const ROLES: [string, string][] = [
  ["student", "Students"], ["teacher", "Teachers"], ["parent", "Parents"], ["admin", "School admins"],
  ["super_admin", "Super admins"], ["content_manager", "Content managers"], ["web_admin", "Web admins"],
];

export default async function SuperUsersPage({ searchParams }: PageProps<"/super/users">) {
  const params = toParams(await searchParams, ["role", "q", "school_id", "page"]);
  const [{ users, meta }, { schools }] = await Promise.all([
    superApi.users(params),
    superApi.schools(new URLSearchParams({ per_page: "100" })),
  ]);
  return (
    <>
      <PageHeader title="Users" subtitle="Every account on the platform" />
      <FilterBar action="/super/users">
        <FilterSelect name="role" label="Role" defaultValue={params.get("role") ?? ""} options={ROLES} />
        <FilterInput name="q" label="Search" defaultValue={params.get("q") ?? ""} placeholder="Name, email or phone" />
        <FilterSelect name="school_id" label="School" defaultValue={params.get("school_id") ?? ""} options={schools.map((s) => [String(s.id), s.name])} />
      </FilterBar>
      {users.length ? (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-3">
              <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">School</th><th className="px-4 py-2">Contact</th><th className="px-4 py-2">Status</th><th className="px-4 py-2">Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-4 py-2 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-2 capitalize text-ink-2">{u.role.replace("_", " ")}</td>
                  <td className="px-4 py-2 text-ink-2">{u.school ?? "—"}</td>
                  <td className="px-4 py-2 text-ink-2">
                    {u.email ?? "—"}
                    {u.phone && <span className="block text-xs text-ink-3">{u.phone}</span>}
                  </td>
                  <td className="px-4 py-2"><Pill tone={tone(u.status)}>{u.status}</Pill></td>
                  <td className="px-4 py-2 text-xs text-ink-3">{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <Empty>No users match.</Empty>}
      <Pagination base="/super/users" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
