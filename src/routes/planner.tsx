import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callGenerate } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Lumen Beauty" },
      {
        name: "description",
        content:
          "Generate prioritized daily and weekly schedules for your salon, skincare or beauty business team.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [horizon, setHorizon] = useState("day");
  const [goals, setGoals] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!goals.trim()) {
      toast.error("List a few goals or tasks to plan.");
      return;
    }
    setLoading(true);
    try {
      const text = await callGenerate("plan", { goals, horizon });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageHeader
        eyebrow="Planning"
        title="AI Task Planner"
        description="Get a focused, prioritized schedule built around how a beauty studio actually runs."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg text-foreground">Your inputs</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label>Plan horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily plan</SelectItem>
                  <SelectItem value="week">Weekly plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Goals & tasks</Label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="6 facial bookings, restock vitamin C serum, post 2 reels, train new esthetician on lash lift…"
                className="min-h-[260px]"
              />
            </div>
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Build my plan
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            placeholder="Your prioritized schedule will appear here."
          />
        </div>
      </div>
    </div>
  );
}