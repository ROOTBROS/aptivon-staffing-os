import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardHeader, PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useTeamMembers, type TeamMember } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({ component: Settings });

function Settings() {
  const { data: users = [], isLoading } = useTeamMembers();
  const { user, isAdmin } = useAuth();
  const qc = useQueryClient();

  async function changeRole(targetId: string, newRole: "admin" | "recruiter") {
    const { error } = await supabase.rpc("set_user_role", {
      target_user: targetId,
      new_role: newRole,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Role updated");
    qc.invalidateQueries({ queryKey: ["team-members"] });
    qc.invalidateQueries({ queryKey: ["profiles"] });
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle={isAdmin ? "You're an admin. Promote or demote teammates below." : "Team members and workspace info."}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Team members" />
          {isLoading ? (
            <div className="p-5 text-sm text-muted-foreground">Loading…</div>
          ) : (
            <ul className="divide-y divide-border">
              {users.map((u) => (
                <TeamRow
                  key={u.id}
                  member={u}
                  isSelf={u.id === user?.id}
                  canEdit={isAdmin && u.id !== user?.id}
                  onChange={(r) => changeRole(u.id, r)}
                />
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Coming soon" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {["AI candidate matching","AI submission packages","AI outreach drafting","Duplicate detection","Redeployment alerts","Client portal","Candidate portal","Resume parsing"].map((f) => (
              <div key={f} className="rounded-lg border border-dashed border-border bg-muted/30 p-3">
                <div className="text-sm font-medium text-foreground">{f}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function TeamRow({
  member,
  isSelf,
  canEdit,
  onChange,
}: {
  member: TeamMember;
  isSelf: boolean;
  canEdit: boolean;
  onChange: (role: "admin" | "recruiter") => void;
}) {
  const role = member.role ?? "recruiter";
  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {member.initials || member.full_name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {member.full_name}
          {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
        </div>
        <div className="text-xs text-muted-foreground capitalize">{role}</div>
      </div>
      {canEdit ? (
        <select
          value={role}
          onChange={(e) => onChange(e.target.value as "admin" | "recruiter")}
          className="h-8 rounded-md border border-input bg-card px-2 text-xs"
        >
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
      ) : (
        <StatusBadge value={role === "admin" ? "Admin" : "Recruiter"} />
      )}
    </li>
  );
}
