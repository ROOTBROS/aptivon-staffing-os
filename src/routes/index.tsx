import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  UserPlus,
  Send,
  CalendarClock,
  Trophy,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { activities, interviews, jobs, submissions, tasks } from "@/lib/sample-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const kpis = [
  { label: "Active jobs", value: "23", delta: "+4 this week", icon: Briefcase, tone: "info" },
  { label: "New candidates", value: "47", delta: "+12 this week", icon: UserPlus, tone: "info" },
  { label: "Submissions", value: "31", delta: "+8 this week", icon: Send, tone: "info" },
  { label: "Interviews scheduled", value: "9", delta: "Next 7 days", icon: CalendarClock, tone: "warn" },
  { label: "Placements", value: "6", delta: "This month", icon: Trophy, tone: "success" },
  { label: "Projected revenue", value: "$284k", delta: "Next 30 days", icon: DollarSign, tone: "success" },
  { label: "Overdue tasks", value: "4", delta: "Across team", icon: AlertCircle, tone: "danger" },
];

const toneRing: Record<string, string> = {
  info: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.32_0.12_245)]",
  warn: "bg-[oklch(0.97_0.06_75)] text-[oklch(0.42_0.14_60)]",
  success: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.35_0.12_155)]",
  danger: "bg-[oklch(0.96_0.06_25)] text-[oklch(0.42_0.18_25)]",
};

function Dashboard() {
  const myTasks = tasks.filter((t) => t.owner === "Jordan Reyes").slice(0, 5);
  const upcoming = interviews.filter((i) => i.status === "Scheduled").slice(0, 4);
  const urgentJobs = jobs.filter((j) => j.priority === "Urgent" || j.priority === "High").slice(0, 5);
  const recentSubs = submissions.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Good morning, Jordan"
        subtitle="Here is what needs your attention today."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New job order
          </button>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-4">
              <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md ${toneRing[k.tone]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-semibold text-foreground">{k.value}</div>
              <div className="mt-0.5 text-xs font-medium text-foreground/80">{k.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{k.delta}</div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* My day */}
        <Card className="lg:col-span-1">
          <CardHeader title="My day" action={<Link to="/tasks" className="text-xs font-medium text-accent">View all</Link>} />
          <ul className="divide-y divide-border">
            {myTasks.map((t) => (
              <li key={t.id} className="flex items-start gap-3 px-5 py-3">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border accent-[oklch(0.5_0.18_240)]" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{t.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t.related}</span>
                    <span>•</span>
                    <span>{t.due}</span>
                  </div>
                </div>
                <StatusBadge value={t.priority} />
              </li>
            ))}
          </ul>
        </Card>

        {/* Upcoming interviews */}
        <Card>
          <CardHeader title="Upcoming interviews" action={<Link to="/interviews" className="text-xs font-medium text-accent">View all</Link>} />
          <ul className="divide-y divide-border">
            {upcoming.map((i) => (
              <li key={i.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">{i.candidate}</div>
                  <span className="text-xs text-muted-foreground">{i.format}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{i.job} • {i.company}</div>
                <div className="mt-1 text-xs font-medium text-accent">{i.datetime}</div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Urgent jobs */}
        <Card>
          <CardHeader title="Priority jobs" action={<Link to="/jobs" className="text-xs font-medium text-accent">View all</Link>} />
          <ul className="divide-y divide-border">
            {urgentJobs.map((j) => (
              <li key={j.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{j.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{j.company} • {j.openings} openings</div>
                  </div>
                  <StatusBadge value={j.priority} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span><span className="font-medium text-foreground">{j.submitted}</span> submitted</span>
                  <span><span className="font-medium text-foreground">{j.interviewing}</span> interviewing</span>
                  <span><span className="font-medium text-foreground">{j.offers}</span> offers</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent submissions" action={<Link to="/submissions" className="text-xs font-medium text-accent">View all</Link>} />
          <ul className="divide-y divide-border">
            {recentSubs.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">{s.candidate} → {s.job}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.company} • {s.submittedAt}</div>
                </div>
                <StatusBadge value={s.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Activity" />
          <ul className="divide-y divide-border">
            {activities.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-5 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground">{a.subject}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{a.type} • {a.who} • {a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}