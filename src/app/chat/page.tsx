import type { Metadata } from "next";
import { ChatApp } from "@/components/chat/chat-app";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with EchoGPT and other leading AI models, or compare two side by side.",
};

export default function ChatPage() {
  return <ChatApp />;
}
