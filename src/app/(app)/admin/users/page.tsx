import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { FilterBar, FilterInput, FilterSelect, Pagination, toParams } from "@/components/list-tools";
import { Card, Empty, PageHeader, Pill, buttonClass } from "@/components/ui";
import { toggleUser } from "@/lib/admin-actions";
import { adminApi } from "@/lib/admin-api";

export const metadata: Metadata = { title: "Users" };

const ROLES: [string, string][] = [["student", "Students"], ["teacher", "Teachers"], ["parent", "Parents"], ["admin", "Admins"]];

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  const sp = await searchParams;
  const params = toParams(sp, ["role", "q", "page"]);
  const { users, meta } = await adminApi.users(params);
  return (
    <>
      <PageHeader title="Users" action={<Link href="/admin/users/new" className={buttonClass}>+ Add user</Link>} />
      <FilterBar action="/admin/users">
        <FilterSelect name="role" label="Role" defaultValue={params.get("role") ?? ""} options={ROLES} />
        <FilterInput name="q" label="Search" defaultValue={params.get("q") ?? ""} placeholder="Name, email or phone" />
      </FilterBar>
      {users.length ? (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-3">
              <tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Role</th><th className="px-4 py-2">Contact</th><th className="px-4 py-2">Grade</th><th className="px-4 py-2">Status</th><th className="px-4 py-2" /></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-4 py-2 font-medium text-ink">
                    <span className="flex items-center gap-2">
                      <Avatar name={u.name} src={u.avatar} size={32} />
                      <Link href={`/admin/users/${u.id}`} className="hover:underline">{u.name}</Link>
                    </span>
                  </td>
                  <td className="px-4 py-2 capitalize text-ink-2">{u.role.replace("_", " ")}</td>
                  <td className="px-4 py-2 text-ink-2">{u.email ?? u.phone ?? "—"}</td>
                  <td className="px-4 py-2 text-ink-2">{u.grade ? `Grade ${u.grade}` : "—"}</td>
                  <td className="px-4 py-2"><Pill tone={u.status === "active" ? "success" : "neutral"}>{u.status}</Pill></td>
                  <td className="px-4 py-2 text-right">
                    <span className="inline-flex items-center gap-2">
                      <Link href={`/admin/users/${u.id}`} className="text-xs font-semibold text-brand hover:underline">Edit</Link>
                      <form action={toggleUser.bind(null, u.id)}>
                        <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-primary-light">
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Empty>No users match.</Empty>
      )}
      <Pagination base="/admin/users" params={params} page={meta.current_page} lastPage={meta.last_page} total={meta.total} />
    </>
  );
}
