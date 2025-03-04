import LinkButton from "./link-button";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const StripeDisabledBanner = () => {
  return (
    <Card
      className="mb-4 flex flex-row justify-between items-center bg-gray-100 border border-gray-400 px-4 py-3 text-gray-700 w-full"
    >
      <div className="flex flex-row items-center">
        <AlertCircle size={24} className="mr-2 h-full" />
        <div className="flex flex-col">
          <strong>There is an issue with your Stripe Account.</strong>
          <p className="text-sm text-stone-500">Your Stripe account is not connected or has an issue that may prevent sales. Please visit your <a href="/settings/payment" className="underline">Payment Settings</a> to resolve this issue.</p>
        </div>
      </div>
      <LinkButton href="/settings/payment" label="Payment Settings" />
    </Card>
  );
};

export default StripeDisabledBanner;