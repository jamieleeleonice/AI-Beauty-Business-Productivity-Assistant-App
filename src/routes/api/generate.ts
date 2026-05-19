import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

const BodySchema = z.object({
  task: z.enum(["email", "summarize", "plan", "research"]),
  payload: z.record(z.string(), z.any()),
});

function buildPrompt(task: string, p: Record<string, unknown>): { system: string; prompt: string } {
  switch (task) {
    case "email": {
      const tone = String(p.tone ?? "friendly");
      const recipient = String(p.recipient ?? "client");
      const subject = String(p.subject ?? "");
      const context = String(p.context ?? "");
      return {
        system: `You are an expert copywriter for beauty businesses. Write polished, on-brand emails. Keep it concise. Return plain email body with a subject line on the first line prefixed "Subject:".`,
        prompt: `Write a ${tone} email to ${recipient}.\nSubject hint: ${subject}\nContext / notes:\n${context}`,
      };
    }
    case "summarize": {
      const notes = String(p.notes ?? "");
      return {
        system: `You summarize meeting notes for beauty salon and skincare business teams. Output clean markdown with these sections: ## Key Points, ## Action Items (each with owner if mentioned), ## Deadlines, ## Responsibilities.`,
        prompt: `Meeting notes:\n\n${notes}`,
      };
    }
    case "plan": {
      const goals = String(p.goals ?? "");
      const horizon = String(p.horizon ?? "day");
      return {
        system: `You are a productivity coach for beauty professionals. Build clear, prioritized schedules in markdown. Group by time blocks (Morning / Midday / Afternoon / Evening for a day, or Mon–Sun for a week). Mark each task with priority [P1]/[P2]/[P3] and estimated minutes.`,
        prompt: `Build a ${horizon === "week" ? "weekly" : "daily"} plan from these goals and tasks:\n\n${goals}`,
      };
    }
    case "research": {
      const topic = String(p.topic ?? "");
      const category = String(p.category ?? "skincare");
      return {
        system: `You are a research assistant for beauty professionals. Provide accurate, current-style insights on ${category} trends, ingredients, formulations, and consumer behavior. Output markdown with sections: ## Overview, ## Key Trends, ## Recommended Ingredients/Products, ## How to Apply in Your Business, ## Caveats. Avoid making up sources.`,
        prompt: `Research topic: ${topic}\nFocus area: ${category}`,
      };
    }
  }
  return { system: "", prompt: "" };
}

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = BodySchema.safeParse(await request.json());
        if (!body.success) {
          return new Response(JSON.stringify({ error: "invalid body" }), { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response(JSON.stringify({ error: "missing key" }), { status: 500 });

        const { system, prompt } = buildPrompt(body.data.task, body.data.payload);
        const gateway = createLovableAiGatewayProvider(key);
        try {
          const { text } = await generateText({
            model: gateway(DEFAULT_MODEL),
            system,
            prompt,
          });
          return Response.json({ text });
        } catch (err) {
          const status =
            err && typeof err === "object" && "statusCode" in err
              ? Number((err as { statusCode: unknown }).statusCode) || 500
              : 500;
          const message = err instanceof Error ? err.message : "Generation failed";
          return new Response(JSON.stringify({ error: message }), { status });
        }
      },
    },
  },
});