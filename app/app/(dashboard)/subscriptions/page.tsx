import { redirect } from "next/navigation";

const SubscriptionsRedirect = () => {
  redirect("/c/subscriptions");
  return null;
}

export default SubscriptionsRedirect;