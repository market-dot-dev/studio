"use client"; // Team page needs client-side interaction for modals/actions

import { columns, TeamMember } from "@/app/app/(dashboard)/team/columns";
import { EditRoleModal } from "@/app/components/team/edit-role-modal";
import { InviteModal } from "@/app/components/team/invite-modal";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { UserRoundPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Placeholder data - replace with actual data fetching later
const teamMembersData: TeamMember[] = [
  {
    id: "usr_1",
    name: "Alice Wonderland",
    email: "alice@example.com",
    status: "Admin",
    invitePending: false
  },
  {
    id: "usr_2",
    name: "Bob The Builder",
    email: "bob@example.com",
    status: "Collaborator",
    invitePending: false
  },
  {
    id: "usr_3",
    name: null,
    email: "charlie@invited.com",
    status: "Collaborator",
    invitePending: true
  }
];

export default function TeamPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Split data into teammates and invited members
  const { teammates, invitedMembers } = useMemo(() => {
    const teammates = teamMembersData.filter((member) => !member.invitePending);
    const invitedMembers = teamMembersData.filter((member) => member.invitePending);
    return { teammates, invitedMembers };
  }, []);

  // Placeholder handlers - replace with actual logic later
  const handleInvite = (emails: string[]) => {
    console.log("Inviting emails:", emails);
    alert(`Placeholder: Inviting ${emails.join(", ")}`);
    // TODO: Implement actual invite API call
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleSaveStatus = (memberId: string, newStatus: "Admin" | "Collaborator") => {
    const member = teamMembersData.find((m) => m.id === memberId);
    const memberName = member?.name || member?.email || "User";

    console.log(`Saving status for ${memberId}: ${newStatus}`);
    alert(`Placeholder: Saving status for ${memberId} to ${newStatus}`);
    // TODO: Implement actual status update API call
    // TODO: Update local state or refetch data
    setSelectedMember(null);

    toast.success(`${memberName} is now ${newStatus === "Admin" ? "an Admin" : "a Collaborator"}`);
  };

  const handleRemoveOrUninvite = (member: TeamMember) => {
    const action = member.invitePending ? "Uninvite" : "Remove";
    console.log(`${action} member:`, member);
    alert(`Placeholder: ${action} ${member.email}?`);
    // TODO: Implement actual remove/uninvite API call
    // TODO: Update local state or refetch data
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Team"
        actions={[
          <Button key="invite" variant="outline" onClick={() => setIsInviteModalOpen(true)}>
            <UserRoundPlus />
            Invite Teammates
          </Button>
        ]}
      />

      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-normal">Teammates</h2>
        <DataTable
          columns={columns} // Pass handlers via meta
          data={teammates}
          meta={{
            openEditModal: handleOpenEditModal,
            removeOrUninvite: handleRemoveOrUninvite
          }}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-normal">Invited</h2>
        <DataTable
          columns={columns} // Pass handlers via meta
          data={invitedMembers}
          meta={{
            openEditModal: handleOpenEditModal,
            removeOrUninvite: handleRemoveOrUninvite
          }}
        />
      </div>

      {/* Modals */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInvite={handleInvite}
      />
      <EditRoleModal
        member={selectedMember}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
