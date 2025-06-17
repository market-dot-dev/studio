import { getPendingInvites } from "@/app/services/team-management-service";
import { TeamMemberInviteFormClient } from "./team-member-invite-form-client";

export async function TeamMemberInviteForm() {
  const initialInvites = await getPendingInvites();

  return <TeamMemberInviteFormClient initialInvites={initialInvites} />;
}
