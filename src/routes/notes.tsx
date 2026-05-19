import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callGenerate } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Lumen Beauty" },
      {
        name: "description",
        content:
          "Summarize beauty business meeting notes into key points, action items, deadlines and owners.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (notes.trim().length < 20) {
      toast.error("Paste a few sentences of meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const text = await callGenerate("summarize", { notes });
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
        eyebrow="Operations"
        title="Meeting Notes Summarizer"
        description="Drop in raw meeting notes — get structured key points, action items, deadlines and owners."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg text-foreground">Meeting notes</h2>
          <div className="mt-4 grid gap-3">
            <Label>Paste your notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Team weekly — discussed June promo, Lara to confirm with supplier by Friday, slow Tuesdays need a discount strategy…"
              className="min-h-[320px]"
            />
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Summarize
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            placeholder="Your structured summary will appear here."
          />
        </div>
      </div>
    </div>
  );
}