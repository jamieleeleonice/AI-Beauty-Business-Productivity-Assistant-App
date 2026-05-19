import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const THREADS_KEY = "lumen-chat-threads-v1";

function safeRead(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(THREADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadThreads(): ChatThread[] {
  return safeRead().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveThreads(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  window.dispatchEvent(new Event("lumen-threads-changed"));
}

export function getThread(id: string): ChatThread | undefined {
  return loadThreads().find((t) => t.id === id);
}

export function upsertThread(thread: ChatThread) {
  const all = safeRead();
  const idx = all.findIndex((t) => t.id === thread.id);
  if (idx === -1) all.push(thread);
  else all[idx] = thread;
  saveThreads(all);
}

export function deleteThread(id: string) {
  saveThreads(safeRead().filter((t) => t.id !== id));
}

export function createThreadId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const text =
    first.parts
      ?.map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .trim() ?? "";
  if (!text) return "New conversation";
  return text.length > 48 ? text.slice(0, 48) + "…" : text;
}