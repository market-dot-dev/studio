"use client"

import { formatDate } from "@/lib/utils";
import { Subscription } from "@prisma/client";
import { Badge } from "@/components/ui/badge"

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
}

export default SubscriptionStatusBadge;