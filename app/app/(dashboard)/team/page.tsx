import {
  getPendingInvites,
  getTeamMembers
} from "@/app/services/organization/team-management-service";
import { requireUserSession } from "@/app/services/user-context-service";
import PageHeader from "@/components/common/page-header";
import { TeamMemberInviteForm } from "@/components/team/team-member-invite-form";
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
      <PageHeader
        title="Team"
        actions={
          <InviteTeamMembersBtn>
            <TeamMemberInviteForm />
          </InviteTeamMembersBtn>
        }
      />

      {teamMembers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Active Members</h3>
          <DataTable columns={columns} data={teamMembers} meta={{ userRole }} />
        </div>
      )}

      {pendingInvites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Pending Invitations</h3>
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
  );
}
