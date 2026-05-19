import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import {
  type ChatThread,
  createThreadId,
  deleteThread,
  loadThreads,
  upsertThread,
} from "@/lib/chat-threads";
import { cn } from "@/lib/utils";

export function ThreadList() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  useEffect(() => {
    setThreads(loadThreads());
    const onChange = () => setThreads(loadThreads());
    window.addEventListener("lumen-threads-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("lumen-threads-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  function newThread() {
    const id = createThreadId();
    upsertThread({
      id,
      title: "New conversation",
      updatedAt: Date.now(),
      messages: [],
    });
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  }

  function remove(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    deleteThread(id);
    if (id === activeId) navigate({ to: "/chat" });
  }

  return (
    <aside className="flex h-full w-full flex-col gap-3 border-r border-border/60 bg-card/60 p-4 md:w-72">
      <Button onClick={newThread} className="w-full">
        <Plus className="h-4 w-4" /> New chat
      </Button>
      <div className="flex flex-col gap-1 overflow-y-auto">
        {threads.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No conversations yet. Start a new chat.
          </p>
        )}
        {threads.map((t) => {
          const isActive = t.id === activeId;
          return (
            <div
              key={t.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg border border-transparent px-2 py-2 text-sm transition-colors",
                isActive
                  ? "border-border bg-secondary text-foreground"
                  : "hover:bg-secondary/60"
              )}
            >
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{t.title}</span>
              </Link>
              <button
                type="button"
                onClick={(e) => remove(t.id, e)}
                className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label="Delete conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}