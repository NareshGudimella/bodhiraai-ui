import type { Metadata } from "next";
import { ChatIndex } from "@/components/inbox/chat-index";

export const metadata: Metadata = { title: "Messages" };

export default function ParentChatPage() {
  return <ChatIndex basePath="/parent/chat" />;
}
