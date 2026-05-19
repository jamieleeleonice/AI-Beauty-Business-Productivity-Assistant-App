import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callGenerate } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Lumen Beauty" },
      {
        name: "description",
        content:
          "Research skincare, haircare and body-care trends and get actionable recommendations for your beauty business.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("skincare");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!topic.trim()) {
      toast.error("Enter a research topic.");
      return;
    }
    setLoading(true);
    try {
      const text = await callGenerate("research", { topic, category });
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
        eyebrow="Insights"
        title="AI Research Assistant"
        description="Explore current trends in skincare, haircare and body care, with notes on how to apply them in your business."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg text-foreground">Research brief</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skincare">Skincare</SelectItem>
                  <SelectItem value="haircare">Haircare</SelectItem>
                  <SelectItem value="body care">Body care</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. retinal vs retinol, scalp microbiome, glass skin routines"
              />
            </div>
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Research
            </Button>
            <p className="text-xs text-muted-foreground">
              AI-generated recommendations are intended for informational
              purposes and should not replace professional medical or
              dermatological advice.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            placeholder="Your research briefing will appear here."
          />
        </div>
      </div>
    </div>
  );
}