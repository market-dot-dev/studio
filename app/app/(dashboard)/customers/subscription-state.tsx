import { Subscription } from "@prisma/client";
import { Badge, Text } from "@tremor/react";

const SubscriptionStatusBadge = ({ subscription }: { subscription: Subscription }) => {
    return (
        <>
            {subscription.state === "renewing" ?
                <Badge color="green">Active</Badge> :
                    subscription.state === "cancelled" && subscription.activeUntil ?
                    <>
                        <Badge color="yellow">Cancelled</Badge>
                        <Text className="text-xs">Active Until {subscription.activeUntil?.toLocaleDateString()}</Text>
                    </>
                    :
                    subscription.state === "cancelled" && !subscription.activeUntil ?
                        <Badge color="red">Cancelled</Badge> : ""
            }
        </>
    )
}

export default SubscriptionStatusBadge;