"use server";

import { type StripeCard } from "@/types/stripe";
import { Tier } from "@prisma/client";
import Stripe from "stripe";
import { calculateApplicationFee } from "./stripe-price-service";

const connStripe = async (stripeAccountId: string) => {
  if (!stripeAccountId) {
    throw new Error("Stripe account not connected");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    stripeAccount: stripeAccountId
  });
};

class StripeService {
  stripe: any;
  stripeAccountId: string;

  constructor(accountId: string) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      stripeAccount: accountId
    });
    this.stripeAccountId = accountId;
  }

  async validatePayment(paymentIntentId: string, clientSecret: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.client_secret !== clientSecret) {
      throw new Error("Payment validation failed: Client secret does not match.");
    } else if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment validation failed: Payment did not succeed.");
    } else {
      console.log("Payment was successful");
    }
    return true;
  }

  async createCustomer(
    email: string,
    name?: string,
    paymentMethodId?: string
  ): Promise<Stripe.Customer> {
    const payload = {
      email: email,
      ...(name ? { name } : {}),
      ...(paymentMethodId
        ? {
            payment_method: paymentMethodId,
            invoice_settings: {
              default_payment_method: paymentMethodId
            }
          }
        : {})
    };

    return await this.stripe.customers.create(payload);
  }

  /** @DEPRECATED: Use checkout-service instead. */
  async attachPaymentMethod(paymentMethodId: string, stripeCustomerId: string) {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId
    });

    await this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
  }

  /** @DEPRECATED: Use checkout-service instead. */
  async getPaymentMethod(paymentMethodId: string, maintainerId: string): Promise<StripeCard> {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

    // Check if the retrieved payment method is of type 'card'
    if (paymentMethod.type !== "card" || !paymentMethod.card) {
      throw new Error("Invalid payment method type or card details not available.");
    }

    const { brand, last4 } = paymentMethod.card;
    return { brand, last4 };
  }

  /** @DEPRECATED: Use checkout-service instead. */
  async detachPaymentMethod(paymentMethodId: string, stripeCustomerId: string) {
    await this.stripe.paymentMethods.detach(paymentMethodId);
    await this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: undefined
      }
    });
  }

  async destroyCustomer(customerId: string) {
    await this.stripe.customers.del(customerId);
  }

  async createSubscription(stripeCustomerId: string, stripePriceId: string, trialDays: number = 0) {
    return await this.stripe.subscriptions.create(
      {
        customer: stripeCustomerId,
        items: [{ price: stripePriceId! }],
        payment_behavior: "error_if_incomplete",
        expand: ["latest_invoice.payment_intent"],
        trial_period_days: trialDays
      },
      {
        idempotencyKey: `${stripeCustomerId}-${stripePriceId}`
      }
    );
  }

  async createCharge(
    stripeCustomerId: string,
    stripePriceId: string,
    price: number,
    stripePaymentMethodId: string,
    applicationFeePercent?: number,
    applicationFeePrice?: number
  ) {
    const timestampMod10 = (Date.now() % 10000).toString().padStart(4, "0"); // Convert to string and pad with leading zeros if necessary

    const invoice = await this.stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: true,
      currency: "usd",
      collection_method: "charge_automatically",
      application_fee_amount: await calculateApplicationFee(
        price,
        applicationFeePercent,
        applicationFeePrice
      )
    });

    await this.stripe.invoiceItems.create({
      customer: stripeCustomerId,
      invoice: invoice.id,
      price: stripePriceId
    });

    const finalInvoice = await this.stripe.invoices.finalizeInvoice(invoice.id);

    const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(
      finalInvoice.payment_intent,
      {
        payment_method: stripePaymentMethodId
      },
      {
        idempotencyKey: `${stripeCustomerId}-${stripePriceId}-${timestampMod10}`
      }
    );

    return confirmedPaymentIntent;
  }

  async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await this.stripe.subscriptions.update(subscriptionId, {
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"]
    });

    return subscription;
  }

  static async cancelSubscription(subscriptionId: string, stripeAccountId: string) {
    return await (await connStripe(stripeAccountId)).subscriptions.cancel(subscriptionId);
  }

  async isSubscribedToTier(stripeCustomerId: string, tier: Tier) {
    return (
      (tier.stripePriceId
        ? await this.isSubscribed(stripeCustomerId, tier.stripePriceId)
        : false) ||
      (tier.stripePriceIdAnnual
        ? await this.isSubscribed(stripeCustomerId, tier.stripePriceIdAnnual)
        : false)
    );
  }

  async isSubscribed(stripeCustomerId: string, stripePriceId: string) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      price: stripePriceId,
      status: "active"
    });

    return subscriptions.data.length > 0;
  }
}

export default StripeService;
