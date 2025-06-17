import { PlanType } from "@/app/generated/prisma";
import { getBillingByStripeCustomerId, updateBilling } from "@/app/services/platform";
import { createStripeClient } from "@/app/services/stripe/create-stripe-client";
import { getRootUrl } from "@/lib/domain";
import { mapStripeStatusToSubscriptionStatus } from "@/types/platform";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");
  const status = searchParams.get("status");

  const billingPageUrl = getRootUrl("app", "/settings/billing");

  console.log("Platform checkout route called");

  if (!sessionId) {
    if (status === "cancelled") {
      return NextResponse.redirect(new URL(`${billingPageUrl}?status=cancelled`, request.url));
    }
    return NextResponse.redirect(new URL(`${billingPageUrl}?status=error`, request.url));
  }

  try {
    const stripe = await createStripeClient();

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"]
    });

    if (!session.customer || typeof session.customer === "string") {
      throw new Error("Invalid customer data from Stripe.");
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error("No subscription found for this session.");
    }

    // Retrieve the subscription to get plan details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"]
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error("No plan found for this subscription.");
    }

    // Type guard to ensure we have a product object with id
    if (!plan.product || typeof plan.product === "string" || !plan.product.id) {
      throw new Error("Invalid product data for this subscription.");
    }

    const product = plan.product as Stripe.Product;
    const productId = product.id;

    const clientReferenceId = session.client_reference_id;
    if (!clientReferenceId) {
      throw new Error("No client reference ID found in session.");
    }

    // Extract user and org IDs from client reference
    const [userId, orgId] = clientReferenceId.split("-");

    // Get the platform billing record by Stripe customer ID
    const billing = await getBillingByStripeCustomerId(customerId);
    if (!billing) {
      throw new Error("Platform billing record not found.");
    }

    const mappedStatus = mapStripeStatusToSubscriptionStatus(subscription.status);

    // Update the platform billing information - upgrade to PRO plan
    await updateBilling(billing.organizationId, {
      planType: PlanType.PRO,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripeProductId: productId,
      subscriptionStatus: mappedStatus
    });

    return NextResponse.redirect(new URL(`${billingPageUrl}?status=success`, request.url));
  } catch (error) {
    console.error("Platform checkout error:", error);
    return NextResponse.redirect(new URL(`${billingPageUrl}?status=error`, request.url));
  }
}
