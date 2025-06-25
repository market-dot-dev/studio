"use server";

import { OrganizationRole } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";
import {
  InviteResult,
  InviteWithDetails,
  TeamMemberDisplay,
  includeInviteDetails,
  includeTeamMember
} from "@/types/team";
import { revalidatePath } from "next/cache";
import { sendTeamInvitationEmail } from "../email-service";
import { requireOrganization, requireUser } from "../user-context-service";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Team management operations for organizations
 * Enforces single owner constraint and provides transfer ownership functionality
 */

/**
 * Get all team members for the current organization
 */
export async function getTeamMembers(): Promise<TeamMemberDisplay[]> {
  const org = await requireOrganization();

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: org.id },
    ...includeTeamMember,
    orderBy: { createdAt: "asc" }
  });

  return members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    email: member.user.email!,
    role: member.role,
    invitePending: false,
    createdAt: member.createdAt
  }));
}

/**
 * Get pending invitations for the current organization
 */
export async function getPendingInvites(): Promise<TeamMemberDisplay[]> {
  const org = await requireOrganization();

  const invites = await prisma.organizationInvite.findMany({
    where: {
      organizationId: org.id,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" }
  });

  return invites.map((invite) => ({
    id: invite.id,
    name: null,
    email: invite.email,
    role: invite.role,
    invitePending: true,
    createdAt: invite.createdAt
  }));
}

/**
 * Invite users to the organization
 */
export async function inviteUsersToOrganizationByRole(
  emails: string[],
  role: OrganizationRole = OrganizationRole.MEMBER
): Promise<InviteResult> {
  const org = await requireOrganization();
  const user = await requireUser();

  // Only owners can invite new owners
  if (role === OrganizationRole.OWNER) {
    const currentUserMembership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId: user.id
        }
      }
    });

    if (currentUserMembership?.role !== OrganizationRole.OWNER) {
      throw new Error("Only owners can invite new owners");
    }
  }

  const result: InviteResult = {
    success: [],
    errors: [],
    newInvites: []
  };

  for (const email of emails) {
    try {
      // Check if user is already a member
      const existingMember = await prisma.organizationMember.findFirst({
        where: {
          organizationId: org.id,
          user: { email }
        }
      });

      if (existingMember) {
        result.errors.push(`${email} is already a member`);
        continue;
      }

      // Check if there's already a pending invite
      const existingInvite = await prisma.organizationInvite.findFirst({
        where: {
          organizationId: org.id,
          email,
          expiresAt: { gt: new Date() }
        }
      });

      if (existingInvite) {
        result.errors.push(`${email} already has a pending invitation`);
        continue;
      }

      // Create invitation
      const invite = await prisma.organizationInvite.create({
        data: {
          id: generateId(),
          organizationId: org.id,
          email,
          role,
          invitedBy: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      // Send invitation email
      await sendTeamInvitationEmail(email, org.name, user.name || user.email!, invite.id);

      result.success.push(email);
      result.newInvites.push(invite);
    } catch (error) {
      console.error(`Error inviting ${email}:`, error);
      result.errors.push(`Failed to invite ${email}`);
    }
  }

  revalidatePath("/team", "layout");
  revalidatePath("/onboarding/team", "layout");

  return result;
}

/**
 * Invite batch of team members with different roles.
 */
export async function inviteTeamMembers(
  invites: { email: string; role: OrganizationRole }[]
): Promise<InviteResult> {
  const result: InviteResult = {
    success: [],
    errors: [],
    newInvites: []
  };

  const validInvites: typeof invites = [];
  for (const invite of invites) {
    if (!isValidEmail(invite.email)) {
      result.errors.push(`Invalid email address: ${invite.email}`);
    } else {
      validInvites.push(invite);
    }
  }

  if (validInvites.length === 0) {
    return result;
  }

  const memberEmails = validInvites
    .filter((i) => i.role === OrganizationRole.MEMBER)
    .map((i) => i.email);
  const adminEmails = validInvites
    .filter((i) => i.role === OrganizationRole.ADMIN)
    .map((i) => i.email);

  if (memberEmails.length > 0) {
    const memberResult = await inviteUsersToOrganizationByRole(
      memberEmails,
      OrganizationRole.MEMBER
    );
    result.success.push(...memberResult.success);
    result.errors.push(...memberResult.errors);
    result.newInvites.push(...memberResult.newInvites);
  }

  if (adminEmails.length > 0) {
    const adminResult = await inviteUsersToOrganizationByRole(adminEmails, OrganizationRole.ADMIN);
    result.success.push(...adminResult.success);
    result.errors.push(...adminResult.errors);
    result.newInvites.push(...adminResult.newInvites);
  }

  return result;
}

/**
 * Change a team member's role
 * Prevents removing the single owner
 */
export async function changeTeamMemberRole(
  memberId: string,
  newRole: OrganizationRole
): Promise<void> {
  const org = await requireOrganization();
  const currentUser = await requireUser();

  // Get current user's role to check permissions
  const currentUserMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: currentUser.id
      }
    }
  });

  if (!currentUserMembership || currentUserMembership.role !== OrganizationRole.OWNER) {
    throw new Error("Only owners can change member roles");
  }

  // Check if the member exists
  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: memberId
      }
    }
  });

  if (!member) {
    throw new Error("Team member not found");
  }

  // Prevent changing the owner's role to non-owner (since we only allow one owner)
  if (member.role === OrganizationRole.OWNER && newRole !== OrganizationRole.OWNER) {
    throw new Error("Cannot change the owner's role. Use transfer ownership instead.");
  }

  // Don't allow promoting multiple people to owner
  if (newRole === OrganizationRole.OWNER && member.role !== OrganizationRole.OWNER) {
    throw new Error("Cannot promote to owner. Use transfer ownership instead.");
  }

  await prisma.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: memberId
      }
    },
    data: { role: newRole }
  });
}

