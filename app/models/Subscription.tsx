import { User, Tier, Subscription as SubscriptionSql } from "@prisma/client"


type SubscriptionState = 'active' | 'canceled' | 'trial';
type SubscriptionType = SubscriptionSql & { state: SubscriptionState | string; }
export type SubscriptionWithUser = SubscriptionType & { user: User, tier?: Tier};

export const SubscriptionStates = {
  active: 'active' as SubscriptionState,
  canceled: 'canceled' as SubscriptionState,
  trial: 'trial' as SubscriptionState,
}

class Subscription implements SubscriptionType {
  id: string;
  userId: string;
  tierId: string;
  state: SubscriptionState | string;
  stripeSubscriptionId: string;
  tierVersionId: string | null;
  createdAt: Date;
  activeUntil: Date | null;
  cancelledAt: Date | null;
  user?: User;
  tier?: Tier;

  constructor(subscription: SubscriptionType) {
    this.id = subscription.id;
    this.userId = subscription.userId;
    this.tierId = subscription.tierId;
    this.state = subscription.state;
    this.stripeSubscriptionId = subscription.stripeSubscriptionId;
    this.tierVersionId = subscription.tierVersionId;
    this.createdAt = subscription.createdAt;
    this.activeUntil = subscription.activeUntil;
    this.cancelledAt = subscription.cancelledAt;
  }

  isFinishingMonth() {
    return !!this.activeUntil && this.activeUntil > new Date();
  } 

  isActive(): boolean {
    return this.state === SubscriptionStates.active || this.isFinishingMonth();
  }

  isCancelled(): boolean {
    return this.state === SubscriptionStates.canceled && !this.isFinishingMonth();
  }
}

export default Subscription;