import { createFileRoute, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, MessageCircleHeart } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  deriveTitle,
  getThread,
  upsertThread,
} from "@/lib/chat-threads";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = useParams({ from: "/chat/$threadId" });

  const initialMessages = useMemo<UIMessage[]>(() => {
    if (typeof window === "undefined") return [];
    return getThread(threadId)?.messages ?? [];
  }, [threadId]);

  return (
    <ChatThreadInner
      key={threadId}
      threadId={threadId}
      initialMessages={initialMessages}
    />
  );
}

function ChatThreadInner({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: UIMessage[];
}) {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Chat failed"),
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus on mount / thread change / after streaming
  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    if (status === "submitted" || status === "streaming") return;
    const title = deriveTitle(messages);
    upsertThread({
      id: threadId,
      title,
      updatedAt: Date.now(),
      messages,
    });
  }, [messages, status, threadId]);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 && (
            <ConversationEmptyState
              icon={<MessageCircleHeart className="h-8 w-8 text-primary" />}
              title="Ask Lumen anything"
              description="Ingredients, retention ideas, product launches, treatment protocols — your beauty business co-pilot is ready."
            />
          )}

          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <Shimmer className="text-sm">Thinking…</Shimmer>
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 bg-background/80 p-4 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={async ({ text }) => {
              const trimmed = text.trim();
              if (!trimmed || isLoading) return;
              setInput("");
              await sendMessage({ text: trimmed });
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ingredients, clients, marketing, scheduling…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim()} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            AI-generated recommendations are for informational purposes and
            shouldn't replace professional medical, dermatological, or business
            advice.
          </p>
        </div>
      </div>
    </div>
  );
}