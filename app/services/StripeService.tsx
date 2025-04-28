"use server";

import { type StripeCard } from "@/types/stripe";
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
}

export default StripeService;
