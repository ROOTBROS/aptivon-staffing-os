import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin } from "lucide-react";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useCandidates, dateUtils, type CandidateRow } from "@/lib/queries";

export const Route = createFileRoute("/candidates")({ component: Candidates });

const columns: Column<CandidateRow>[] = [
  {
    key: "name",
    header: "Candidate",
    render: (k) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
          {k.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="font-medium text-foreground">{k.name}</div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{k.title ?? "—"}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {k.location ?? "—"}</span>
          </div>
        </div>
      </div>
    ),
  },
  { key: "status", header: "Status", render: (k) => <StatusBadge value={k.status} /> },
  {
    key: "skills",
    header: "Top skills",
    render: (k) => (
      <div className="flex flex-wrap gap-1">
        {k.skills.slice(0, 3).map((s) => (
          <span key={s} className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-foreground">{s}</span>
        ))}
      </div>
    ),
  },
  { key: "yr", header: "Yrs", render: (k) => <span className="text-foreground">{k.years ?? "—"}</span> },
  { key: "avail", header: "Available", render: (k) => <span className="text-muted-foreground">{k.availability ?? "—"}</span> },
  { key: "pay", header: "Desired", render: (k) => <span className="text-foreground">{k.desired_pay ?? "—"}</span> },
  { key: "src", header: "Source", render: (k) => <span className="text-muted-foreground">{k.source ?? "—"}</span> },
  { key: "owner", header: "Owner", render: (k) => <span className="text-muted-foreground">{k.owner_name}</span> },
];

function Candidates() {
  const { data = [], isLoading } = useCandidates();
  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle="Your active talent database."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Add candidate
          </button>
        }
      />
      <Card>
        <Toolbar>
          <FilterChip>All statuses</FilterChip>
          <FilterChip>Available now</FilterChip>
          <FilterChip>Skills</FilterChip>
          <FilterChip>Location</FilterChip>
          <FilterChip>Owners</FilterChip>
          <div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} candidates`}</div>
        </Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
