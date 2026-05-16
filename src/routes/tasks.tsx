import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/PageHeader";
import { Column, DataTable, FilterChip, Toolbar } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { useTasks, dateUtils, type TaskRow } from "@/lib/queries";

export const Route = createFileRoute("/tasks")({ component: Tasks });

const columns: Column<TaskRow>[] = [
  { key: "title", header: "Task", render: (t) => (<div className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-4 w-4 rounded border-border accent-[oklch(0.5_0.18_240)]" /><div><div className="font-medium text-foreground">{t.title}</div><div className="text-xs text-muted-foreground">{t.related_label ?? "—"}</div></div></div>) },
  { key: "owner", header: "Owner", render: (t) => <span className="text-muted-foreground">{t.owner_name}</span> },
  { key: "due", header: "Due", render: (t) => <span>{dateUtils.fmtDate(t.due_at)}</span> },
  { key: "priority", header: "Priority", render: (t) => <StatusBadge value={t.priority} /> },
  { key: "status", header: "Status", render: (t) => <StatusBadge value={t.status} /> },
];

function Tasks() {
  const { data = [], isLoading } = useTasks();
  return (
    <div>
      <PageHeader title="Tasks" subtitle="Follow-ups, reminders, and overdue work." />
      <Card>
        <Toolbar><FilterChip>Today</FilterChip><FilterChip>Overdue</FilterChip><FilterChip>Upcoming</FilterChip><div className="ml-auto text-xs text-muted-foreground">{isLoading ? "Loading…" : `${data.length} tasks`}</div></Toolbar>
        <DataTable columns={columns} rows={data} />
      </Card>
    </div>
  );
}
