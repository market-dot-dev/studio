"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./platform-checkout-service";

/**
 * Server action for platform checkout
 */
export async function checkoutAction(formData: FormData): Promise<void> {
  const priceId = formData.get("priceId") as string;
  const returnPath = formData.get("returnPath") as string | null;

  if (!priceId) {
    return;
  }

  await createCheckoutSession(priceId, returnPath || undefined);
}

/**
 * Server action for platform customer portal
 */
export async function customerPortalAction(formData: FormData): Promise<void> {
  const returnPath = formData.get("returnPath") as string | null;
  const { url } = await createCustomerPortalSession(returnPath || undefined);

  redirect(url);
}
