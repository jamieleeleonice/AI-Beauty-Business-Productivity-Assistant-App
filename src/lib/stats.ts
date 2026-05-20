export type StatKey =
  | "email"
  | "summarize"
  | "plan"
  | "research"
  | "chat";

const KEY = "lumen-stats-v1";

// Estimated minutes saved per AI action — used for the "time saved" stat.
const MINUTES_PER_ACTION: Record<StatKey, number> = {
  email: 8,
  summarize: 12,
  plan: 15,
  research: 20,
  chat: 3,
};

export type Stats = Record<StatKey, number>;

function empty(): Stats {
  return { email: 0, summarize: 0, plan: 0, research: 0, chat: 0 };
}

export function loadStats(): Stats {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...(JSON.parse(raw) as Partial<Stats>) };
  } catch {
    return empty();
  }
}

export function recordStat(key: StatKey, amount = 1) {
  if (typeof window === "undefined") return;
  const next = loadStats();
  next[key] = (next[key] ?? 0) + amount;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("lumen-stats-changed"));
}

export function minutesSaved(stats: Stats): number {
  return (Object.keys(MINUTES_PER_ACTION) as StatKey[]).reduce(
    (sum, k) => sum + (stats[k] ?? 0) * MINUTES_PER_ACTION[k],
    0,
  );
}

export function formatTimeSaved(stats: Stats): string {
  const mins = minutesSaved(stats);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remain = mins % 60;
  return remain ? `${hours}h ${remain}m` : `${hours}h`;
}

export function tasksCompleted(stats: Stats): number {
  return (Object.values(stats) as number[]).reduce((a, b) => a + b, 0);
}