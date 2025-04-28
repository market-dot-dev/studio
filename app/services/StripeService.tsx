"use server";

import { type StripeCard } from "@/types/stripe";
import Stripe from "stripe";

/** @DEPRECATED: Use appropiate server functions instead. */
class StripeService {
  stripe: Stripe;
  stripeAccountId: string;

  constructor(accountId: string) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      stripeAccount: accountId
    });
    this.stripeAccountId = accountId;
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
}

export default StripeService;
