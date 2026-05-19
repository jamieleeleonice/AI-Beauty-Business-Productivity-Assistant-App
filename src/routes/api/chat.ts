import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are Lumen, an AI productivity assistant for beauty professionals — salon owners, skincare consultants, estheticians, hair stylists, and small beauty business operators.

Help with: client communication, scheduling, marketing copy, product recommendations, skincare/haircare/body-care knowledge, ingredients, trends, business operations, retention, pricing, inventory, and team management.

Be warm, concise, and practical. Use short paragraphs and bullet points. Cite well-known ingredient science when relevant. If asked something medical or dermatological, recommend consulting a licensed professional.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(DEFAULT_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});