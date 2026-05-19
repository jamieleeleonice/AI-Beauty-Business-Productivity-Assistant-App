import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";
import { createThreadId, upsertThread } from "@/lib/chat-threads";

export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();

  function start() {
    const id = createThreadId();
    upsertThread({
      id,
      title: "New conversation",
      updatedAt: Date.now(),
      messages: [],
    });
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Sparkles className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-serif text-3xl text-foreground">
          Meet Lumen
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your AI workplace assistant for beauty professionals. Ask about
          ingredients, treatments, client retention, marketing or anything else
          on your mind.
        </p>
        <Button className="mt-6" onClick={start}>
          <Plus className="h-4 w-4" /> Start a conversation
        </Button>
      </div>
    </div>
  );
}