import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { submissions } from "@/lib/sample-data";

export const Route = createFileRoute("/submissions")({ component: Submissions });
type S = (typeof submissions)[number];

const columns: Column<S>[] = [
  { key: "candidate", header: "Candidate", render: (s) => <span className="font-medium text-foreground">{s.candidate}</span> },
  { key: "job", header: "Job", render: (s) => (<div><div className="text-foreground">{s.job}</div><div className="text-xs text-muted-foreground">{s.company}</div></div>) },
  { key: "rate", header: "Rate", render: (s) => <span>{s.rate || "—"}</span> },
  { key: "by", header: "Submitted by", render: (s) => <span className="text-muted-foreground">{s.submittedBy}</span> },
  { key: "date", header: "Date", render: (s) => <span className="text-muted-foreground">{s.submittedAt}</span> },
  { key: "status", header: "Status", render: (s) => <StatusBadge value={s.status} /> },
  { key: "fb", header: "Feedback", render: (s) => <span className="line-clamp-1 text-xs text-muted-foreground">{s.feedback || "—"}</span> },
];

const funnel = [["Draft",4],["Submitted",18],["Client reviewed",11],["Interview requested",7],["Offer pending",3],["Placed",6]] as const;

function Submissions() {
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
        <Toolbar><FilterChip>All statuses</FilterChip><FilterChip>All clients</FilterChip><FilterChip>All recruiters</FilterChip><div className="ml-auto text-xs text-muted-foreground">{submissions.length} submissions</div></Toolbar>
        <DataTable columns={columns} rows={submissions} />
      </Card>
    </div>
  );
}