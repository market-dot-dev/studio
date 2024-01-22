import { useEffect, useState } from "react";
import { findSubscriptions } from "../services/SubscriptionService";
import { Subscription } from "@prisma/client";

const useMySubscriptions = (userId: string) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>();

  const refreshSubscriptions = () => {
    findSubscriptions().catch(console.error).then((subscriptions) => subscriptions && setSubscriptions(subscriptions))
  }

  useEffect(() => refreshSubscriptions(), [userId]);

  return [subscriptions, refreshSubscriptions] as const;
}

export default useMySubscriptions;