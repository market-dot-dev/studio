"use server";

import prisma from "@/lib/prisma";
import { Prospect, ProspectState } from "../../generated/prisma";
import Tier from "../../models/Tier";
import { notifyOwnerOfNewProspect } from "../email-service";
import { getOrganizationById } from "../organization/organization-service";

/**
 * Get all prospects for an Organization
 */
type ProspectQueryOptions = {
  /**
   * Convenience property to filter by a single state.
   * Ignored when `states` is provided.
   */
  state?: ProspectState;
  /**
   * Filter prospects by multiple states.
   */
  states?: ProspectState[];
};

type ProspectWithTier = Prospect & { tier: Tier | null };

const DEFAULT_PROSPECT_STATES = [ProspectState.ACTIVE];

export async function getProspects(
  orgId: string,
  options: ProspectQueryOptions = {}
): Promise<ProspectWithTier[]> {
  if (!orgId) {
    console.warn("getProspects called without valid orgId");
    return [];
  }

  const resolvedStates =
    options.states && options.states.length > 0
      ? options.states
      : options.state
        ? [options.state]
        : DEFAULT_PROSPECT_STATES;

  const prospects = await prisma.prospect.findMany({
    where: {
      organizationId: orgId,
      ...(resolvedStates ? { state: { in: resolvedStates } } : {})
    },
    include: { tiers: true },
    orderBy: { createdAt: "desc" }
  });

  return prospects.map((prospect) => ({
    ...prospect,
    tier: prospect.tiers[0] ?? null
  }));
}

/**
 * Add a new prospect for a package/tier
 */
export async function addNewProspectForPackage(
  prospect: {
    email: Prospect["email"];
    name: Prospect["name"];
    companyName: Prospect["companyName"];
    context: Prospect["context"];
  },
  tier: Tier
): Promise<Prospect> {
  const org = await getOrganizationById(tier.organizationId);
  if (!org) {
    throw new Error("Organization not found");
  }

  const newProspect = await prisma.prospect.upsert({
    where: {
      email_organizationId: {
        email: prospect.email,
        organizationId: tier.organizationId
      }
    },
    create: {
      ...prospect,
      organizationId: tier.organizationId,
      state: ProspectState.ACTIVE,
      tiers: { connect: [{ id: tier.id }] }
    },
    update: {
      ...prospect,
      organizationId: tier.organizationId,
      state: ProspectState.ACTIVE,
      tiers: { connect: [{ id: tier.id }] }
    }
  });

  if (org.owner.email && org.owner.name) {
    await notifyOwnerOfNewProspect(
      org.owner,
      { email: newProspect.email, name: newProspect.name },
      tier.name
    );
  }

  return newProspect;
}

type UpdateProspectStateParams = {
  orgId: string;
  prospectId: string;
  state: ProspectState;
};

/**
 * Update the state of a prospect within an organization.
 * Throws when the prospect does not exist or belongs to another organization.
 */
export async function updateProspectState({
  orgId,
  prospectId,
  state
}: UpdateProspectStateParams): Promise<Prospect> {
  if (!orgId || !prospectId) {
    throw new Error("Invalid prospect or organization identifier provided");
  }

  const existing = await prisma.prospect.findFirst({
    where: {
      id: prospectId,
      organizationId: orgId
    },
    select: {
      id: true
    }
  });

  if (!existing) {
    throw new Error("Prospect not found for organization");
  }

  return prisma.prospect.update({
    where: {
      id: prospectId
    },
    data: {
      state
    }
  });
}

/**
 * Archive a prospect by setting its state to ARCHIVED.
 */
export async function archiveProspect(orgId: string, prospectId: string): Promise<Prospect> {
  return updateProspectState({
    orgId,
    prospectId,
    state: ProspectState.ARCHIVED
  });
}

export type { ProspectQueryOptions, ProspectWithTier };
