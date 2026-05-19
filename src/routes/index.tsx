import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import {
  Mail,
  NotebookText,
  CalendarCheck,
  Sparkles,
  MessageCircleHeart,
} from "lucide-react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Lumen Beauty" },
      {
        name: "description",
        content:
          "Your AI workspace for beauty business productivity — emails, meeting notes, planning, research and chat in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const tools: Array<{
  to: "/email" | "/notes" | "/planner" | "/research" | "/chat";
  title: string;
  icon: ComponentType<{ className?: string }>;
  blurb: string;
}> = [
  {
    to: "/email",
    title: "Smart Email Generator",
    icon: Mail,
    blurb: "Draft client emails in formal, friendly or persuasive tones.",
  },
  {
    to: "/notes",
    title: "Meeting Notes Summarizer",
    icon: NotebookText,
    blurb: "Turn raw notes into key points, owners and deadlines.",
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    icon: CalendarCheck,
    blurb: "Prioritized day and week schedules for your salon team.",
  },
  {
    to: "/research",
    title: "Research Assistant",
    icon: Sparkles,
    blurb: "Latest skincare, haircare and body care trends, on demand.",
  },
  {
    to: "/chat",
    title: "Chat Assistant",
    icon: MessageCircleHeart,
    blurb: "Ask anything about running your beauty business.",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <PageHeader
        eyebrow="Workspace"
        title="Welcome to your beauty studio HQ"
        description="Choose a tool to get started. Everything you create stays editable so you can shape every word."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-serif text-xl text-foreground">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
            <span className="mt-4 inline-block text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Open tool →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border/70 bg-card/60 p-6">
        <h2 className="font-serif text-xl text-foreground">A note on responsible AI</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          AI-generated recommendations are intended for informational purposes
          and should not replace professional medical, dermatological, or
          business advice. Always verify ingredient claims with reputable
          sources, and consult a licensed professional for any client treatment
          concerns.
        </p>
      </div>
    </div>
  );
}
