import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Building2 } from "lucide-react";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useCompanies, type CompanyRow } from "@/lib/queries";
import { useCreate } from "@/components/CreateDialog";

export const Route = createFileRoute("/companies")({ component: Companies });

const columns: Column<CompanyRow>[] = [
  {
    key: "name",
    header: "Company",
    render: (c) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Building2 className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium text-foreground">{c.name}</div>
          <div className="text-xs text-muted-foreground">{c.industry ?? "—"} • {c.location ?? "—"}</div>
        </div>
      </div>
    ),
  },
  { key: "status", header: "Status", render: (c) => <StatusBadge value={c.status} /> },
  { key: "tier", header: "Tier", render: (c) => <span className="text-foreground">{c.tier ?? "—"}</span> },
  { key: "jobs", header: "Active jobs", render: (c) => <span className="font-medium text-foreground">{c.active_jobs}</span> },
  { key: "subs", header: "Open subs", render: (c) => <span>{c.open_subs}</span> },
  { key: "owner", header: "Owner", render: (c) => <span className="text-muted-foreground">{c.owner_name}</span> },
];

function Companies() {
  const { data = [], isLoading } = useCompanies();
  const { open } = useCreate();
  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Clients, prospects, and target accounts."
        actions={
          <button onClick={() => open("company")} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New company
          </button>
        }
      />
      <Card>
        <Toolbar>
          <FilterChip><Filter className="h-3.5 w-3.5" /> All statuses</FilterChip>
          <FilterChip>All owners</FilterChip>
          <FilterChip>All industries</FilterChip>
          <div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} companies`}</div>
        </Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
