import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { interviews } from "@/lib/sample-data";

export const Route = createFileRoute("/interviews")({ component: Interviews });
type I = (typeof interviews)[number];
const columns: Column<I>[] = [
  { key: "when", header: "When", render: (i) => <span className="font-medium text-foreground">{i.datetime}</span> },
  { key: "candidate", header: "Candidate", render: (i) => <span>{i.candidate}</span> },
  { key: "job", header: "Job", render: (i) => (<div><div>{i.job}</div><div className="text-xs text-muted-foreground">{i.company}</div></div>) },
  { key: "contact", header: "Interviewer", render: (i) => <span className="text-muted-foreground">{i.contact}</span> },
  { key: "format", header: "Format", render: (i) => <StatusBadge value={i.format} /> },
  { key: "status", header: "Status", render: (i) => <StatusBadge value={i.status} /> },
  { key: "out", header: "Outcome", render: (i) => <span className="text-xs text-muted-foreground">{i.outcome || "—"}</span> },
];
function Interviews() {
  return (
    <div>
      <PageHeader title="Interviews" subtitle="Scheduled and completed interviews." />
      <Card>
        <Toolbar><FilterChip>Upcoming</FilterChip><FilterChip>Completed</FilterChip><div className="ml-auto text-xs text-muted-foreground">{interviews.length} interviews</div></Toolbar>
        <DataTable columns={columns} rows={interviews} />
      </Card>
    </div>
  );
}