import { createStripeClient } from "@/app/services/stripe/create-stripe-client";
import {
  handleAccountEvent,
  handleChargeEvent,
  handleSubscriptionEvent
} from "@/app/services/stripe/stripe-webhook-service";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;
  const stripe = await createStripeClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Account events
      case "account.updated":
      case "account.application.deauthorized":
        await handleAccountEvent(event);
        break;

      // Subscription events
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event);
        break;

      // Charge refund event
      case "charge.refunded":
        await handleChargeEvent(event);
        break;

      /*
      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
        await handleInvoiceEvent(event.type, event.data.object as Stripe.Invoice);
        break;
      */

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, error);
    return NextResponse.json(
      {
        error: `Error processing webhook: ${error instanceof Error ? error.message : "Unknown error"}`
      },
      { status: 500 }
    );
  }
}
