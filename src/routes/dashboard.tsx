import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, UserSearch, Send, CalendarClock, Trophy, CheckSquare, AlertCircle, Plus } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/hooks/use-auth";
import { useCreate } from "@/components/CreateDialog";
import { useDashboardKpis, useTasks, useInterviews, useJobs, useSubmissions, useActivities, dateUtils } from "@/lib/queries";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const TONE: Record<string, string> = {
  info: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.32_0.12_245)]",
  warn: "bg-[oklch(0.97_0.06_75)] text-[oklch(0.42_0.14_60)]",
  success: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.35_0.12_155)]",
  danger: "bg-[oklch(0.96_0.06_25)] text-[oklch(0.42_0.18_25)]",
};

function fmtDT(s: string) { try { return new Date(s).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); } catch { return s; } }

function Dashboard() {
  const { profile, user } = useAuth();
  const { open } = useCreate();
  const { data: kpis } = useDashboardKpis();
  const { data: tasks = [] } = useTasks();
  const { data: interviews = [] } = useInterviews();
  const { data: jobs = [] } = useJobs();
  const { data: subs = [] } = useSubmissions();
  const { data: activities = [] } = useActivities(8);

  const firstName = (profile?.full_name || user?.email || "there").split(" ")[0].split("@")[0];
  const myTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 5);
  const upcoming = interviews.filter((i) => i.status === "Scheduled" && new Date(i.scheduled_at) >= new Date()).slice(0, 4);
  const urgentJobs = jobs.filter((j) => j.priority === "Urgent" || j.priority === "High").slice(0, 5);
  const recentSubs = subs.slice(0, 5);

  const cards = [
    { label: "Active jobs", value: kpis?.activeJobs ?? 0, delta: "Open + sourcing", icon: Briefcase, tone: "info" },
    { label: "New candidates", value: kpis?.newCandidates ?? 0, delta: "Last 7 days", icon: UserSearch, tone: "info" },
    { label: "Submissions", value: kpis?.submissions ?? 0, delta: "Last 7 days", icon: Send, tone: "info" },
    { label: "Upcoming interviews", value: kpis?.upcomingInterviews ?? 0, delta: "Scheduled", icon: CalendarClock, tone: "warn" },
    { label: "Placements", value: kpis?.placementsThisMonth ?? 0, delta: "This month", icon: Trophy, tone: "success" },
    { label: "Overdue tasks", value: kpis?.overdueTasks ?? 0, delta: "Across team", icon: AlertCircle, tone: "danger" },
  ];

  return (
    <div>
      <PageHeader
        title={`Good day, ${firstName}`}
        subtitle="Here is what needs your attention today."
        actions={
          <button onClick={() => open("job")} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New job order
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-4">
              <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md ${TONE[k.tone]}`}><Icon className="h-4 w-4" /></div>
              <div className="text-2xl font-semibold text-foreground">{k.value}</div>
              <div className="mt-0.5 text-xs font-medium text-foreground/80">{k.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{k.delta}</div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="My day" action={<Link to="/tasks" className="text-xs font-medium text-accent">View all</Link>} />
          {myTasks.length === 0 ? <Empty label="No open tasks." cta="Add task" onClick={() => open("task")} icon={CheckSquare} /> : (
            <ul className="divide-y divide-border">
              {myTasks.map((t) => (
                <li key={t.id} className="flex items-start gap-3 px-5 py-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border accent-[oklch(0.5_0.18_240)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{t.title}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{t.related_label ?? "—"}</span><span>•</span><span>{dateUtils.fmtDate(t.due_at)}</span>
                    </div>
                  </div>
                  <StatusBadge value={t.priority} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Upcoming interviews" action={<Link to="/interviews" className="text-xs font-medium text-accent">View all</Link>} />
          {upcoming.length === 0 ? <Empty label="Nothing scheduled." cta="Schedule" onClick={() => open("interview")} icon={CalendarClock} /> : (
            <ul className="divide-y divide-border">
              {upcoming.map((i) => (
                <li key={i.id} className="px-5 py-3">
                  <div className="flex items-center justify-between"><div className="text-sm font-medium text-foreground">{i.candidate_name}</div><span className="text-xs text-muted-foreground">{i.format}</span></div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{i.job_title} • {i.company_name}</div>
                  <div className="mt-1 text-xs font-medium text-accent">{fmtDT(i.scheduled_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Priority jobs" action={<Link to="/jobs" className="text-xs font-medium text-accent">View all</Link>} />
          {urgentJobs.length === 0 ? <Empty label="No urgent jobs." cta="New job" onClick={() => open("job")} icon={Briefcase} /> : (
            <ul className="divide-y divide-border">
              {urgentJobs.map((j) => (
                <li key={j.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0"><div className="truncate text-sm font-medium text-foreground">{j.title}</div><div className="truncate text-xs text-muted-foreground">{j.company_name} • {j.openings} openings</div></div>
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
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent submissions" action={<Link to="/submissions" className="text-xs font-medium text-accent">View all</Link>} />
          {recentSubs.length === 0 ? <Empty label="No submissions yet." cta="New submission" onClick={() => open("submission")} icon={Send} /> : (
            <ul className="divide-y divide-border">
              {recentSubs.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0"><div className="truncate text-sm font-medium text-foreground">{s.candidate_name} → {s.job_title}</div><div className="truncate text-xs text-muted-foreground">{s.company_name} • {dateUtils.fmtDate(s.submitted_at)}</div></div>
                  <StatusBadge value={s.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Activity" />
          {activities.length === 0 ? <Empty label="No recent activity." /> : (
            <ul className="divide-y divide-border">
              {activities.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="text-sm text-foreground">{a.subject}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{a.type} • {a.actor_name} • {dateUtils.fmtRelative(a.created_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Empty({ label, cta, onClick, icon: Icon }: { label: string; cta?: string; onClick?: () => void; icon?: typeof Briefcase }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
      {Icon && <div className="rounded-full bg-muted p-2 text-muted-foreground"><Icon className="h-4 w-4" /></div>}
      <div className="text-sm text-muted-foreground">{label}</div>
      {cta && onClick && <button onClick={onClick} className="mt-1 inline-flex h-8 items-center gap-1 rounded-md bg-accent px-3 text-xs font-medium text-accent-foreground"><Plus className="h-3.5 w-3.5" />{cta}</button>}
    </div>
  );
}
