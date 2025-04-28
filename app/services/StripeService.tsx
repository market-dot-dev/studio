"use server";

import { getRootUrl } from "@/lib/domain";
import prisma from "@/lib/prisma";
import { StripeCard } from "@/types/checkout";
import { Tier } from "@prisma/client";
import Stripe from "stripe";
import { calculateApplicationFee } from "./stripe-price-service";
import UserService from "./UserService";

interface HealthCheckResult {
  canSell: boolean;
  messageCodes: ErrorMessageCode[];
  disabledReasons?: string[];
}

enum ErrorMessageCode {
  UserNotFound = "err_user_not_found",
  StripeAccountNotConnected = "err_stripe_account_not_connected",
  StripeProductIdCreationFailed = "err_stripe_product_id_creation_failed",
  StripeChargeNotEnabled = "err_stripe_charge_enabled_false",
  StripePayoutNotEnabled = "err_stripe_payout_enabled_false",
  StripeAccountInfoFetchError = "err_stripe_account_info_fetch_fail",
  StripeAccountDisabled = "err_stripe_account_disabled"
}

const errorMessageMapping: Record<ErrorMessageCode, string> = {
  [ErrorMessageCode.UserNotFound]: "User not found.",
  [ErrorMessageCode.StripeAccountNotConnected]: "You need to connect your Stripe account.",
  [ErrorMessageCode.StripeProductIdCreationFailed]: "Error creating stripe product id.",
  [ErrorMessageCode.StripeChargeNotEnabled]:
    "Stripe account cannot currently charge customers. Check your Stripe dashboard for more details.",
  [ErrorMessageCode.StripePayoutNotEnabled]:
    "Stripe account cannot currently perform payouts. Check your Stripe dashboard for more details.",
  [ErrorMessageCode.StripeAccountInfoFetchError]: "Error fetching stripe account info.",
  [ErrorMessageCode.StripeAccountDisabled]: "Your Stripe account is disabled."
};

const connStripe = async (stripeAccountId: string) => {
  if (!stripeAccountId) {
    throw new Error("Stripe account not connected");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    stripeAccount: stripeAccountId
  });
};

const platformStripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

class StripeService {
  stripe: any;
  stripeAccountId: string;

  constructor(accountId: string) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      stripeAccount: accountId
    });
    this.stripeAccountId = accountId;
  }

  static async getAccountInfo() {
    const user = await UserService.getCurrentUser();

    if (!user) {
      throw new Error("User not found");
    }

    let accountInfo = null;

    if (user.stripeAccountId) {
      try {
        const account = (await platformStripe.accounts.retrieve(user.stripeAccountId)) as any;

        // Extracting only relevant information
        accountInfo = {
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          country: account.country,
          defaultCurrency: account.default_currency,
          requirements: {
            currentlyDue: account.requirements.currently_due,
            disabledReason: account.requirements.disabled_reason
          }
        };
      } catch (error) {
        console.error("Error fetching Stripe account info:", error);
        throw error;
      }
    }

    return { user, accountInfo };
  }

  static getErrorMessage(code: ErrorMessageCode): string {
    return errorMessageMapping[code] || "An unknown error occurred.";
  }

  static async performStripeAccountHealthCheck(): Promise<HealthCheckResult> {
    const { messageCodes, canSell, disabledReasons } =
      await StripeService.stripeAccountHealthCheck();
    const reasons = JSON.stringify(messageCodes.map((code) => StripeService.getErrorMessage(code)));
    UserService.updateCurrentUser({
      stripeAccountDisabled: !canSell,
      stripeAccountDisabledReason: reasons
    });

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

        if (accountInfo.requirements.disabledReason) {
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

  async validatePayment(paymentIntentId: string, clientSecret: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.client_secret !== clientSecret) {
      throw new Error("Payment validation failed: Client secret does not match.");
    } else if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment validation failed: Payment did not succeed.");
    } else {
      StripeService.onPaymentSuccess();
    }
    return true;
  }

  static async onPaymentSuccess() {
    // Implement what should happen when payment is successful
    console.log("Payment was successful");
  }

  static async userHasStripeAccountIdById() {
    const user = await UserService.getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    return !!user.stripeAccountId;
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

  static async generateStripeCSRF(userId: string) {
    return `${userId}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
  }

  static async getOAuthLink(userId: string) {
    const user = await UserService.findUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const state = user.stripeCSRF || (await StripeService.generateStripeCSRF(userId));

    if (!user.stripeCSRF) {
      await UserService.updateUser(userId, { stripeCSRF: state }); // Save the state in your database for later verification
    }

    const redirectUri = getRootUrl("app", "/settings/payment");
    const oauthLink = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.STRIPE_CLIENT_ID}&scope=read_write&state=${state}&redirect_uri=${redirectUri}`;

    return oauthLink;
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

  static async handleOAuthResponse(code: string, state: string) {
    // Verify the state parameter
    const user = await prisma.user.findUnique({ where: { stripeCSRF: state } });

    if (!user) {
      throw new Error("Invalid state parameter");
    }

    const response = await platformStripe.oauth.token({
      grant_type: "authorization_code",
      code
    });

    const connectedAccountId = response.stripe_user_id;
    await UserService.updateUser(user.id, {
      stripeAccountId: connectedAccountId,
      stripeCSRF: null
    });

    return connectedAccountId;
  }

  static async disconnectStripeAccount(userId: string) {
    const user = await UserService.findUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.stripeAccountId) {
      throw new Error("User does not have a connected Stripe account");
    }

    await UserService.updateUser(userId, { stripeAccountId: null });
  }
}

export const { disconnectStripeAccount, userHasStripeAccountIdById, getAccountInfo } =
  StripeService;

export default StripeService;
