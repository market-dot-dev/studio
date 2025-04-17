import { redirect } from "next/navigation";

// @TODO: This should be a nextjs redirect, in the config, not via component
const SubscriptionsRedirect = () => {
  redirect("/c/subscriptions");
};

export default SubscriptionsRedirect;
