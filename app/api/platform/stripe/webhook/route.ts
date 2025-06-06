import { handleSubscriptionChange } from "@/app/services/platform";
import { createStripeClient } from "@/app/services/stripe/create-stripe-client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const platformWebhookSecret = process.env.PLATFORM_STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    const stripe = await createStripeClient();
    event = stripe.webhooks.constructEvent(payload, signature, platformWebhookSecret);
  } catch (err) {
    console.error("Platform webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  console.log(`Platform webhook received: ${event.type}`);

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription: Stripe.Subscription = event.data.object;
      await handleSubscriptionChange(subscription);
      break;
    }
    default:
      console.log(`Unhandled platform event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
