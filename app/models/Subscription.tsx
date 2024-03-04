import { User, Tier, Subscription as SubscriptionSql } from "@prisma/client"


export type SubscriptionWithUser = Subscription & { user: User, tier?: Tier};
type SubscriptionState = 'active' | 'canceled' | 'trial';
type Subscription = SubscriptionSql & { state: SubscriptionState | string; }

export const SubscriptionStates = {
  active: 'active' as SubscriptionState,
  canceled: 'canceled' as SubscriptionState,
  trial: 'trial' as SubscriptionState,
}

export default Subscription;