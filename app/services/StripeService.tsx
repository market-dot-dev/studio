"use server";

import Stripe from 'stripe';
import Product from '../models/Product';
import UserService from './UserService';
import TierService from './TierService';
import { createSubscription as createLocalSubscription } from '@/app/services/SubscriptionService';
import { User } from '@prisma/client';
import prisma from "@/lib/prisma";

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

  static async createCustomer(email: string, paymentMethodId?: string) {
    if(!email) {
      throw new Error('Email is required to create a customer.');
    }

    let customer: Stripe.Customer;

    if(paymentMethodId) {
       customer = await stripe.customers.create({
        email: email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } else {
      customer = await stripe.customers.create({
        email: email,
      });
    }   

    return customer;
  }

  static async attachPaymentMethod(paymentMethodId: string) {
    const user = await UserService.getCurrentUser();

    if(!user || !user.stripeCustomerId) {
      throw new Error('User not found or does not have a Stripe customer ID.');
    }
    
    await stripe.paymentMethods.attach(paymentMethodId, { customer: user.stripeCustomerId });

    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    UserService.updateUser(user.id, { stripePaymentMethodId: paymentMethodId });
  }

  static async detachPaymentMethod(paymentMethodId: string) {
    const user: User = await prisma.user.findUniqueOrThrow({ where: { stripePaymentMethodId: paymentMethodId } });

    if(!user || !user.stripePaymentMethodId || !user.stripeCustomerId) {
      throw new Error('User not found or does not have a Stripe customer ID.');
    }
    
    await stripe.paymentMethods.detach(paymentMethodId);

    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: undefined,
      },
    });

    UserService.updateUser(user.id, { stripePaymentMethodId: null });
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

  static async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  }

  static async destroySubscription(subscriptionId: string) {
    await stripe.subscriptions.cancel(subscriptionId);
  }
};

interface StripeCheckoutComponentProps {
  tierId: string;
}

export const onClickSubscribe = async (userId: string, tierId: string) => {
  let status = 'pending';
  let error = null;
  let subscription = null;

  //try {
    const tier = await TierService.findTier(tierId);
    if (!tier) {
      throw new Error('Tier not found.');
    }

    if (!userId) {
      throw new Error('Not logged in.');
    }

    const user = await UserService.findUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let stripeCustomerId = user.stripeCustomerId;
    
    if (!stripeCustomerId) {
      await UserService.createStripeCustomer(user);
      const updatedUser = await UserService.findUser(userId);
      stripeCustomerId = updatedUser?.stripeCustomerId!;
    }

    console.log("===== purchasing ", {
      customer: stripeCustomerId,
      items: [{ price: tier.stripePriceId! }],
      payment_behavior: 'error_if_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: tier.stripePriceId! }],
      payment_behavior: 'error_if_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    if (!subscription) {
      throw new Error('Error creating subscription.');
    }

    const invoice = subscription.latest_invoice as Stripe.Invoice;

    if (invoice.status === 'paid') {
      await createLocalSubscription(userId, tierId);
      status = 'success';
    } else if (invoice.payment_intent) {
      throw new Error('Subscription attempt returned a payment intent, which should never happen.');
    } else {
      status = 'error';
      error = 'Unknown error occurred';
    }
  //} catch (e: any) {
  //  status = 'error';
  //  error = e.message;
  //}

  return { status, error /*, subscription*/ };
};

export const { getIntent, validatePayment, createPrice, destroyPrice, attachPaymentMethod, detachPaymentMethod } = StripeService

export default StripeService;