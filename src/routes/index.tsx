import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import {
  Mail,
  NotebookText,
  CalendarCheck,
  Sparkles,
  MessageCircleHeart,
  Clock,
  CheckCircle2,
  FileSearch,
  Send,
} from "lucide-react";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import {
  formatTimeSaved,
  loadStats,
  tasksCompleted,
  type Stats,
} from "@/lib/stats";

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
  const [stats, setStats] = useState<Stats>(() => loadStats());

  useEffect(() => {
    const sync = () => setStats(loadStats());
    sync();
    window.addEventListener("lumen-stats-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("lumen-stats-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const statCards = [
    {
      label: "Time saved",
      value: formatTimeSaved(stats),
      icon: Clock,
      hint: "Estimated across all AI actions",
    },
    {
      label: "Emails generated",
      value: stats.email.toString(),
      icon: Send,
      hint: "Client-ready drafts",
    },
    {
      label: "Research summaries",
      value: stats.research.toString(),
      icon: FileSearch,
      hint: "Trend & ingredient briefings",
    },
    {
      label: "Tasks completed",
      value: tasksCompleted(stats).toString(),
      icon: CheckCircle2,
      hint: "Across every workspace tool",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-secondary/60 via-card to-card p-8 sm:p-12">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          Productivity for beauty pros
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight text-foreground sm:text-5xl">
          Less admin. More artistry.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Beauty professionals and small beauty businesses spend significant
          time on repetitive tasks such as client communication, scheduling,
          research, and meeting administration. This AI assistant automates
          these processes to improve productivity and save time.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" /> Draft an email
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <MessageCircleHeart className="h-4 w-4" /> Ask Leonice
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-serif text-3xl text-foreground">{s.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <PageHeader
          eyebrow="Workspace"
          title="Your beauty studio toolkit"
          description="Choose a tool to get started. Everything you create stays editable so you can shape every word."
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
