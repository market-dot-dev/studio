
"use server";

import UserService from "@/app/services/UserService";
import PageHeading from "@/components/common/page-heading";
import Link from "next/link";

const StripeDebug = async () => {
  const user = await UserService.getCurrentUser();
  if(!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="Debug Tools" />
        </div>
      </div>
      <div>
        <Link href="/admin/debug/stripe-debug">Stripe</Link> <br/>
        <Link href="/services">Feature Index</Link> <br/>
        <Link href="/settings/payment">Stripe Connect</Link> <br/>
        <Link href="/subscriptions">Your active subscriptions</Link> <br/>
      </div>
    </div>
  );
};

export default StripeDebug;