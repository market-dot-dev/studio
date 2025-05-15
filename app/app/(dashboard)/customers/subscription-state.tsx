"use client";

import { Subscription } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const SubscriptionStatusBadge = ({ subscription }: { subscription: Subscription }) => {
  return (
    <>
      {subscription.state === "renewing" && (
        <Badge variant="success" className="indent-0">
          Active
        </Badge>
      )}

      {subscription.state === "cancelled" && subscription.activeUntil && (
        <>
          <Badge variant="secondary" className="indent-0">
            Cancelled, Ends {formatDate(subscription.activeUntil)}
          </Badge>
        </>
      )}

      {subscription.state === "cancelled" && !subscription.activeUntil && (
        <Badge variant="destructive" className="indent-0">
          Cancelled
        </Badge>
      )}
    </>
  );
};

export default SubscriptionStatusBadge;
