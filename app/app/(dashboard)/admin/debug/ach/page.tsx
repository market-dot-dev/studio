"use client";

import { useEffect, useState } from "react";
import { Card, Button, Text, TextInput } from "@tremor/react";
import { StripeCheckoutFormWrapper } from "@/app/hooks/use-stripe-payment-method-collector";
import { canBuy, getPaymentMethod } from "@/app/services/StripeService";
import useCurrentSession from "@/app/hooks/use-current-session";
import useStripeAchCollector from "@/app/hooks/use-stripe-ach-collector";
import PageHeading from "@/components/common/page-heading";
import { IntentReturn } from "@/app/hooks/use-stripe-ach-collector";

interface UserPaymentMethodWidgetProps {
  loading?: boolean;
  setError: (error: string | null) => void;
  setPaymentReady: (submitting: boolean) => void;
  maintainerUserId: string;
  maintainerStripeAccountId: string;
}

const UserAchWidget = ({
  loading,
  setPaymentReady,
  setError,
  maintainerUserId,
  maintainerStripeAccountId,
}: UserPaymentMethodWidgetProps) => {
  const { currentUser: user, refreshSession } = useCurrentSession();
  const [accountInfo, setAccountInfo] = useState<any>(); // Update the type based on the account info object structure
  const [invalidAccount, setInvalidAccount] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // detect if user has a payment method attached
  useEffect(() => {
    if (user && maintainerUserId && maintainerStripeAccountId) {
      canBuy(maintainerUserId, maintainerStripeAccountId).then((canBuy) => {
        if (canBuy) {
          getPaymentMethod(maintainerUserId, maintainerStripeAccountId)
            .then((paymentMethod) => {
              setAccountInfo(paymentMethod);
              setPaymentReady(true);
            })
            .catch((error) => {
              setError(error.message);
              setInvalidAccount(true);
            });
        }
      });
    }
  }, [
    user,
    user?.stripeCustomerIds,
    user?.stripePaymentMethodIds,
    maintainerStripeAccountId,
    maintainerUserId,
    setPaymentReady,
    setError,
  ]);

  /*
  useEffect(() => {
    if (loading && !accountInfo) {
      handleSubmit()
        .then((clientSecret: IntentReturn) => {
          // why isn't this called?
          if (clientSecret) {
            console.log("result: ", clientSecret);
            setShowConfirm(true);
          } else {
            console.log("no client secret");
          }
        })
        .then(refreshSession)
        .then(() => {
          console.log("succeeded");
          setPaymentReady(true);
        })
        .catch((error: any) => {
          console.log("failed", error.message);
          setError(error.message);
          setPaymentReady(false);
        });
    }
  }, [loading]);
  */

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    console.log('submitting ---');
    event?.preventDefault();
    return await handleSubmit()
      .then((clientSecret: IntentReturn) => {
        // why isn't this called?
        if (clientSecret) {
          console.log("result: ", clientSecret);
          setShowConfirm(true);
        } else {
          console.log("no client secret");
        }
      })
      .then(() => {
        console.log("succeeded");
        setPaymentReady(true);
      })
      .catch((error: any) => {
        console.log("failed", error.message);
        setError(error.message);
        setPaymentReady(false);
      });
  }

  const { handleSubmit, handleConfirm, handleDetach } = useStripeAchCollector({
    user,
    setError,
    maintainerUserId,
    maintainerStripeAccountId,
  });

  if (invalidAccount) {
    return (
      <Card>
        <Text>Invalid payment method. Please update your payment method.</Text>
        <Button
          type="button"
          variant="secondary"
          className="p-1"
          onClick={() => handleDetach().then(refreshSession)}
        >
          Remove
        </Button>
      </Card>
    );
  }

  if (!!accountInfo) {
    return (
      <Card>
        <div className="flex flex-row items-center justify-between">
          <Text>Use saved bank account ending in {accountInfo?.last4}</Text>
          <br />
          <Button
            type="button"
            variant="secondary"
            className="p-1"
            onClick={() => handleDetach().then(refreshSession)}
          >
            Remove
          </Button>
        </div>
      </Card>
    );
  }

  const startAttachForm = () => {
    return (
      <form onSubmit={onSubmit}>
        <Card>
          <pre>{JSON.stringify({ maintainerStripeAccountId, showConfirm }, null, 2)}</pre>
          <Text>Account Holder Name</Text>
          <TextInput
            id="account-holder-name"
            name="account_holder_name"
            required
            value="aaron graves"
          />

          <Text>Account Holder Email</Text>
          <TextInput
            id="account-holder-email"
            name="account_holder_email"
            value="aaron@gitwallet.co"
            required
          />

          <br />
          <Button type="submit">Connect Bank Account</Button>
        </Card>
      </form>
    );
  };

  const confirmAttachForm = () => {
    return (
      <form onSubmit={handleConfirm}>
        <Card>
          <pre>{JSON.stringify({ maintainerStripeAccountId }, null, 2)}</pre>
          <Text>Confirm Attach Account</Text>

          <br />
          <Button type="submit">DO IT</Button>
        </Card>
      </form>
    );
  };

  return <div>{showConfirm ? confirmAttachForm() : startAttachForm()}</div>;
};

const UserPaymentMethodWidgetWrapper = (
  props: UserPaymentMethodWidgetProps,
) => {
  return (
    <StripeCheckoutFormWrapper
      maintainerStripeAccountId={props.maintainerStripeAccountId}
    >
      {(innerProps: UserPaymentMethodWidgetProps) => (
        <UserAchWidget {...props} {...innerProps} />
      )}
    </StripeCheckoutFormWrapper>
  );
};

const AchPage = () => {
  const { refreshSession, currentUser, isSignedIn } = useCurrentSession();

  if (isSignedIn()) {
    return (
      <Card>
        <PageHeading>ACH Debug Tool</PageHeading>
        <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        <UserPaymentMethodWidgetWrapper
          maintainerUserId={currentUser.id}
          maintainerStripeAccountId={currentUser.stripeAccountId!}
          setError={() => {}}
          setPaymentReady={() => {}}
        />
      </Card>
    );
  }

  return <a href="/api/auth/signin">Sign in</a>;
};

export default AchPage;
