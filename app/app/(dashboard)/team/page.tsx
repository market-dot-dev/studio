import { getPendingInvites, getTeamMembers } from "@/app/services/team-management-service";
import { requireUserSession } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { InviteTeamMembersBtn } from "./invite-team-members-btn";

export default async function TeamPage() {
  const [teamMembers, pendingInvites, currentUser] = await Promise.all([
    getTeamMembers(),
    getPendingInvites(),
    requireUserSession()
  ]);

  const userRole = currentUser.currentUserRole;

  return (
    <div className="space-y-8">
      <PageHeader title="Team" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-normal">
            Team Members ({teamMembers.length + pendingInvites.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your organization's team members and their roles
          </p>
        </div>
        <InviteTeamMembersBtn />
      </div>

      <div className="space-y-6">
        {teamMembers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Active Members ({teamMembers.length})</h3>
            <DataTable columns={columns} data={teamMembers} meta={{ userRole }} />
          </div>
        )}

        {pendingInvites.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Pending Invitations ({pendingInvites.length})</h3>
            <DataTable columns={columns} data={pendingInvites} meta={{ userRole }} />
          </div>
        )}

        {teamMembers.length === 0 && pendingInvites.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No team members yet. Invite your first teammate to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
