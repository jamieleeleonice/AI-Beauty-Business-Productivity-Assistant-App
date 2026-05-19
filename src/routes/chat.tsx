import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ThreadList } from "@/components/thread-list";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat Assistant — Lumen Beauty" },
      {
        name: "description",
        content:
          "Chat with Lumen, your AI assistant for beauty business questions, ingredient research and client communication.",
      },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <ThreadList />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}