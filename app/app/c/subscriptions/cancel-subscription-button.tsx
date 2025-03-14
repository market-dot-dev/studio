"use client";

import { cancelSubscription } from "@/app/services/SubscriptionService";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useModal } from "@/components/modal/provider";


const CancelSubscriptionButton = ({ subscriptionId }: { subscriptionId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { show, hide } = useModal();

  const showWarning = () => {
    const modalHeader = <h2 className="text-xl font-bold">Cancel Subscription</h2>;
    show(
      <CancelSubscriptionContent subscriptionId={subscriptionId} hide={hide} setParentLoading={setLoading} />,
      hide,
      true, // ignoreFocusTrap
      modalHeader,
      'w-full md:w-2/3 lg:w-1/2'
    );
  }
  return (
    <Button
      size="sm"
      variant="destructive"
      loading={loading}
      loadingText="Cancelling Subscription"
      disabled={loading}
      className="w-min"
      onClick={showWarning}
    >
      Cancel Subscription
    </Button>
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
      <p className="text-sm text-stone-500">
        Are you sure, you want to cancel your subscription?
      </p>
      <div className="flex gap-4">
        <Button
          size="sm"
          className="w-min"
          variant="destructive"
          loading={loading}
          loadingText="Cancelling Subscription"
          disabled={loading}
          onClick={handleCancelSubscription}
        >
          Cancel subscription
        </Button>
        <Button
          size="sm"
          className="w-min"
          variant="secondary"
          disabled={loading}
          onClick={hide}
        >
          No, keep subscription
        </Button>
      </div>
    </div>
  );

}

export default CancelSubscriptionButton;