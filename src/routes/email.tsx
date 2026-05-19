import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AiOutput, callGenerate } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Lumen Beauty" },
      {
        name: "description",
        content:
          "Generate professional client emails in formal, friendly or persuasive tones for your beauty business.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [tone, setTone] = useState("friendly");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!context.trim()) {
      toast.error("Add a few notes about what the email should say.");
      return;
    }
    setLoading(true);
    try {
      const text = await callGenerate("email", { tone, recipient, subject, context });
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
        eyebrow="Communication"
        title="Smart Email Generator"
        description="Draft polished client emails in seconds. Pick a tone, add the gist, and refine the output."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-lg text-foreground">Email brief</h2>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Recipient</Label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Returning facial client, Sophie"
              />
            </div>

            <div className="grid gap-2">
              <Label>Subject hint (optional)</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Hydrafacial promo for May"
              />
            </div>

            <div className="grid gap-2">
              <Label>Context / key points</Label>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Booking confirmation, post-treatment aftercare reminders, link to rebook…"
                className="min-h-[160px]"
              />
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Generate email
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <AiOutput
            value={output}
            onChange={setOutput}
            onRegenerate={run}
            loading={loading}
            placeholder="Your AI-drafted email will appear here. Edit freely before sending."
          />
        </div>
      </div>
    </div>
  );
}