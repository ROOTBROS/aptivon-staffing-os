import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, LabelList,
  Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCandidates, useJobs, usePlacements, useSubmissions, useTasks,
  useActivities, useCompanies,
} from "@/lib/queries";

export const Route = createFileRoute("/reports")({ component: Reports });

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899"];

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} />
      <div className="h-72 p-4">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function parseMoney(v: string | null | undefined): number {
  if (!v) return 0;
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function Reports() {
  const jobs = useJobs();
  const subs = useSubmissions();
  const cands = useCandidates();
  const pls = usePlacements();
  const tasks = useTasks();
  const acts = useActivities(200);
  const cos = useCompanies();

  const loading = jobs.isLoading || subs.isLoading || pls.isLoading || tasks.isLoading;

  // ===== Recruiting activity per user (last 30d) =====
  const activityByUser = useMemo(() => {
    const since = Date.now() - 30 * 86400000;
    const map: Record<string, { name: string; activities: number; submissions: number; candidates: number }> = {};
    (acts.data ?? []).forEach((a) => {
      if (new Date(a.created_at).getTime() < since) return;
      const k = a.actor_name || "—";
      map[k] = map[k] ?? { name: k, activities: 0, submissions: 0, candidates: 0 };
      map[k].activities += 1;
    });
    (subs.data ?? []).forEach((s) => {
      if (new Date(s.submitted_at).getTime() < since) return;
      const k = s.submitted_by_name || "—";
      map[k] = map[k] ?? { name: k, activities: 0, submissions: 0, candidates: 0 };
      map[k].submissions += 1;
    });
    (cands.data ?? []).forEach((c) => {
      const k = c.owner_name || "—";
      map[k] = map[k] ?? { name: k, activities: 0, submissions: 0, candidates: 0 };
      map[k].candidates += 1;
    });
    return Object.values(map).sort((a, b) => b.submissions - a.submissions).slice(0, 10);
  }, [acts.data, subs.data, cands.data]);

  // ===== Job pipeline =====
  const jobsByStatus = useMemo(() => {
    const m: Record<string, number> = {};
    (jobs.data ?? []).forEach((j) => (m[j.status] = (m[j.status] ?? 0) + 1));
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [jobs.data]);
  const jobsByPriority = useMemo(() => {
    const m: Record<string, number> = {};
    (jobs.data ?? []).forEach((j) => (m[j.priority] = (m[j.priority] ?? 0) + 1));
    return ["High", "Medium", "Low"].map((p) => ({ name: p, value: m[p] ?? 0 }));
  }, [jobs.data]);
  const agingJobs = useMemo(
    () => (jobs.data ?? []).filter((j) => ["Open", "Sourcing", "Interviewing"].includes(j.status) && j.age >= 21).length,
    [jobs.data],
  );
  const jobsNoSubs = useMemo(
    () => (jobs.data ?? []).filter((j) => j.status !== "Closed" && j.submitted === 0).length,
    [jobs.data],
  );

  // ===== Submission funnel =====
  const funnelData = useMemo(() => {
    const s = subs.data ?? [];
    const c = (statuses: string[]) => s.filter((x) => statuses.includes(x.status)).length;
    const submitted = s.length;
    const reviewed = c(["Reviewed", "Interview requested", "Interviewing", "Offer pending", "Placed"]);
    const interview = c(["Interview requested", "Interviewing", "Offer pending", "Placed"]);
    const offer = c(["Offer pending", "Placed"]);
    const placed = c(["Placed"]);
    return [
      { name: "Submitted", value: submitted, fill: COLORS[0] },
      { name: "Reviewed", value: reviewed, fill: COLORS[1] },
      { name: "Interview", value: interview, fill: COLORS[2] },
      { name: "Offer", value: offer, fill: COLORS[3] },
      { name: "Placed", value: placed, fill: COLORS[4] },
    ];
  }, [subs.data]);

  // ===== Client performance =====
  const clientPerf = useMemo(() => {
    const j = jobs.data ?? [];
    const s = subs.data ?? [];
    const p = pls.data ?? [];
    const jobByCo: Record<string, string> = {};
    j.forEach((x) => x.company_id && (jobByCo[x.id] = x.company_id));
    const map: Record<string, { name: string; subs: number; placements: number; activeJobs: number }> = {};
    (cos.data ?? []).forEach((c) => (map[c.id] = { name: c.name, subs: 0, placements: 0, activeJobs: 0 }));
    j.forEach((x) => {
      if (x.company_id && map[x.company_id] && ["Open", "Sourcing", "Interviewing", "Offer"].includes(x.status))
        map[x.company_id].activeJobs += 1;
    });
    s.forEach((x) => { const cid = jobByCo[x.job_id]; if (cid && map[cid]) map[cid].subs += 1; });
    p.forEach((x) => x.company_name && Object.values(map).forEach((m) => { if (m.name === x.company_name) m.placements += 1; }));
    return Object.values(map).filter((m) => m.subs + m.placements + m.activeJobs > 0)
      .sort((a, b) => (b.placements - a.placements) || (b.subs - a.subs)).slice(0, 8);
  }, [jobs.data, subs.data, pls.data, cos.data]);

  // ===== Placement & revenue =====
  const placementMonths = useMemo(() => {
    const m: Record<string, { name: string; placements: number; revenue: number }> = {};
    const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
    (pls.data ?? []).forEach((p) => {
      const k = fmt(p.start_date);
      m[k] = m[k] ?? { name: k, placements: 0, revenue: 0 };
      m[k].placements += 1;
      m[k].revenue += parseMoney(p.bill_rate) * 40 * 4;
    });
    return Object.values(m).slice(-8);
  }, [pls.data]);
  const totalRevenue = placementMonths.reduce((sum, m) => sum + m.revenue, 0);
  const upcomingStarts = useMemo(
    () => (pls.data ?? []).filter((p) => new Date(p.start_date).getTime() > Date.now()).length,
    [pls.data],
  );

  // ===== Task performance =====
  const tasksByUser = useMemo(() => {
    const m: Record<string, { name: string; open: number; overdue: number; done: number }> = {};
    const now = Date.now();
    (tasks.data ?? []).forEach((t) => {
      const k = t.owner_name || "—";
      m[k] = m[k] ?? { name: k, open: 0, overdue: 0, done: 0 };
      if (t.status === "Done") m[k].done += 1;
      else {
        m[k].open += 1;
        if (t.due_at && new Date(t.due_at).getTime() < now) m[k].overdue += 1;
      }
    });
    return Object.values(m).sort((a, b) => (b.open + b.done) - (a.open + a.done)).slice(0, 10);
  }, [tasks.data]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Reports" subtitle="Activity, pipeline, and revenue insights." />
        <Card className="p-10 text-center text-sm text-muted-foreground">Loading reports…</Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Reports" subtitle="Activity, pipeline, and revenue insights." />
      <Tabs defaultValue="activity">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="activity">Recruiting activity</TabsTrigger>
          <TabsTrigger value="pipeline">Job pipeline</TabsTrigger>
          <TabsTrigger value="funnel">Submission funnel</TabsTrigger>
          <TabsTrigger value="clients">Client performance</TabsTrigger>
          <TabsTrigger value="revenue">Placement & revenue</TabsTrigger>
          <TabsTrigger value="tasks">Task performance</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <ChartCard title="Activity by recruiter (last 30 days)">
            <BarChart data={activityByUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="activities" fill={COLORS[0]} />
              <Bar dataKey="submissions" fill={COLORS[1]} />
              <Bar dataKey="candidates" fill={COLORS[2]} />
            </BarChart>
          </ChartCard>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total jobs" value={jobs.data?.length ?? 0} />
            <Stat label="Active jobs" value={(jobs.data ?? []).filter((j) => ["Open", "Sourcing", "Interviewing", "Offer"].includes(j.status)).length} />
            <Stat label="Aging (21d+)" value={agingJobs} hint="Active jobs older than 3 weeks" />
            <Stat label="No submissions" value={jobsNoSubs} hint="Open jobs without a single submission" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Jobs by status">
              <BarChart data={jobsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS[0]}>
                  {jobsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ChartCard>
            <ChartCard title="Jobs by priority">
              <PieChart>
                <Pie data={jobsByPriority} dataKey="value" nameKey="name" outerRadius={90} label>
                  {jobsByPriority.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-5">
            {funnelData.map((f) => (
              <Stat key={f.name} label={f.name} value={f.value} />
            ))}
          </div>
          <ChartCard title="Submission funnel">
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="#111" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ChartCard>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ChartCard title="Top clients (submissions, placements, active jobs)">
            <BarChart data={clientPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" fontSize={11} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} fontSize={11} />
              <Tooltip />
              <Legend />
              <Bar dataKey="subs" fill={COLORS[0]} />
              <Bar dataKey="placements" fill={COLORS[1]} />
              <Bar dataKey="activeJobs" fill={COLORS[2]} />
            </BarChart>
          </ChartCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Total placements" value={pls.data?.length ?? 0} />
            <Stat label="Upcoming starts" value={upcomingStarts} />
            <Stat label="Projected revenue" value={`$${Math.round(totalRevenue).toLocaleString()}`} hint="Bill rate × 160 hr/mo" />
          </div>
          <ChartCard title="Placements & revenue over time">
            <LineChart data={placementMonths}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis yAxisId="left" fontSize={11} allowDecimals={false} />
              <YAxis yAxisId="right" orientation="right" fontSize={11} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="placements" stroke={COLORS[1]} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={COLORS[0]} strokeWidth={2} />
            </LineChart>
          </ChartCard>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Open" value={(tasks.data ?? []).filter((t) => t.status !== "Done").length} />
            <Stat label="Overdue" value={(tasks.data ?? []).filter((t) => t.status !== "Done" && t.due_at && new Date(t.due_at).getTime() < Date.now()).length} />
            <Stat label="Completed" value={(tasks.data ?? []).filter((t) => t.status === "Done").length} />
          </div>
          <ChartCard title="Tasks by owner">
            <BarChart data={tasksByUser}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" stackId="a" fill={COLORS[0]} />
              <Bar dataKey="overdue" stackId="a" fill={COLORS[3]} />
              <Bar dataKey="done" stackId="a" fill={COLORS[1]} />
            </BarChart>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}