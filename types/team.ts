import { OrganizationRole, Prisma } from "@/app/generated/prisma";

// Use Prisma types for actual team members
export const includeTeamMember = Prisma.validator<Prisma.OrganizationMemberDefaultArgs>()({
  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true
      }
    }
  }
});

export type TeamMemberWithUser = Prisma.OrganizationMemberGetPayload<typeof includeTeamMember>;

// Use Prisma types for pending invites
export const includeInviteDetails = Prisma.validator<Prisma.OrganizationInviteDefaultArgs>()({
  include: {
    organization: {
      select: {
        name: true
      }
    },
    inviter: {
      select: {
        name: true,
        email: true
      }
    }
  }
});

export type InviteWithDetails = Prisma.OrganizationInviteGetPayload<typeof includeInviteDetails>;

// Simple result types
export interface InviteResult {
  success: string[];
  errors: string[];
}

// Unified type for table display (combines real members and pending invites)
export type TeamMemberDisplay = {
  id: string;
  name: string | null;
  email: string;
  role: OrganizationRole;
  invitePending: boolean;
  createdAt: Date;
};
