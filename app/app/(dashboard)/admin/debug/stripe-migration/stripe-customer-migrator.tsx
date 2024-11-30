"use client";

import { Button } from "@tremor/react";
import { useState } from "react";
import stripe from "stripe";
import { migrateCustomer } from "@/app/services/StripeService";

const StripeCustomerMigrator = ({
  userId,
  maintainerUserId,
  stripeCustomerId,
  stripeAccountId,
  stripeSecretKey,
  stripePaymentMethodId,
  userName,
  userEmail,
}: {
  stripeCustomerId: string;
  stripeAccountId: string;
  maintainerUserId: string;
  userId: string;
  stripeSecretKey: string;
  stripePaymentMethodId: string;
  userName: string;
  userEmail: string;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const migrateCustomers = async () => {
    setDisabled(true);
    const stripeApi = new stripe(stripeSecretKey);

    const oldCustomer = await stripeApi.customers.retrieve(stripeCustomerId);

    console.log("==== old customer", oldCustomer);

    const paymentMethod = await stripeApi.paymentMethods.create(
      {
        customer: stripeCustomerId,
        payment_method: stripePaymentMethodId,
      },
      {
        stripeAccount: stripeAccountId,
      },
    );

    const payload = {
      email: userEmail,

      ...(userName ? { name: userName } : {}),
      ...(paymentMethod.id
        ? {
            payment_method: paymentMethod.id,
            invoice_settings: {
              default_payment_method: paymentMethod.id,
            },
          }
        : {}),
    };

    const customer = await stripeApi.customers.create(payload, {
      stripeAccount: stripeAccountId,
    });

    const result = {
      stripeCustomerId: customer.id,
      stripePaymentMethodId: customer.invoice_settings.default_payment_method,
    };

    console.log("=============", result);

    const paymentMethodId = customer.invoice_settings.default_payment_method;

    await migrateCustomer(
      userId,
      customer.id,
      paymentMethodId as string,
      maintainerUserId,
      stripeAccountId,
    );

    setOutput(
      `Migrated customer: ${customer.id} => {${JSON.stringify(result)}} `,
    );

    setDisabled(false);
  };

  return (
    <Button onClick={migrateCustomers} disabled={disabled}>
      Migrate
    </Button>
  );
};

export default StripeCustomerMigrator;
