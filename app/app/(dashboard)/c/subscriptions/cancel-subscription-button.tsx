"use client";

import { Subscription } from "@prisma/client";
import { destroySubscription } from "@/app/services/SubscriptionService";
import { Button } from "@tremor/react";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";

const CancelSubscriptionButton = ({ subscription }: { subscription: Subscription }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button variant="secondary" size="xs" className="w-fit" onClick={async () => {
      setLoading(true);
      destroySubscription(subscription.id).finally(() => {
        setLoading(false)
        window.location.reload();
      });
    }} >
      {loading ? <LoadingDots color="#A8A29E" /> : "Manage Subscription"}
    </Button>
  );
}

export default CancelSubscriptionButton;