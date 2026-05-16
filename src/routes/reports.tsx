import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { Card, PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/reports")({ component: Reports });
const reports = [
  { name: "Recruiting activity", desc: "Candidates added, calls, notes, submissions per recruiter." },
  { name: "Job pipeline", desc: "Active jobs by status, priority, aging jobs, jobs with no subs." },
  { name: "Submission funnel", desc: "Submitted → reviewed → interview → offer → placed." },
  { name: "Client performance", desc: "Active clients, subs per client, placements, projected revenue." },
  { name: "Placement & revenue", desc: "Placements, pay/bill, margin, upcoming starts." },
  { name: "Task performance", desc: "Tasks due, overdue, completion rate by user." },
];
function Reports() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Activity, pipeline, and revenue insights." />
      <div className="grid gap-4 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.name} className="p-5">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent"><BarChart3 className="h-4 w-4" /></div>
            <div className="text-sm font-semibold text-foreground">{r.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{r.desc}</div>
            <button className="mt-4 text-xs font-medium text-accent">Open report →</button>
          </Card>
        ))}
      </div>
    </div>
  );
}