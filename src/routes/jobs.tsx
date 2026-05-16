import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Users } from "lucide-react";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { jobs } from "@/lib/sample-data";

export const Route = createFileRoute("/jobs")({ component: Jobs });

type J = (typeof jobs)[number];

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px]">
      <span className="font-semibold text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

const columns: Column<J>[] = [
  {
    key: "title",
    header: "Job",
    render: (j) => (
      <div>
        <div className="font-medium text-foreground">{j.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{j.company}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
        </div>
      </div>
    ),
  },
  { key: "status", header: "Status", render: (j) => <StatusBadge value={j.status} /> },
  { key: "priority", header: "Priority", render: (j) => <StatusBadge value={j.priority} /> },
  {
    key: "pipeline",
    header: "Pipeline",
    render: (j) => (
      <div className="flex items-center gap-2 text-xs">
        <Pill label="Sub" value={j.submitted} />
        <Pill label="Int" value={j.interviewing} />
        <Pill label="Off" value={j.offers} />
      </div>
    ),
  },
  { key: "openings", header: "Openings", render: (j) => (
    <span className="inline-flex items-center gap-1 text-foreground"><Users className="h-3 w-3" /> {j.openings}</span>
  )},
  { key: "rate", header: "Pay / Bill", render: (j) => (
    <div className="text-xs">
      <div className="text-foreground">{j.payRate}</div>
      <div className="text-muted-foreground">{j.billRate}</div>
    </div>
  )},
  { key: "owner", header: "Recruiter", render: (j) => <span className="text-muted-foreground">{j.recruiter}</span> },
  { key: "age", header: "Age", render: (j) => <span className="text-muted-foreground">{j.age}d</span> },
];

const stages = ["Sourced", "Screened", "Submitted", "Interview", "Offer", "Placed"];
const counts = [42, 28, 19, 11, 4, 6];

function Jobs() {
  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Active job orders and pipelines."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New job order
          </button>
        }
      />
      <Card className="mb-4">
        <CardHeader title="Pipeline snapshot" />
        <div className="grid grid-cols-3 gap-2 p-5 sm:grid-cols-6">
          {stages.map((s, i) => (
            <div key={s} className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="text-xs text-muted-foreground">{s}</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{counts[i]}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Toolbar>
          <FilterChip>All statuses</FilterChip>
          <FilterChip>All priorities</FilterChip>
          <FilterChip>All owners</FilterChip>
          <FilterChip>All clients</FilterChip>
          <div className="ml-auto text-xs text-muted-foreground">{jobs.length} jobs</div>
        </Toolbar>
        <DataTable columns={columns} rows={jobs} />
      </Card>
    </div>
  );
}