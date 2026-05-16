import { createFileRoute } from "@tanstack/react-router";
import { Plus, Mail, Phone } from "lucide-react";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useContacts, type ContactRow } from "@/lib/queries";

export const Route = createFileRoute("/contacts")({ component: Contacts });

const columns: Column<ContactRow>[] = [
  {
    key: "name",
    header: "Name",
    render: (c) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="font-medium text-foreground">{c.name}</div>
          <div className="text-xs text-muted-foreground">{c.title ?? "—"}</div>
        </div>
      </div>
    ),
  },
  { key: "company", header: "Company", render: (c) => <span className="text-foreground">{c.company_name}</span> },
  { key: "role", header: "Role", render: (c) => <StatusBadge value={c.role ?? "—"} /> },
  {
    key: "contact",
    header: "Contact",
    render: (c) => (
      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email ?? "—"}</span>
        <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone ?? "—"}</span>
      </div>
    ),
  },
  { key: "status", header: "Status", render: (c) => <StatusBadge value={c.status} /> },
  { key: "owner", header: "Owner", render: (c) => <span className="text-muted-foreground">{c.owner_name}</span> },
];

function Contacts() {
  const { data = [], isLoading } = useContacts();
  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Hiring managers and client stakeholders."
        actions={
          <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New contact
          </button>
        }
      />
      <Card>
        <Toolbar>
          <FilterChip>All companies</FilterChip>
          <FilterChip>Decision makers</FilterChip>
          <FilterChip>All owners</FilterChip>
          <div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} contacts`}</div>
        </Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
