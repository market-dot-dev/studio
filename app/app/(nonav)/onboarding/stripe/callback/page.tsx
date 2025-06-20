"use server";

import { processVendorStripeConnectCallback } from "@/app/services/stripe/stripe-vendor-service";
import { redirect } from "next/navigation";

export default async function StripeOnboardingCallbackHandler({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const code = query["code"] as string;
  const state = query["state"] as string;

  if (!code || !state) {
    redirect("/onboarding/stripe");
  }

  try {
    await processVendorStripeConnectCallback(code, state);
  } catch (error) {
    console.error("Error processing Stripe callback:", error);
  }

  redirect("/onboarding/stripe");
}
