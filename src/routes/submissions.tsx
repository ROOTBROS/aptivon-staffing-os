import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useSubmissions, dateUtils, type SubmissionRow } from "@/lib/queries";

export const Route = createFileRoute("/submissions")({ component: Submissions });

const columns: Column<SubmissionRow>[] = [
  { key: "candidate", header: "Candidate", render: (s) => <span className="font-medium text-foreground">{s.candidate_name}</span> },
  { key: "job", header: "Job", render: (s) => (<div><div className="text-foreground">{s.job_title}</div><div className="text-xs text-muted-foreground">{s.company_name}</div></div>) },
  { key: "rate", header: "Rate", render: (s) => <span>{s.rate ?? "—"}</span> },
  { key: "by", header: "Submitted by", render: (s) => <span className="text-muted-foreground">{s.submitted_by_name}</span> },
  { key: "date", header: "Date", render: (s) => <span className="text-muted-foreground">{dateUtils.fmtDate(s.submitted_at)}</span> },
  { key: "status", header: "Status", render: (s) => <StatusBadge value={s.status} /> },
  { key: "fb", header: "Feedback", render: (s) => <span className="line-clamp-1 text-xs text-muted-foreground">{s.feedback ?? "—"}</span> },
];

const funnelStages = ["Draft", "Submitted", "Client reviewed", "Interview requested", "Offer pending", "Placed"] as const;

function Submissions() {
  const { data = [], isLoading } = useSubmissions();
  const funnel = funnelStages.map((s) => [s, data.filter((r) => r.status === s).length] as const);
  return (
    <div>
      <PageHeader title="Submissions" subtitle="Every candidate presented to a client." actions={<button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New submission</button>} />
      <Card className="mb-4">
        <CardHeader title="Submission funnel" />
        <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-6">
          {funnel.map(([s, n]) => (<div key={s} className="rounded-lg border border-border bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{s}</div><div className="mt-1 text-2xl font-semibold text-foreground">{n}</div></div>))}
        </div>
      </Card>
      <Card>
        <Toolbar><FilterChip>All statuses</FilterChip><FilterChip>All clients</FilterChip><FilterChip>All recruiters</FilterChip><div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} submissions`}</div></Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
