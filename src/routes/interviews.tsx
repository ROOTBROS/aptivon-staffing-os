import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useInterviews, type InterviewRow } from "@/lib/queries";

export const Route = createFileRoute("/interviews")({ component: Interviews });

function fmt(dt: string) {
  try { return new Date(dt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); } catch { return dt; }
}

const columns: Column<InterviewRow>[] = [
  { key: "when", header: "When", render: (i) => <span className="font-medium text-foreground">{fmt(i.scheduled_at)}</span> },
  { key: "candidate", header: "Candidate", render: (i) => <span>{i.candidate_name}</span> },
  { key: "job", header: "Job", render: (i) => (<div><div>{i.job_title}</div><div className="text-xs text-muted-foreground">{i.company_name}</div></div>) },
  { key: "contact", header: "Interviewer", render: (i) => <span className="text-muted-foreground">{i.contact_name}</span> },
  { key: "format", header: "Format", render: (i) => <StatusBadge value={i.format} /> },
  { key: "status", header: "Status", render: (i) => <StatusBadge value={i.status} /> },
  { key: "out", header: "Outcome", render: (i) => <span className="text-xs text-muted-foreground">{i.outcome || "—"}</span> },
];

function Interviews() {
  const { data = [], isLoading } = useInterviews();
  return (
    <div>
      <PageHeader title="Interviews" subtitle="Scheduled and completed interviews." />
      <Card>
        <Toolbar><FilterChip>Upcoming</FilterChip><FilterChip>Completed</FilterChip><div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} interviews`}</div></Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
