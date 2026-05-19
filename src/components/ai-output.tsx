import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RefreshCw, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AiOutput({
  value,
  onChange,
  onRegenerate,
  loading,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  placeholder?: string;
}) {
  const [internal, setInternal] = useState(value);
  useEffect(() => setInternal(value), [value]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-foreground">AI response</h3>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Regenerate
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(internal);
              toast.success("Copied to clipboard");
            }}
            disabled={!internal}
          >
            <Copy className="h-4 w-4" /> Copy
          </Button>
        </div>
      </div>
      <Textarea
        value={internal}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder ?? "Your AI response will appear here. Edit freely."}
        className="min-h-[320px] resize-y bg-card font-mono text-sm leading-relaxed"
      />
      <p className="text-xs text-muted-foreground">
        Tip: this output is fully editable. AI-generated content is for
        informational use — verify before sending or acting on it.
      </p>
    </div>
  );
}

export async function callGenerate(
  task: "email" | "summarize" | "plan" | "research",
  payload: Record<string, unknown>
): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ task, payload }),
  });
  if (!res.ok) {
    let msg = "Generation failed";
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {}
    if (res.status === 429) msg = "Rate limit reached. Please try again shortly.";
    if (res.status === 402)
      msg = "AI credits exhausted. Add credits in workspace settings.";
    throw new Error(msg);
  }
  const data = (await res.json()) as { text: string };
  return data.text;
}