"use client";

import { Subscription } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { formatSubscriptionExpiryDate } from "@/lib/utils";
import {
  isCancelled,
  isFinishingMonth,
  isRenewing,
  type SubscriptionStatusType
} from "@/types/subscription";
import { type VariantProps } from "class-variance-authority";
import { Clock, RefreshCw } from "lucide-react";

type BadgeVariant = NonNullable<VariantProps<typeof Badge>["variant"]>;

interface SubscriptionStatusDisplay {
  type: SubscriptionStatusType;
  text: string;
  badgeVariant: BadgeVariant;
  icon?: React.ReactNode;
}

const getSubscriptionStatusDisplay = (subscription: Subscription): SubscriptionStatusDisplay => {
  if (isRenewing(subscription)) {
    return {
      type: "active_renewing",
      text: "Subscribed",
      badgeVariant: "success",
      icon: <RefreshCw size={12} strokeWidth={2.5} />
    };
  }

  if (isCancelled(subscription) && isFinishingMonth(subscription)) {
    return {
      type: "cancelled_active",
      text: formatSubscriptionExpiryDate(subscription.activeUntil),
      badgeVariant: "warning",
      icon: <Clock size={12} strokeWidth={2.5} />
    };
  }

  return {
    type: "expired",
    text: "Expired",
    badgeVariant: "secondary"
  };
};

export const SubscriptionStatusBadge = ({ subscription }: { subscription: Subscription }) => {
  if (!subscription) return null;

  const { icon, text, badgeVariant } = getSubscriptionStatusDisplay(subscription);

  return (
    <Badge variant={badgeVariant} className="inline-flex items-center">
      {icon}
      {text}
    </Badge>
  );
};
