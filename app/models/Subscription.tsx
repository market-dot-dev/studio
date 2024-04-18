import { User, Tier, Subscription as SubscriptionSql } from "@prisma/client"


type SubscriptionState = 'active' | 'cancelled' | 'trial';
type SubscriptionType = SubscriptionSql & { state: SubscriptionState | string; tier?: Tier; user?: User;}
export type SubscriptionWithUser = SubscriptionType & { user: User, tier?: Tier};

export const SubscriptionStates: Record<string, SubscriptionState> = {
  renewing: 'renewing' as SubscriptionState,
  cancelled: 'cancelled' as SubscriptionState,
}

class Subscription implements SubscriptionType {
  id: string;
  userId: string;
  tierId: string;
  state: SubscriptionState | string;
  stripeSubscriptionId: string;
  tierVersionId: string | null;
  tierRevision: number | null;
  createdAt: Date;
  activeUntil: Date | null;
  cancelledAt: Date | null;
  user?: User;
  tier?: Tier;
  priceAnnual: boolean;

  constructor(subscription: SubscriptionType) {
    this.id = subscription.id;
    this.userId = subscription.userId;
    this.tierId = subscription.tierId;
    this.state = subscription.state;
    this.stripeSubscriptionId = subscription.stripeSubscriptionId;
    this.tierVersionId = subscription.tierVersionId;
    this.tierRevision = subscription.tierRevision;
    this.createdAt = subscription.createdAt;
    this.activeUntil = subscription.activeUntil;
    this.cancelledAt = subscription.cancelledAt;
    this.user = subscription.user;
    this.tier = subscription.tier;
    this.priceAnnual = subscription.priceAnnual;
  }

  isFinishingMonth() {
    return !!this.activeUntil && this.activeUntil > new Date();
  }

  isRenewing(): boolean {
    return this.state === SubscriptionStates.renewing;
  }

  isActive(): boolean {
    return this.isRenewing() || this.isFinishingMonth();
  }

  isCancelled(): boolean {
    return this.state === SubscriptionStates.cancelled;
  }
}

export default Subscription;