"use server";

import Stripe from "stripe";
import { createStripeClient } from "./create-stripe-client";

/**
 * Create a Stripe customer
 * Low-level function that directly interacts with Stripe API
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param email - Customer email
 * @param name - Optional customer name
 * @param paymentMethodId - Optional payment method to attach
 * @returns Stripe Customer object
 */
export async function createStripeCustomer(
  stripeAccountId: string,
  email: string,
  name?: string,
  paymentMethodId?: string
): Promise<Stripe.Customer> {
  const stripe = await createStripeClient(stripeAccountId);

  const payload = {
    email: email,
    ...(name ? { name } : {}),
    ...(paymentMethodId
      ? {
          payment_method: paymentMethodId,
          invoice_settings: {
            default_payment_method: paymentMethodId
          }
        }
      : {})
  };

  return await stripe.customers.create(payload);
}

/**
 * Delete a Stripe customer
 * Low-level function that directly interacts with Stripe API
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param customerId - The Stripe customer ID to delete
 */
export async function deleteStripeCustomer(
  stripeAccountId: string,
  customerId: string
): Promise<Stripe.DeletedCustomer> {
  const stripe = await createStripeClient(stripeAccountId);
  return await stripe.customers.del(customerId);
}
