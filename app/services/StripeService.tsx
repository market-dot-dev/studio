"use server";

//app/services/StripeService.tsx

import Stripe from 'stripe';
import StripeCheckoutForm from '@/components/common/stripe-form';
import { on } from 'events';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

class StripeService {
  static async getIntent() {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // replace with the actual amount
      currency: 'usd',
    });

    return paymentIntent.client_secret;
  }

  static async validatePayment(paymentIntentId: string, clientSecret: string) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.client_secret !== clientSecret) {
      throw new Error('Payment validation failed: Client secret does not match.');
    } else if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment validation failed: Payment did not succeed.');
    } else {
      StripeService.onPaymentSuccess();
    }
    return true;
  }

  static async onPaymentSuccess() {
    // Implement what should happen when payment is successful
    console.log('Payment was successful');
  }
};

export async function StripeServerComponent() {
  const clientSecret = await getIntent();
  const returnUrl = `http://${process.env.HOSTNAME}/success`;

  if (!clientSecret) {
    throw new Error('Failed to load the client secret.');
  }

  return <StripeCheckoutForm clientSecret={clientSecret} returnUrl={returnUrl} />;
}

export const { getIntent, validatePayment } = StripeService

export default StripeService;