'use server';

import TierService from "@/app/services/TierService";
import CheckoutPage from "./checkout-page-client";
import UserService from "@/app/services/UserService";
import FeatureService from "@/app/services/feature-service";
import SubscriptionService from "@/app/services/SubscriptionService";

const CheckoutPageWrapper = async ({ params } : { params: { id: string } & any} ) => {
  const user = await UserService.getCurrentSessionUser();
  const tier = await TierService.findTier(params.id);
  const maintainer = await UserService.findUser(tier?.userId!);
  const features = await FeatureService.findByTierId(params.id);
  const isSubscribed = user?.id && await SubscriptionService.isSubscribedByTierId(user?.id, params.id) || false;
  if(!tier || !maintainer) return <></>;
  return <CheckoutPage id={params.id} tier={tier} maintainer={maintainer} features={features} isSubscribed={isSubscribed} />;
};

export default CheckoutPageWrapper;