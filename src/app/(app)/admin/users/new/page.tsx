import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { adminApi } from "@/lib/admin-api";
import { UserForm } from "../user-form";

export const metadata: Metadata = { title: "Add user" };

export default async function NewUserPage() {
  const seats = await adminApi.seats();
  return (
    <>
      <PageHeader back={{ href: "/admin/users", label: "Users" }} title="Add user" />
      <UserForm userId={null} initial={{ role: "student" }} seats={seats} />
    </>
  );
}
