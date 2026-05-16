import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { placements } from "@/lib/sample-data";

export const Route = createFileRoute("/placements")({ component: Placements });
type P = (typeof placements)[number];
const columns: Column<P>[] = [
  { key: "candidate", header: "Candidate", render: (p) => <span className="font-medium text-foreground">{p.candidate}</span> },
  { key: "job", header: "Job", render: (p) => (<div><div>{p.job}</div><div className="text-xs text-muted-foreground">{p.company}</div></div>) },
  { key: "type", header: "Type", render: (p) => <StatusBadge value={p.type} /> },
  { key: "start", header: "Start", render: (p) => <span>{p.startDate}</span> },
  { key: "end", header: "End", render: (p) => <span className="text-muted-foreground">{p.endDate}</span> },
  { key: "rates", header: "Pay / Bill", render: (p) => (<div className="text-xs"><div>{p.payRate}</div><div className="text-muted-foreground">{p.billRate}</div></div>) },
  { key: "margin", header: "Margin", render: (p) => <span className="font-medium">{p.margin}</span> },
  { key: "status", header: "Status", render: (p) => <StatusBadge value={p.status} /> },
  { key: "owner", header: "Owner", render: (p) => <span className="text-muted-foreground">{p.owner}</span> },
];
function Placements() {
  return (
    <div>
      <PageHeader title="Placements" subtitle="Active assignments and revenue." />
      <Card>
        <Toolbar><FilterChip>All statuses</FilterChip><FilterChip>All clients</FilterChip><div className="ml-auto text-xs text-muted-foreground">{placements.length} placements</div></Toolbar>
        <DataTable columns={columns} rows={placements} />
      </Card>
    </div>
  );
}