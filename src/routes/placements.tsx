import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { usePlacements, dateUtils, type PlacementRow } from "@/lib/queries";

export const Route = createFileRoute("/placements")({ component: Placements });

const columns: Column<PlacementRow>[] = [
  { key: "candidate", header: "Candidate", render: (p) => <span className="font-medium text-foreground">{p.candidate_name}</span> },
  { key: "job", header: "Job", render: (p) => (<div><div>{p.job_title}</div><div className="text-xs text-muted-foreground">{p.company_name}</div></div>) },
  { key: "type", header: "Type", render: (p) => <StatusBadge value={p.type} /> },
  { key: "start", header: "Start", render: (p) => <span>{dateUtils.fmtDate(p.start_date)}</span> },
  { key: "end", header: "End", render: (p) => <span className="text-muted-foreground">{dateUtils.fmtDate(p.end_date)}</span> },
  { key: "rates", header: "Pay / Bill", render: (p) => (<div className="text-xs"><div>{p.pay_rate ?? "—"}</div><div className="text-muted-foreground">{p.bill_rate ?? "—"}</div></div>) },
  { key: "margin", header: "Margin", render: (p) => <span className="font-medium">{p.margin ?? "—"}</span> },
  { key: "status", header: "Status", render: (p) => <StatusBadge value={p.status} /> },
  { key: "owner", header: "Owner", render: (p) => <span className="text-muted-foreground">{p.owner_name}</span> },
];

function Placements() {
  const { data = [], isLoading } = usePlacements();
  return (
    <div>
      <PageHeader title="Placements" subtitle="Active assignments and revenue." />
      <Card>
        <Toolbar><FilterChip>All statuses</FilterChip><FilterChip>All clients</FilterChip><div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} placements`}</div></Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
