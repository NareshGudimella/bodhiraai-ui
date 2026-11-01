import { AiWorkspace } from "../workspace";

/** `/student/ai/new` opens an empty chat; numeric ids open that conversation. */
export default async function AiSessionPage({ params }: PageProps<"/student/ai/[id]">) {
  const { id } = await params;
  return id === "new" ? <AiWorkspace fresh /> : <AiWorkspace sessionId={id} key={id} />;
}
