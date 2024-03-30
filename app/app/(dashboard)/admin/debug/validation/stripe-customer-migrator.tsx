"use client";

import { Button } from "@tremor/react";
import { useState } from "react";
import stripe from "stripe";
import { migrateCustomer } from "@/app/services/StripeService";

const StripeCustomerMigrator = ({ userId, maintainerUserId, stripeCustomerId, stripeAccountId, stripeSecretKey }: { 
  stripeCustomerId: string;
  stripeAccountId: string;
  maintainerUserId: string;
  userId: string;
  stripeSecretKey: string;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  
  const migrateCustomers = async () => {
    setDisabled(true);
    const stripeApi = new stripe(stripeSecretKey);

    const token = await stripeApi.tokens.create(
      {
        customer: stripeCustomerId,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    const customer = await stripeApi.customers.create(
      {
        source: token.id,
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    const result = {
      stripeCustomerId: customer.id,
      stripePaymentMethodId: customer.invoice_settings.default_payment_method,
    };

    console.log("=============", result);

    const paymentMethodId = customer.invoice_settings.default_payment_method;

    await migrateCustomer(userId, customer.id, paymentMethodId as string, maintainerUserId, stripeAccountId);

    setOutput(`Migrated customer: ${customer.id} => {${JSON.stringify(result)}} `);

    setDisabled(false);
  };

  return <Button onClick={migrateCustomers} disabled={disabled} >Migrate</Button>;
};

export default StripeCustomerMigrator;