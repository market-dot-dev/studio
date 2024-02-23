"use server";

import Stripe from 'stripe';
import Product from '../models/Product';
import UserService from './UserService';
import TierService from './TierService';
import { createSubscription as createLocalSubscription } from '@/app/services/SubscriptionService';
import { User } from '@prisma/client';
import prisma from "@/lib/prisma";
import DomainService from './domain-service';
import ProductService from './ProductService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export type StripeCard = {
  brand: string;
  last4: string;
}

interface HealthCheckResult {
  canSell: boolean;
  messageCodes: ErrorMessageCode[];
  disabledReasons?: string[];
}

enum ErrorMessageCode {
  UserNotFound = 'err_user_not_found',
  StripeAccountNotConnected = 'err_stripe_account_not_connected',
  StripeProductIdCreationFailed = 'err_stripe_product_id_creation_failed',
  StripeChargeNotEnabled = 'err_stripe_charge_enabled_false',
  StripePayoutNotEnabled = 'err_stripe_payout_enabled_false',
  StripeAccountInfoFetchError = 'err_stripe_account_info_fetch_fail',
  StripeAccountDisabled = 'err_stripe_account_disabled',
}

const errorMessageMapping: Record<ErrorMessageCode, string> = {
  [ErrorMessageCode.UserNotFound]: 'User not found.',
  [ErrorMessageCode.StripeAccountNotConnected]: 'You need to connect your Stripe account.',
  [ErrorMessageCode.StripeProductIdCreationFailed]: 'Error creating stripe product id.',
  [ErrorMessageCode.StripeChargeNotEnabled]: 'Stripe account cannot currently charge customers. Check your Stripe dashboard for more details.',
  [ErrorMessageCode.StripePayoutNotEnabled]: 'Stripe account cannot currently perform payouts. Check your Stripe dashboard for more details.',
  [ErrorMessageCode.StripeAccountInfoFetchError]: 'Error fetching stripe account info.',
  [ErrorMessageCode.StripeAccountDisabled]: 'Your Stripe account is disabled.',
};

class StripeService {
  static async getAccountInfo() {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error('User not found');
    }

    let accountInfo = null;
    
    if (user.stripeAccountId) {
      try {
        const account = await stripe.accounts.retrieve(user.stripeAccountId) as any;
        
        // Extracting only relevant information
        accountInfo = {
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          country: account.country,
          defaultCurrency: account.default_currency,
          requirements: {
            currentlyDue: account.requirements.currently_due,
            disabledReason: account.requirements.disabled_reason,
          }
        };
      
      } catch (error) {
        console.error('Error fetching Stripe account info:', error);
        throw error;
      }
    }

