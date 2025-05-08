"use server";

import { processVendorStripeConnectCallback } from "@/app/services/stripe-vendor-service";
import { redirect } from "next/navigation";

export default async function StripeCallbackHandler({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const code = query["code"] as string;
  const state = query["state"] as string;

  if (!code || !state) {
    redirect("/settings/payment?error=missing_parameters");
  }

  try {
    // Process the callback
    await processVendorStripeConnectCallback(code, state);
  } catch (error) {
    console.error("Error processing Stripe callback:", error);
    redirect("/settings/payment?error=connection_failed");
  }

  // Only redirect outside the try/catch if successful
  redirect("/settings/payment");
}
