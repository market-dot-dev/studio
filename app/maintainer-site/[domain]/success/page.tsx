"use server";

import { getRootUrl } from "@/lib/domain";
/*
import PrimaryButton from '@/components/common/link-button';
import PageHeading from '@/components/common/page-heading';
import { Card } from '@tremor/react';
*/
import { redirect } from "next/navigation";

const SubscriptionSuccess = () => {
  /*
  return (
    <Card>
      <PageHeading>Success</PageHeading>
      <div className="mt-5">
        Click here to go to Gitwallet view and manage your subscriptions
      </div>
      <PrimaryButton href={DomainService.getRootUrl('app', '/subscriptions')} className="mt-2" label="Go to Gitwallet" />
    </Card>
  );
  */
  redirect(getRootUrl("app", "/"));
};

export default SubscriptionSuccess;
