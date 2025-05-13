import Tier from "@/app/models/Tier";
import { Charge, Lead, Subscription, User } from "@prisma/client";

/**
 * Type for customer with charges, subscriptions, and prospects
 */
export type CustomerWithChargesSubscriptionsAndLeads = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  leads: (Lead & { tiers: Tier[] })[];
};

/**
 * Type for customer with their charges and subscriptions
 */
export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};
