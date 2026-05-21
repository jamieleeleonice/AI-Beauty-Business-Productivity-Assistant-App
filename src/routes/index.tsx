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
  Target,
  Users,
  Goal,
  TrendingUp,
  ArrowDown,
  Layers,
  Lightbulb,
  MessageSquare,
  Settings,
  ShieldCheck,
  AlertCircle,
  ListOrdered,
  MousePointerClick,
  Keyboard,
  Eye,
  Pencil,
  Save,
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

      <PresentationSection />

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

function PresentationSection() {
  return (
    <section className="mt-14">
      <PageHeader
        eyebrow="Presentation & Demo"
        title="Project showcase"
        description="A complete overview of the AI Beauty Business Productivity Assistant for evaluation and demonstration."
      />

      <div className="mt-8 space-y-8">
        {/* 1. Solution Overview */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="font-serif text-2xl text-foreground">Solution Overview</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              icon={Target}
              title="Problem Statement"
              content="Beauty professionals and small beauty businesses spend significant time on repetitive tasks such as client communication, scheduling, research, and meeting administration."
            />
            <OverviewCard
              icon={Users}
              title="Target Users"
              content={
                <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  <li>Salon owners</li>
                  <li>Beauty professionals</li>
                  <li>Skincare consultants</li>
                  <li>Small beauty businesses</li>
                </ul>
              }
            />
            <OverviewCard
              icon={Goal}
              title="Solution Objective"
              content="Use AI to automate repetitive workplace tasks and improve productivity."
            />
            <OverviewCard
              icon={TrendingUp}
              title="Productivity Value"
              content="Reduce admin time, improve client communication quality, streamline planning, and deliver faster research insights."
            />
          </div>
        </div>

        {/* 2. System Architecture */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="font-serif text-2xl text-foreground">System Architecture</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            How user requests flow through the AI engine to generate actionable output.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {[
              { label: "User Input", icon: Keyboard },
              { label: "AI Prompt Processing", icon: MessageSquare },
              { label: "AI Feature Engine", icon: Layers },
              { label: "Generated Output", icon: Lightbulb },
              { label: "User Review and Action", icon: Eye },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex flex-col items-center gap-3">
                <div className="flex w-full max-w-sm items-center gap-4 rounded-xl border border-border bg-secondary/40 px-5 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <ArrowDown className="h-5 w-5 text-muted-foreground/60" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Prompt Engineering Strategy */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="font-serif text-2xl text-foreground">Prompt Engineering Strategy</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Every AI request is structured around five core prompt dimensions for reliable, high-quality output.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Context", desc: "Beauty industry scenario and background details." },
              { label: "Goal", desc: "Clear outcome the AI should produce." },
              { label: "Tone", desc: "Formal, friendly, or persuasive voice." },
              { label: "Audience", desc: "Client, team member, or stakeholder." },
              { label: "Instructions", desc: "Specific formatting and content rules." },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-secondary/30 p-4 text-center"
              >
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PromptExampleCard
              tool="Smart Email Generator"
              example="Write a friendly follow-up email to a client who visited for a facial treatment. Ask about their experience and suggest a skincare routine."
            />
            <PromptExampleCard
              tool="Meeting Notes Summarizer"
              example="Summarize these salon meeting notes into key points, action items with owners, and deadlines. List decisions made and next steps."
            />
            <PromptExampleCard
              tool="AI Task Planner"
              example="Create a prioritized weekly schedule for a salon team of 4. Include client appointments, inventory checks, social media posts, and staff training."
            />
          </div>
        </div>

        {/* 4. Responsible AI */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="flex items-center gap-2 font-serif text-2xl text-foreground">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Responsible AI
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: AlertCircle,
                title: "Accuracy",
                text: "AI outputs may contain inaccuracies. Always verify facts before use.",
              },
              {
                icon: Eye,
                title: "Human Review",
                text: "Human review is recommended before any business or client-facing decision.",
              },
              {
                icon: Settings,
                title: "Verification",
                text: "Users should verify information with authoritative sources and professional references.",
              },
              {
                icon: ShieldCheck,
                title: "Not a Replacement",
                text: "Recommendations do not replace professional medical, dermatological, or business advice.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-4"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Demo Walkthrough */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="font-serif text-2xl text-foreground">Demo Walkthrough</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Follow these steps to experience the AI assistant in action.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { step: 1, title: "Open Dashboard", desc: "Launch the app and review your productivity stats.", icon: ListOrdered },
              { step: 2, title: "Select a Feature", desc: "Choose Email, Notes, Planner, Research, or Chat.", icon: MousePointerClick },
              { step: 3, title: "Enter User Inputs", desc: "Provide context, tone, goals, and audience details.", icon: Keyboard },
              { step: 4, title: "Generate AI Response", desc: "Click generate and watch the AI produce tailored output.", icon: Sparkles },
              { step: 5, title: "Review and Edit Output", desc: "Fine-tune the generated content to match your voice.", icon: Pencil },
              { step: 6, title: "Save or Use Content", desc: "Copy to clipboard or save for future reference.", icon: Save },
            ].map((s) => (
              <div
                key={s.step}
                className="relative flex items-start gap-4 rounded-xl border border-border bg-secondary/30 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewCard({
  icon: Icon,
  title,
  content,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {typeof content === "string" ? <p>{content}</p> : content}
      </div>
    </div>
  );
}

function PromptExampleCard({ tool, example }: { tool: string; example: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">{tool}</h4>
      </div>
      <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
        “{example}”
      </p>
    </div>
  );
}

