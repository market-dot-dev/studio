'use server';

import Stripe from "stripe";
import ChargeService from "../charge-service";
import SubscriptionService from "../SubscriptionService";
import { Charge } from "@prisma/client";

const parseCategory = (str: string) => {
  if (!str) return { category: null, type: null };
  const [category, ...type] = str.split('.');
  return { category, type: type.join('.') || null };
};

class StripeEventHandlers {
  static async onEvent(event: Stripe.Event) {
    const eventName = event.type;
    const { category, type: eventSubtype } = parseCategory(event.type);

    console.log(`[StripeEvent] Start processing event: ${eventName} (${category} / ${eventSubtype})`);

    if(category === 'charge'){
      const charge = event.data.object as Stripe.Charge;
      const existingCharge = await ChargeService.findChargeByStripeId(charge.payment_intent as string);

      if(!existingCharge) {
        console.log('Charge not found:', charge.id);
        return;
      }

      await StripeEventHandlers.onChargeStatus(charge, existingCharge);
    } else if (eventName === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const charge = await ChargeService.findChargeByStripeId(paymentIntent.id);

      if(!charge) {
        console.log('Charge not found:', paymentIntent.id);
        return;
      }

      await StripeEventHandlers.onPaymentIntentFailure(paymentIntent, charge);
    } else if (eventName === 'customer.subscription.deleted') {
      await StripeEventHandlers.onCustomerSubscriptionDeleted(event.data.object) 
    } else {
      console.log('Unhandled event:', eventName);
      return;
    }
  }

  static async onCustomerSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log(`[StripeEvent] Canceling subscription ${subscription.id}`);
    await SubscriptionService.handleStripeCancelledSubscription(subscription.id);
  }

  static async onPaymentIntentFailure(paymentIntent: Stripe.PaymentIntent, charge: Charge) {
    console.log(`[StripeEvent] Updating charge ${paymentIntent.id}: ${charge.stripeStatus} -> ${paymentIntent.status}`);
    await ChargeService.update(charge.id, { stripeStatus: paymentIntent.status, error: paymentIntent.last_payment_error?.message });
  }

  // This method will be called when a customer.subscription.created event is received
  static async onChargeStatus(stripeCharge: Stripe.Charge, charge: Charge) {
    console.log(`[StripeEvent] Updating charge ${charge.id}: ${charge.stripeStatus} -> ${stripeCharge.status}`);

    let error = undefined;
    if(stripeCharge.status === 'failed') error = stripeCharge.failure_message || stripeCharge.failure_code || undefined;
    
    await ChargeService.update(charge.id, { stripeStatus: stripeCharge.status, error });    
  }
};

export default StripeEventHandlers;