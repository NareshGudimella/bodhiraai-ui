import { Card, Empty, SectionTitle, PageHeader } from "@/components/ui";
import { unlinkUser } from "@/lib/admin-actions";
import { adminApi } from "@/lib/admin-api";
import { UserForm } from "../user-form";
import { LinkForm } from "./link-form";

export default async function EditUserPage({ params }: PageProps<"/admin/users/[id]">) {
  const { id } = await params;
  const [u, { links, linkable }] = await Promise.all([adminApi.user(id), adminApi.links(id)]);
  const linksTo = u.role === "parent" ? "Children" : u.role === "student" ? "Parents" : null;
  return (
    <>
      <PageHeader back={{ href: "/admin/users", label: "Users" }} title={u.name} subtitle={`${u.role} · ${u.status}`} />
      <UserForm userId={u.id} initial={u} />
      {linksTo && (
        <Card className="mt-8 max-w-3xl">
          <SectionTitle>{linksTo}</SectionTitle>
          {links.length ? (
            <ul className="mb-4 space-y-1 text-sm">
              {links.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 rounded-lg bg-page px-3 py-2 ring-1 ring-line">
                  <span className="min-w-0 truncate text-ink">
                    {l.name} <span className="text-xs capitalize text-ink-3">· {l.pivot.relation ? `${l.pivot.relation} · ` : ""}{l.role}</span>
                  </span>
                  <form action={unlinkUser.bind(null, u.id, l.id)}>
                    <button className="rounded-md border border-line px-2 py-1 text-xs hover:bg-danger-light hover:text-danger">Unlink</button>
                  </form>
                </li>
              ))}
            </ul>
          ) : <div className="mb-4"><Empty>No links yet.</Empty></div>}
          {linkable.length ? (
            <LinkForm userId={u.id} otherKey={u.role === "parent" ? "student_id" : "parent_id"} options={linkable} />
          ) : <p className="text-xs text-ink-3">Everyone who could be linked already is.</p>}
        </Card>
      )}
    </>
  );
}
