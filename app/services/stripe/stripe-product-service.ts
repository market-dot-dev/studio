"use server";

import Stripe from "stripe";
import { createStripeClient } from "../create-stripe-client";

/**
 * Creates a new product in Stripe
 *
 * @param stripeAccountId - The Stripe account ID
 * @param name - The product name
 * @param description - Optional product description
 * @returns The created Stripe product
 */
export async function createStripeProduct(
  stripeAccountId: string,
  name: string,
  description?: string
): Promise<Stripe.Product> {
  const stripe = await createStripeClient(stripeAccountId);
  return await stripe.products.create({
    name,
    description
  });
}

/**
 * Updates an existing product in Stripe
 *
 * @param stripeAccountId - The Stripe account ID
 * @param productId - The Stripe product ID
 * @param name - The new product name
 * @param description - Optional new product description
 * @returns The updated Stripe product
 */
export async function updateStripeProduct(
  stripeAccountId: string,
  productId: string,
  name: string,
  description?: string
): Promise<Stripe.Product> {
  const stripe = await createStripeClient(stripeAccountId);
  return await stripe.products.update(productId, {
    name,
    description
  });
}

/**
 * Deletes a product from Stripe
 *
 * @param stripeAccountId - The Stripe account ID
 * @param stripeProductId - The Stripe product ID
 * @returns The deleted Stripe product
 */
export async function deleteStripeProduct(stripeAccountId: string, stripeProductId: string) {
  const stripe = await createStripeClient(stripeAccountId);

  return await stripe.products.del(stripeProductId);
}
