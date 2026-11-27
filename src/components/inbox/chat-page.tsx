import { PageHeader } from "@/components/ui";
import { inboxApi } from "@/lib/inbox-api";
import { canonical } from "@/lib/canonical";
import { getT } from "@/lib/i18n";
import { ChatThread } from "./chat-thread";

/** Shared /<role>/chat/[id] page body. Opening the thread marks incoming messages read. */
export async function ChatPage({ basePath, id }: { basePath: string; id: string }) {
  const [{ conversation, messages }, t] = await Promise.all([inboxApi.conversation(id), getT()]);
  canonical(id, conversation.public_id, basePath);
  return (
    <>
      <PageHeader
        back={{ href: basePath, label: "Messages" }}
        title={conversation.partner?.name ?? "Conversation"}
        subtitle={conversation.partner?.role_label ?? undefined}
      />
      <ChatThread
        key={conversation.id}
        conversationId={conversation.id}
        initial={messages}
        labels={{ placeholder: t("Type a message…"), send: t("Send") }}
      />
    </>
  );
}
