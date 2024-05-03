"use client";

import { useEffect, useState } from "react";
import { Card, Button, Text, TextInput } from "@tremor/react";
import { StripeCheckoutFormWrapper } from "@/app/hooks/use-stripe-payment-method-collector";
import { canBuy, getPaymentMethod } from "@/app/services/StripeService";
import useCurrentSession from "@/app/hooks/use-current-session";
import useStripeAchCollector from "@/app/hooks/use-stripe-ach-collector";
import { IntentReturn } from "@/app/hooks/use-stripe-ach-collector";
import { User } from "@prisma/client";
import { findUser } from "@/app/services/UserService";

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
  const [maintainer, setMaintainer] = useState<User>();

  useEffect(() => {
    if (maintainerUserId) {
      findUser(maintainerUserId).then((user) =>
        user ? setMaintainer(user) : null
      );
    }
  }, [maintainerUserId])

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

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    return handleSubmit()
      .then((clientSecret: IntentReturn) => {
        if (clientSecret) {
          console.log("result: ", clientSecret);
          setShowConfirm(true);
        } else {
          console.log("no client secret", clientSecret);
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

  const onConfirm = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    return handleConfirm()
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
          Click to securely onnect your bank account via stripe.
          <br/>
          <Button type="submit">Connect</Button>
        </Card>
      </form>
    );
  };

  const confirmAttachForm = () => {
    const maintainerName = maintainer?.company || maintainer?.name;

    return (
      <form onSubmit={onConfirm}>
        <Card>
          <Text>Confirm Attach Account</Text>

          <div>
          By clicking [accept], you authorize {maintainerName} to debit the bank account specified above for any amount owed for charges arising from your use of {maintainerName}&apos; services and/or purchase of products from {maintainerName}, pursuant to {maintainerName}&apos; website and terms, until this authorization is revoked. You may amend or cancel this authorization at any time by providing notice to {maintainerName} with 30 (thirty) days notice.
          <br/>
          If you use {maintainerName}&apos; services or purchase additional products periodically pursuant to {maintainerName}&apos; terms, you authorize {maintainerName} to debit your bank account periodically. Payments that fall outside of the regular debits authorized above will only be debited after your authorization is obtained.
          </div>

          <br />
          <Button type="submit">Attach payment method</Button>
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

export default UserPaymentMethodWidgetWrapper;
