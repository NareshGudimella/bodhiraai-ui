import type { Metadata } from "next";
import { AiWorkspace } from "./workspace";

export const metadata: Metadata = { title: "AI Tutor" };

export default function AiPage() {
  return <AiWorkspace />;
}