/**
 * Transfer ownership to another team member
 * This demotes the current owner to admin and promotes the target user to owner
 */
export async function transferOwnership(newOwnerId: string): Promise<void> {
  const org = await requireOrganization();
  const currentUser = await requireUser();

  // Verify current user is the owner
  const currentOwnerMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: currentUser.id
      }
    }
  });

  if (!currentOwnerMembership || currentOwnerMembership.role !== OrganizationRole.OWNER) {
    throw new Error("Only the owner can transfer ownership");
  }

  // Verify target user is a member
  const targetMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: newOwnerId
      }
    }
  });

  if (!targetMembership) {
    throw new Error("Target user is not a member of this organization");
  }

  if (targetMembership.userId === currentUser.id) {
    throw new Error("You are already the owner");
  }

  // Use a transaction to ensure atomicity
  await prisma.$transaction([
    // Demote current owner to admin
    prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId: currentUser.id
        }
      },
      data: { role: OrganizationRole.ADMIN }
    }),
    // Promote target user to owner
    prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId: newOwnerId
        }
      },
      data: { role: OrganizationRole.OWNER }
    }),
    // Update organization owner
    prisma.organization.update({
      where: { id: org.id },
      data: { ownerId: newOwnerId }
    })
  ]);
}

/**
 * Remove a team member from the organization
 * Prevents removing the owner
 */
export async function removeTeamMember(memberId: string): Promise<void> {
  const org = await requireOrganization();
  const currentUser = await requireUser();

  // Get current user's role to check permissions
  const currentUserMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: currentUser.id
      }
    }
  });

  if (
    !currentUserMembership ||
    (currentUserMembership.role !== OrganizationRole.OWNER &&
      currentUserMembership.role !== OrganizationRole.ADMIN)
  ) {
    throw new Error("Only owners and admins can remove team members");
  }

  const member = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: memberId
      }
    }
  });

  if (!member) {
    throw new Error("Team member not found");
  }

  // Prevent removing the owner
  if (member.role === OrganizationRole.OWNER) {
    throw new Error("Cannot remove the owner. Transfer ownership first.");
  }

  // Prevent non-owners from removing admins
  if (
    member.role === OrganizationRole.ADMIN &&
    currentUserMembership.role !== OrganizationRole.OWNER
  ) {
    throw new Error("Only owners can remove admins");
  }

  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: memberId
      }
    }
  });
}

/**
 * Cancel a pending invitation
 */
export async function cancelInvitation(inviteId: string): Promise<void> {
  const org = await requireOrganization();

  await prisma.organizationInvite.delete({
    where: {
      id: inviteId,
      organizationId: org.id
    }
  });
}

/**
 * Get invitation details by invite ID (for join page)
 */
export async function getInvitationDetails(inviteId: string): Promise<InviteWithDetails | null> {
  try {
    const invite = await prisma.organizationInvite.findUnique({
      where: { id: inviteId },
      ...includeInviteDetails
    });

    if (!invite || invite.expiresAt < new Date()) {
      return null;
    }

    return invite;
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return null;
  }
}

/**
 * Accept an invitation (used in join page)
 */
export async function acceptInvitation(inviteId: string, userId: string): Promise<void> {
  const invite = await prisma.organizationInvite.findUnique({
    where: { id: inviteId }
  });

  if (!invite || invite.expiresAt < new Date()) {
    throw new Error("Invalid or expired invitation");
  }

  // Check if user email matches invite
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || user.email !== invite.email) {
    throw new Error("Email does not match invitation");
  }

  // Check if user is already a member
  const existingMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: invite.organizationId,
        userId: userId
      }
    }
  });

  if (existingMembership) {
    // Delete the invitation since they're already a member
    await prisma.organizationInvite.delete({
      where: { id: inviteId }
    });
    return;
  }

  // Use transaction to add user and delete invitation
  await prisma.$transaction([
    prisma.organizationMember.create({
      data: {
        organizationId: invite.organizationId,
        userId: userId,
        role: invite.role
      }
    }),
    prisma.organizationInvite.delete({
      where: { id: inviteId }
    })
  ]);
}
