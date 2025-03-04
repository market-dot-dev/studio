"use client";

import { cancelSubscription } from "@/app/services/SubscriptionService";
import { Button } from "@tremor/react";
import { useCallback, useState } from "react";
import { useModal } from "@/components/modal/provider";


const CancelSubscriptionButton = ({ subscriptionId }: { subscriptionId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { show, hide } = useModal();

  const showWarning = () => {
    const modalHeader = <h2 className="text-xl font-bold">Restore Onboarding State</h2>;
    show(
      <CancelSubscriptionContent subscriptionId={subscriptionId} hide={hide} setParentLoading={setLoading} />,
      hide,
      true, // ignoreFocusTrap
      modalHeader,
      'w-full md:w-2/3 lg:w-1/2'
    );
  }
  return (
    <Button size="xs" className="w-min" variant="primary" color="red" loading={loading} disabled={loading} onClick={showWarning}>Cancel Subscription</Button>
  );
}

function CancelSubscriptionContent({ subscriptionId, hide, setParentLoading }: { subscriptionId: string, hide: () => void, setParentLoading: (loading: boolean) => void }) {

  const [ loading, setLoading] = useState<boolean>(false);

  const handleCancelSubscription = useCallback(() => {
    setLoading(true);
    setParentLoading(true);
    cancelSubscription(subscriptionId).finally(() => {
      setLoading(false)
      window.location.reload();
    });

  }, [subscriptionId, cancelSubscription, setLoading, setParentLoading]);

  return (

    <div className="flex flex-col gap-12 p-4">
      <p className="text-sm text-stone-500">Are you sure, you want to cancel your subscription?</p>
      <div className="flex gap-4">
        <Button size="xs" className="w-min" variant="primary" color="red" loading={loading} disabled={loading} onClick={handleCancelSubscription} >
          {loading ? "Cancelling Subscription" : "Cancel Subscription"}
        </Button>
        <Button size="xs" className="w-min" variant="secondary" disabled={loading} onClick={hide}>No, Keep Subscription</Button>
      </div>
    </div>

  )

}

export default CancelSubscriptionButton;