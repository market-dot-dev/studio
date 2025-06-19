"use server";

import { PlanType } from "@/app/generated/prisma";
import { generateId } from "@/lib/utils";
import Stripe from "stripe";
import { createStripeClient } from "./create-stripe-client";
import { calculatePlatformFee } from "./stripe-price-service";

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
 * Attach a payment method to a Stripe customer and set it as default
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param paymentMethodId - The payment method ID to attach
 * @param stripeCustomerId - The customer ID to attach to
 * @returns The attached payment method
 */
export async function attachStripePaymentMethod(
  stripeAccountId: string,
  paymentMethodId: string,
  stripeCustomerId: string
): Promise<Stripe.PaymentMethod> {
  const stripe = await createStripeClient(stripeAccountId);

  const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
    customer: stripeCustomerId
  });

  await stripe.customers.update(stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  });

  return paymentMethod;
}

/**
 * Detach a payment method from a Stripe customer
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param paymentMethodId - The payment method ID to detach
 * @param stripeCustomerId - The customer ID to detach from
 * @returns The detached payment method
 */
export async function detachStripePaymentMethod(
  stripeAccountId: string,
  paymentMethodId: string,
  stripeCustomerId: string
): Promise<Stripe.PaymentMethod> {
  const stripe = await createStripeClient(stripeAccountId);

  const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

  // Clear the default payment method on the customer
  await stripe.customers.update(stripeCustomerId, {
    invoice_settings: {
      default_payment_method: undefined
    }
  });

  return paymentMethod;
}

/**
 * Retrieve a payment method from Stripe
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param paymentMethodId - The payment method ID to retrieve
 * @returns The payment method details
 */
export async function retrieveStripePaymentMethod(
  stripeAccountId: string,
  paymentMethodId: string
): Promise<Stripe.PaymentMethod> {
  const stripe = await createStripeClient(stripeAccountId);
  return await stripe.paymentMethods.retrieve(paymentMethodId);
}

/**
 * Create a setup intent for collecting payment method details
 *
 * @param stripeAccountId - The vendor's Stripe account ID
 * @param stripeCustomerId - The customer ID to create setup intent for
 * @returns The setup intent
 */
export async function createStripeSetupIntent(
  stripeAccountId: string,
  stripeCustomerId: string
): Promise<Stripe.SetupIntent> {
  const stripe = await createStripeClient(stripeAccountId);

  return await stripe.setupIntents.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    usage: "off_session"
  });
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
 * @param vendorPlanType - The vendor organization's plan type for fee calculation
 * @returns The confirmed payment intent
 */
export async function createStripeCharge(
  stripeAccountId: string,
  stripeCustomerId: string,
  stripePriceId: string,
  price: number,
  stripePaymentMethodId: string,
  vendorPlanType: PlanType | null
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
      application_fee_amount: calculatePlatformFee(price, vendorPlanType),
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
