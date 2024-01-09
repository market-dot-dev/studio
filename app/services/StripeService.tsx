"use server";

import Stripe from 'stripe';
import StripeCheckoutForm from '@/components/common/stripe-form';
import Product from '../models/Product';
import UserService from './UserService';
import TierService from './TierService';
import { FC } from 'react';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

class StripeService {
  static async getIntent(price: number) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
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

  static async createPrice(stripeProductId: string, price: number) {
    const newPrice = await stripe.prices.create({
      unit_amount: price,
      currency: 'usd',
      product: stripeProductId,
      recurring: { interval: 'month' },
    });

    return newPrice;
  }

  static async destroyPrice(stripePriceId: string) {
    await stripe.prices.update(stripePriceId, { active: false });
  }

  static async onPaymentSuccess() {
    // Implement what should happen when payment is successful
    console.log('Payment was successful');
  }

  static async createOrUpdateProduct(product: Partial<Product>) {
    try {
      // If the product already has a Stripe product ID, try to update it
      if (product.stripeProductId) {
        const existingProduct = await stripe.products.retrieve(product.stripeProductId);
        if (existingProduct) {
          const updatedProduct = await stripe.products.update(product.stripeProductId, {
            metadata: { updated: new Date().toISOString() },
          });
          return updatedProduct;
        }
      }

      // If the product does not have a Stripe product ID or it couldn't be found, create a new one
      const newProduct = await stripe.products.create({
        name: product.name || 'product-name',
        description: 'product-description',
        // Add other properties here as needed
      });

      // Update your database with the new Stripe product ID.
      return newProduct;

    } catch (error) {
      console.error('Error creating or updating Stripe product:', error);
      throw error; // Re-throw the error to handle it in the caller function or to return a failed response.
    }
  }

  static async destroyProduct(stripeProductId: string) {
    const deletedProduct = await stripe.products.del(stripeProductId);
  }

  static async createCustomer(email: string) {
    const customer = await stripe.customers.create({
      email: email,
      /*
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
      */
    });

    return customer;
  }

  static async destroyCustomer(customerId: string) {
    await stripe.customers.del(customerId);
  }

  static async createSubscription(customerId: string, priceId: string) {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  }
};

/*
export async function StripeServerComponent() {
  const clientSecret = await getIntent(1000);
  const returnUrl = `http://${process.env.HOSTNAME}/success`;

  if (!clientSecret) {
    throw new Error('Failed to load the client secret.');
  }

  return <StripeCheckoutForm clientSecret={clientSecret} returnUrl={returnUrl} />;
}
*/

interface StripeServerComponentProps {
  tierId: string;
}

export const StripeServerComponent: FC<StripeServerComponentProps> = async ({ tierId }) => {
  // This assumes you have a way to identify the logged-in user and the tier they want to subscribe to
  const userId = await UserService.getCurrentUserId();
  const tier = await TierService.findTier(tierId);

  if (!tier) {
    throw new Error('Tier not found.');
  }

  if (!userId) {
    throw new Error('Not logged in.');
  }

  // Retrieve or create a Stripe customer for the user
  const user = await UserService.findUser(userId);
  let stripeCustomerId = user?.stripeCustomerId;

  if (!user) {
    throw new Error('User not found');
  }

  if (!stripeCustomerId) {
    await UserService.createStripeCustomer(user);
    const updatedUser = await UserService.findUser(userId);
    stripeCustomerId = updatedUser?.stripeCustomerId!;
  }

  // Create the Stripe subscription
  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: tier.stripePriceId! }],
    payment_behavior: 'default_incomplete', // requires a payment method
    expand: ['latest_invoice.payment_intent'], // expands the returned object to include the payment intent
  });

  if (!subscription) {
    throw new Error('Error creating subscription.');
  }

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  

  if(invoice.status === 'paid') {
    return <>Subscribed successfully.</>;
  } else if(invoice.payment_intent) {
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    const clientSecret = paymentIntent.client_secret;
    const returnUrl = `http://${process.env.HOSTNAME}/success`;

    if (!clientSecret) {
      throw new Error('Failed to load the client secret.');
    }

    // Return the Stripe Checkout Form with the clientSecret and returnUrl
    return <StripeCheckoutForm clientSecret={clientSecret} returnUrl={returnUrl} />;
  } else {
    console.log("=================== invoice:", invoice);
    console.log("=================== subscription:", subscription);
    return <>
      <h1>Something weird happened</h1>
    </>;    
  }
};


export const { getIntent, validatePayment, createPrice, destroyPrice } = StripeService

export default StripeService;