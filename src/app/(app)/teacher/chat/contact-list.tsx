"use client";

import { useState } from "react";
import { inputClass } from "@/components/form";
import { Card, Empty } from "@/components/ui";
import { startChat } from "@/lib/inbox-actions";

export type ContactRow = {
  start: "with-teacher" | "with-parent";
  student: { id: number; name: string };
  partner: { id: number; name: string; role_label: string | null };
};

/** "Start a chat" contacts with a search box (by parent or student name). */
export function ContactList({ contacts }: { contacts: ContactRow[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = q
    ? contacts.filter((c) => c.partner.name.toLowerCase().includes(q) || c.student.name.toLowerCase().includes(q))
    : contacts;
  return (
    <>
      {contacts.length > 0 && (
        <label className="mb-3 block">
          <span className="sr-only">Search contacts</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parent or student…"
            className={inputClass}
          />
        </label>
      )}
      {shown.length ? (
        <ul className="space-y-2">
          {shown.map((c) => (
            <li key={`${c.start}-${c.student.id}-${c.partner.id}`}>
              <form action={startChat.bind(null, c.start, c.student.id)}>
                <button className="w-full text-left">
                  <Card className="p-3 transition hover:ring-primary">
                    <span className="block font-medium text-ink">{c.partner.name}</span>
                    <span className="block text-xs text-ink-3">
                      {c.partner.role_label ?? "Contact"} · about {c.student.name}
                    </span>
                  </Card>
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>{contacts.length ? "No contacts match your search." : "No new contacts."}</Empty>
      )}
    </>
  );
}
