"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./platform-checkout-service";

/**
 * Server action for platform checkout
 */
export async function checkoutAction(formData: FormData): Promise<void> {
  const priceId = formData.get("priceId") as string;
  if (!priceId) {
    return;
  }

  await createCheckoutSession(priceId);
}

/**
 * Server action for platform customer portal
 */
export async function customerPortalAction(): Promise<void> {
  const { url } = await createCustomerPortalSession();
  redirect(url);
}
