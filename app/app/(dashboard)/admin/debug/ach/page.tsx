"use client";

import { Card } from "@tremor/react";
import useCurrentSession from "@/app/hooks/use-current-session";
import PageHeading from "@/components/common/page-heading";

import UserAchWidget from "@/components/payments/user-ach-widget";
import { useState } from "react";

const AchPage = () => {
  const { refreshSession, currentUser, isSignedIn } = useCurrentSession();
  const [paymentReady, setPaymentReady] = useState(false);

  if (isSignedIn()) {
    return (
      <Card>
        <PageHeading>ACH Debug Tool</PageHeading>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <UserAchWidget
          paymentReady={paymentReady}
          maintainerUserId={currentUser.id}
          maintainerStripeAccountId={currentUser.stripeAccountId!}
          setError={() => {}}
          setPaymentReady={setPaymentReady}
        />
      </Card>
    );
  }

  return <a href="/api/auth/signin">Sign in</a>;
};

export default AchPage;
