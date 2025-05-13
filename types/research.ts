import { Lead, Tier } from "@prisma/client";

export type ResearchKey = {
  host: string;
  uuid: string;
};

export type ResearchLeadWithTiers = Lead & { tiers: Tier[] };
