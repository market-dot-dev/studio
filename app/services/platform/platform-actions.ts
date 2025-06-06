"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession, createCustomerPortalSession } from "./platform-checkout-service";

/**
 * Server action for platform checkout
 */
export async function checkoutAction(formData: FormData): Promise<void> {
  try {
    const priceId = formData.get("priceId") as string;

    if (!priceId) {
      throw new Error("Price ID is required");
    }

    const { url } = await createCheckoutSession(priceId);
    redirect(url);
  } catch (error) {
    console.error("Platform checkout error:", error);
    redirect("/settings/billing?error=checkout_failed");
  }
}

/**
 * Server action for platform customer portal
 */
export async function customerPortalAction(): Promise<void> {
  try {
    const { url } = await createCustomerPortalSession();
    redirect(url);
  } catch (error) {
    console.error("Platform customer portal error:", error);
    redirect("/settings/billing?error=portal_failed");
  }
}
