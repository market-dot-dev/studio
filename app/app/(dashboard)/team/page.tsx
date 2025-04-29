"use client"; // Team page needs client-side interaction for modals/actions

import { columns, TeamMember } from "@/app/app/(dashboard)/team/columns"; // Use aliased path
import { EditStatusModal } from "@/app/components/team/edit-status-modal"; // Import EditStatusModal
import { InviteModal } from "@/app/components/team/invite-modal"; // Import InviteModal
import PageHeader from "@/components/common/page-header"; // Import PageHeader
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Send } from "lucide-react";
import { useState } from "react"; // Import useState

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
    console.log(`Saving status for ${memberId}: ${newStatus}`);
    alert(`Placeholder: Saving status for ${memberId} to ${newStatus}`);
    // TODO: Implement actual status update API call
    // TODO: Update local state or refetch data
    setSelectedMember(null);
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
          <Button key="invite" onClick={() => setIsInviteModalOpen(true)}>
            <Send />
            Invite Teammates
          </Button>
        ]}
      />
      <DataTable
        columns={columns} // Pass handlers via meta
        data={teamMembersData}
        meta={{
          openEditModal: handleOpenEditModal,
          removeOrUninvite: handleRemoveOrUninvite
        }}
      />

      {/* Modals */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onInvite={handleInvite}
      />
      <EditStatusModal
        member={selectedMember}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
