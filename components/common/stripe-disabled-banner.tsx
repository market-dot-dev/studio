import Link from "next/link";
import LinkButton from "./link-button";
import { Card, Icon } from "@tremor/react";
import { AlertCircle } from "lucide-react";

const StripeDisabledBanner = () => {
  return (
    <>
      {/* <div
        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong className="font-bold">There is an issue with your Stripe Account.</strong>
        <br />
        <span className="block sm:inline">
          Please visit settings for more details.
          <LinkButton href="/settings/payment" label="Go There" />
        </span>
      </div> */}

      <Card
        className="mb-4 flex flex-row justify-between items-center bg-gray-100 border border-gray-400 px-4 py-3 text-gray-700"
        title="There is an issue with your Stripe account"
      >
        <div className="flex">
          <AlertCircle size={24} className="mr-2" />
          <p>Your Stripe account is not connected or has an issue. Please visit your <Link href="/settings/payment" className="underline">Payment Settings</Link> to resolve this issue.</p>
        </div>
        <LinkButton href="/settings/payment" label="Payment Settings" />
      </Card>
    </>
  );
};

export default StripeDisabledBanner;