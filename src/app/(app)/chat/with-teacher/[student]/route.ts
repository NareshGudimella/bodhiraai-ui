import type { NextRequest } from "next/server";
import { legacyStartChat } from "@/lib/legacy-chat";

/** Legacy GET /chat/with-teacher/{student} (see lib/legacy-chat.ts). */
export async function GET(request: NextRequest, ctx: RouteContext<"/chat/with-teacher/[student]">) {
  const { student } = await ctx.params;
  return legacyStartChat(request, "with-teacher", student);
}
