"use client";

import Subscription from "@/app/models/Subscription";
import { cancelSubscription } from "@/app/services/SubscriptionService";
import { Button } from "@tremor/react";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";

const CancelSubscriptionButton = ({ subscriptionId }: { subscriptionId: string }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button size="xs" className="w-min" variant="secondary" onClick={async() => {
      setLoading(true);
      cancelSubscription(subscriptionId).finally(() => {
        setLoading(false)
        window.location.reload();
      });
    }} >
      {loading ? <>Cancelling Subscription&nbsp;<LoadingDots color="#A8A29E" /></> : "Cancel Subscription"}
    </Button>
  );
}

export default CancelSubscriptionButton;