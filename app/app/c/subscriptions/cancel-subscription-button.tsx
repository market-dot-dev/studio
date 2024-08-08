"use client";

import { cancelSubscription } from "@/app/services/SubscriptionService";
import { Button, Text, Title } from "@tremor/react";
import { useState } from "react";
import LoadingDots from "@/components/icons/loading-dots";
import { useModal } from "@/components/modal/provider";

const CancelSubscriptionButton = ({ subscriptionId }: { subscriptionId: string }) => {
  const [loading, setLoading] = useState(false);
  const { show, hide } = useModal();

  const showWarning = () => {
    const modalHeader = <Title>Cancel Subscription</Title>;
    show(
        <div className="flex flex-col gap-12 p-4">
          <Text>Are you sure, you want to cancel your subscription?</Text>
          <div className="flex gap-4">
           <Button size="xs" className="w-min" variant="primary" color="red" onClick={async() => {
            setLoading(true);
            cancelSubscription(subscriptionId).finally(() => {
              setLoading(false)
              window.location.reload();
            });
          }} >
            {loading ? <>Cancelling Subscription&nbsp;<LoadingDots color="#A8A29E" /></> : "Cancel Subscription"}
          </Button>
          <Button size="xs" className="w-min" variant="secondary" onClick={hide}>No, Keep Subscription</Button>
          </div>
        </div>,
        hide,
        true, // ignoreFocusTrap
        modalHeader,
        'w-full md:w-2/3 lg:w-1/2'
    );
}
  return (
    <Button size="xs" className="w-min" variant="primary" color="red" onClick={showWarning}>Cancel Subscription</Button>
  );
}

export default CancelSubscriptionButton;