    return { user, accountInfo};
  }

  static getErrorMessage(code: ErrorMessageCode): string {
    return errorMessageMapping[code] || 'An unknown error occurred.';
  }

  static async performStripeAccountHealthCheck(): Promise<HealthCheckResult> {
    const { messageCodes, canSell, disabledReasons } = await StripeService.stripeAccountHealthCheck();
    const reasons = JSON.stringify(messageCodes.map(code => StripeService.getErrorMessage(code)));
    UserService.updateCurrentUser({ stripeAccountDisabled: !canSell, stripeAccountDisabledReason: reasons });

    return { messageCodes, canSell, disabledReasons };
  }

  static async stripeAccountHealthCheck(): Promise<HealthCheckResult> {
    const messageCodes: ErrorMessageCode[] = [];
    let canSell = true;
    let disabledReasons = [];

    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error(ErrorMessageCode.UserNotFound);
    }

    if (!user.stripeAccountId) {
      messageCodes.push(ErrorMessageCode.StripeAccountNotConnected);
      canSell = false;
    }

    if (!user.stripeProductId) {
      try {
        await ProductService.createProduct(user.id);
      } catch (error) {
        console.error("Error creating stripe product id", error);
        messageCodes.push(ErrorMessageCode.StripeProductIdCreationFailed);
        canSell = false;
      }
    }

    try {
      const { accountInfo } = await StripeService.getAccountInfo();

      if (accountInfo) {
        if (!accountInfo.chargesEnabled) {
            messageCodes.push(ErrorMessageCode.StripeChargeNotEnabled);
            canSell = false;
        }

        if (!accountInfo.payoutsEnabled) {
            messageCodes.push(ErrorMessageCode.StripePayoutNotEnabled);
            canSell = false;
        }

        if(accountInfo.requirements.disabledReason) {
          messageCodes.push(ErrorMessageCode.StripeAccountDisabled);
          disabledReasons = Array(accountInfo.requirements.disabledReason);
          canSell = false;
        }
      }
    } catch (error) {
        console.error("Error fetching stripe account info", error);
        messageCodes.push(ErrorMessageCode.StripeAccountInfoFetchError);
        canSell = false;
    }

    return { canSell, messageCodes, disabledReasons };
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
      unit_amount: price * 100, // Stripe requires the price in cents
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

  static async userCanSell(user: User) {
    return !!user.stripeAccountId && !!user.stripeProductId;
  }

  static async userHasStripeAccountIdById() {
    const user = await UserService.getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }
    return !!user.stripeAccountId;
  }

  static async userCanSellById() {
    const user = await UserService.getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }
    return StripeService.userCanSell(user);
  }

  static async userCanBuy(user: User) {
    return !!user.stripeCustomerId && !!user.stripePaymentMethodId;
  }

  static async createCustomer(email: string, name: string, paymentMethodId?: string) {
    if(!email) {
      throw new Error('Email is required to create a customer.');
    }

    let customer: Stripe.Customer;

    // const address = {
    //   city: 'Los Angeles',
    //   country: 'US',
    //   line1: '1234 Main St',
    //   line2: 'Apt 123',
    //   postal_code: '90001',
    //   state: 'CA',
    // }

    if(paymentMethodId) {
       customer = await stripe.customers.create({
        email: email,
        ...(name ? { name } : {}),
        // for now hard coding the address for debugging purposes
        // address,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } else {
      customer = await stripe.customers.create({
        email: email,
        ...(name ? { name } : {}),
        // for now hard coding the address for debugging purposes
        // address,
      });
    }   

    return customer;
  }

  static async attachPaymentMethod(paymentMethodId: string) {
    const user = await UserService.getCurrentUser();

    if(!user) {
      throw new Error('User not found.');
    }

    let stripeCustomerId = user.stripeCustomerId;

    if(!user.stripeCustomerId) {
      stripeCustomerId = await UserService.createStripeCustomer(user);
    }

    if(!stripeCustomerId) {
      throw new Error('Failed to create a Stripe customer.');
    }
    
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId });

    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    UserService.updateUser(user.id, { stripePaymentMethodId: paymentMethodId });
  }

  static async getPaymentMethod(paymentMethodId: string): Promise<StripeCard> {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    // Check if the retrieved payment method is of type 'card'
    if (paymentMethod.type !== 'card' || !paymentMethod.card) {
      throw new Error('Invalid payment method type or card details not available.');
    }

    const { brand, last4 } = paymentMethod.card;
    return { brand, last4 };
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

  static async cancelSubscription(subscriptionId: string) {
    await stripe.subscriptions.cancel(subscriptionId);
  }

  static async generateStripeCSRF(userId: string) {
    return `${userId}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
  }

  static async getOAuthLink(userId: string) {
    const user = await UserService.findUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    const state = user.stripeCSRF || await StripeService.generateStripeCSRF(userId);

    if(!user.stripeCSRF) {
      await UserService.updateUser(userId, { stripeCSRF: state }); // Save the state in your database for later verification
    }

    const redirectUri = DomainService.getRootUrl("app", "/settings/payment");
    const oauthLink = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write&state=${state}&redirect_uri=${redirectUri}`;
  
    return oauthLink;
  }

  static async handleOAuthResponse(code: string, state: string) {
    // Verify the state parameter
    const user = await prisma.user.findUnique({ where: { stripeCSRF: state } });
    
    if (!user) {
      throw new Error('Invalid state parameter');
    }
  
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });
  
    const connectedAccountId = response.stripe_user_id;
    await UserService.updateUser(user.id, { stripeAccountId: connectedAccountId, stripeCSRF: null });
  
    return connectedAccountId;
  }

  static async disconnectStripeAccount(userId: string) {
    const user = await UserService.findUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if(!user.stripeAccountId) {
      throw new Error('User does not have a connected Stripe account');
    }

    await UserService.updateUser(userId, { stripeAccountId: null });
  
  }
};

interface StripeCheckoutComponentProps {
  tierId: string;
}

export const onClickSubscribe = async (userId: string, tierId: string) => {
  let status = 'pending';
  let error = null;
  let subscription = null;

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

  const maintainer = await UserService.findUser(tier.userId);

  if (!maintainer) {
    throw new Error('Maintainer not connected to tier.');
  }

  if (!maintainer.stripeAccountId) {
    throw new Error("Maintainer hasn't connected stripe account.");
  }

  console.log("===== purchasing ", {
    customer: stripeCustomerId,
    items: [{ price: tier.stripePriceId! }],
    payment_behavior: 'error_if_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
  try {
    subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: tier.stripePriceId! }],
      payment_behavior: 'error_if_incomplete',
      expand: ['latest_invoice.payment_intent'],
      transfer_data: {
        destination: maintainer.stripeAccountId,
      },
      on_behalf_of: maintainer.stripeAccountId,
    });
  } catch (e: any) {
    error = error ?? e.message;
  }

  if (!subscription) {
    error = error ?? 'Error creating subscription.';
  } else {

    const invoice = subscription.latest_invoice as Stripe.Invoice;

    if (invoice.status === 'paid') {
      await createLocalSubscription(userId, tierId);
      status = 'success';
    } else if (invoice.payment_intent) {
      throw new Error('Subscription attempt returned a payment intent, which should never happen.');
    } else {
      status = 'error';
      error = error ?? 'Unknown error occurred';
    }
  }

  return { status, error /*, subscription*/ };
};


export const { validatePayment, createPrice, destroyPrice, attachPaymentMethod, detachPaymentMethod, getPaymentMethod, disconnectStripeAccount, userCanSellById, userHasStripeAccountIdById, getAccountInfo } = StripeService

export default StripeService;