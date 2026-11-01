import { ChatPage } from "@/components/inbox/chat-page";

export default async function TeacherConversationPage({ params }: PageProps<"/teacher/chat/[id]">) {
  return <ChatPage basePath="/teacher/chat" id={(await params).id} />;
}
