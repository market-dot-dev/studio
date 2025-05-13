"use server";

import prisma from "@/lib/prisma";
import { Lead, LeadSource, Tier } from "@prisma/client";
import SessionService from "./session-service";

export type ResearchLeadWithTiers = Lead & { tiers: Tier[] };

export type FiltersState = {
  country_code: string;
  state: string;
  industry: string;
  size: string;
  company_type: string;
  founded: string;
  city: string;
  kind: string;
};

// Get all research leads
export async function getResearchLeads(): Promise<ResearchLeadWithTiers[]> {
  const userId = await SessionService.getCurrentUserId();
  if (!userId) {
    console.warn("getResearchLeads called without valid userId");
    return [];
  }

  return await prisma.lead.findMany({
    where: {
      userId,
      source: LeadSource.RADAR_API
    },
    include: { tiers: true },
    orderBy: { createdAt: "desc" }
  });
}

// Add a lead from Radar API to the shortlist
export async function addLeadToShortlist(leadData: any) {
  const userId = await SessionService.getCurrentUserId();
  if (!userId) {
    console.warn("addLeadToShortlist called without valid userId");
    return null;
  }

  const sanitizedLead = {
    source: LeadSource.RADAR_API,
    name: leadData.name ?? "",
    email: leadData.email || null,
    organization: leadData.company || null,

    // Radar API specific fields
    host: leadData.host,
    login: leadData.login,
    uuid: leadData.uuid,
    kind: leadData.kind,
    description: leadData.description || null,
    website: leadData.website || null,
    location: leadData.location || null,
    twitter: leadData.twitter || null,
    company: leadData.company || null,
    icon_url: leadData.icon_url,
    repositories_count: leadData.repositories_count || 0,
    last_synced_at: new Date(leadData.last_synced_at),
    html_url: leadData.html_url,
    total_stars: leadData.total_stars || null,
    dependent_repos_count: leadData.dependent_repos_count,
    followers: leadData.followers || null,
    following: leadData.following || null,
    maintainers: leadData.maintainers || []
  };

  return await prisma.lead.upsert({
    where: {
      host_uuid_user_unique: {
        host: sanitizedLead.host,
        uuid: sanitizedLead.uuid,
        userId
      }
    },
    update: {},
    create: {
      ...sanitizedLead,
      userId
    }
  });
}

// Remove a lead from the shortlist
export async function removeLeadFromShortlist(leadId: string) {
  const userId = await SessionService.getCurrentUserId();
  return await prisma.lead.delete({
    where: {
      id: leadId,
      userId,
      source: LeadSource.RADAR_API
    }
  });
}

export async function getShortlistedLeadsKeysList() {
  const userId = await SessionService.getCurrentUserId();
  return prisma.lead.findMany({
    where: {
      userId,
      source: LeadSource.RADAR_API
    },
    select: {
      host: true,
      uuid: true
    }
  });
}
