import { getPendingInvites } from "@/app/services/organization/team-management-service";
import { TeamMemberInviteForm } from "./team-member-invite-form";

export async function TeamMemberInviteFormWrapper() {
  const initialInvites = await getPendingInvites();

  return <TeamMemberInviteForm initialInvites={initialInvites} />;
}
