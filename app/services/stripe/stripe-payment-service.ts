"use server";

import { generateId } from "@/lib/utils";
import Stripe from "stripe";
import { createStripeClient } from "../create-stripe-client";
import { calculateApplicationFee } from "./stripe-price-service";

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

/**
 * Create a charge for a one-time purchase
 * Low-level function that directly interacts with Stripe API
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param stripeCustomerId - The customer ID to charge
 * @param stripePriceId - The price ID to charge
 * @param price - The price amount (in dollars)
 * @param stripePaymentMethodId - The payment method to use
 * @param applicationFeePercent - Optional application fee percentage
 * @param applicationFeePrice - Optional fixed application fee
 * @returns The confirmed payment intent
 */
export async function createStripeCharge(
  stripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  price: number,
  stripePaymentMethodId: string,
  applicationFeePercent?: number,
  applicationFeePrice?: number
): Promise<Stripe.PaymentIntent> {
  const stripe = await createStripeClient(stripeAccountId);

  // Generate a unique identifier for idempotency
  const idempotencyKey = `${stripeCustomerId}-${stripePriceId}-${generateId()}`;

  // Create a payment intent directly
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: price * 100, // Convert dollars to cents
      currency: "usd",
      customer: stripeCustomerId,
      payment_method: stripePaymentMethodId,
      off_session: true,
      confirm: true,
      application_fee_amount: await calculateApplicationFee(
        price,
        applicationFeePercent,
        applicationFeePrice
      ),
      metadata: {
        price_id: stripePriceId // Store the price ID for reference
      }
    },
    {
      idempotencyKey
    }
  );

  return paymentIntent;
}
