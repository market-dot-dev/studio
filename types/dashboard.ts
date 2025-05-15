import { Charge, Prospect, Subscription, User } from "@/app/generated/prisma";
import Tier from "@/app/models/Tier";

/**
 * Type for customer with charges, subscriptions, and prospects
 */
export type CustomerWithChargesSubscriptionsAndProspects = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
  prospects: (Prospect & { tiers: Tier[] })[];
};

/**
 * Type for customer with their charges and subscriptions
 */
export type CustomerWithChargesAndSubscriptions = User & {
  charges: (Charge & { tier: Tier })[];
  subscriptions: (Subscription & { tier: Tier })[];
};
