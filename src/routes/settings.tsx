import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useProfiles } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const { data: users = [], isLoading } = useProfiles();
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Team, statuses, and system preferences." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Team members" />
          {isLoading ? <div className="p-5 text-sm text-muted-foreground">Loading…</div> : (
            <ul className="divide-y divide-border">
              {users.map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{u.initials || u.full_name.slice(0, 2).toUpperCase()}</div>
                  <div className="flex-1"><div className="text-sm font-medium text-foreground">{u.full_name}{u.id === user?.id && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}</div><div className="text-xs text-muted-foreground">{u.role_label}</div></div>
                  <StatusBadge value="Active" />
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Coming soon" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {["AI candidate matching","AI submission packages","AI outreach drafting","Duplicate detection","Redeployment alerts","Client portal","Candidate portal","Resume parsing"].map((f) => (
              <div key={f} className="rounded-lg border border-dashed border-border bg-muted/30 p-3"><div className="text-sm font-medium text-foreground">{f}</div></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
