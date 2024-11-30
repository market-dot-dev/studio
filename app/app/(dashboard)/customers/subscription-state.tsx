import { formatDate } from "@/lib/utils";
import { Subscription } from "@prisma/client";
import { Badge } from "@tremor/react";

const SubscriptionStatusBadge = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  return (
    <>
      {subscription.state === "renewing" ? (
        <Badge color="green" className="indent-0">
          Active
        </Badge>
      ) : subscription.state === "cancelled" ? (
        subscription.activeUntil ? (
          <>
            <Badge color="yellow" className="indent-0">
              Cancelled
            </Badge>
            <span className="block text-xs">
              Active Until {formatDate(subscription.activeUntil)}
            </span>
          </>
        ) : (
          <Badge color="red" className="indent-0">
            Cancelled
          </Badge>
        )
      ) : null}
    </>
  );
};

export default SubscriptionStatusBadge;
