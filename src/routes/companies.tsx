import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Building2 } from "lucide-react";
import { Card } from "@/components/PageHeader";
import { PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { companies } from "@/lib/sample-data";

export const Route = createFileRoute("/companies")({ component: Companies });

type Co = (typeof companies)[number];

const columns: Column<Co>[] = [
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
          <div className="text-xs text-muted-foreground">{c.industry} • {c.location}</div>
        </div>
      </div>
    ),
  },
  { key: "status", header: "Status", render: (c) => <StatusBadge value={c.status} /> },
  { key: "tier", header: "Tier", render: (c) => <span className="text-foreground">{c.tier}</span> },
  { key: "jobs", header: "Active jobs", render: (c) => <span className="font-medium text-foreground">{c.activeJobs}</span> },
  { key: "subs", header: "Open subs", render: (c) => <span>{c.openSubs}</span> },
  { key: "owner", header: "Owner", render: (c) => <span className="text-muted-foreground">{c.owner}</span> },
  { key: "last", header: "Last contact", render: (c) => <span className="text-muted-foreground">{c.lastContact}</span> },
];

function Companies() {
  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Clients, prospects, and target accounts."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New company
          </button>
        }
      />
      <Card>
        <Toolbar>
          <FilterChip><Filter className="h-3.5 w-3.5" /> All statuses</FilterChip>
          <FilterChip>All owners</FilterChip>
          <FilterChip>All industries</FilterChip>
          <div className="ml-auto text-xs text-muted-foreground">{companies.length} companies</div>
        </Toolbar>
        <DataTable columns={columns} rows={companies} />
      </Card>
    </div>
  );
}