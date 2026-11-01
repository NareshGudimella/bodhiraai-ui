import { ChatPage } from "@/components/inbox/chat-page";

export default async function ParentConversationPage({ params }: PageProps<"/parent/chat/[id]">) {
  return <ChatPage basePath="/parent/chat" id={(await params).id} />;
}
