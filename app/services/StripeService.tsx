"use server";

import Stripe from "stripe";
import UserService from "./UserService";
import TierService from "./TierService";
import { createSubscription as createLocalSubscription } from "@/app/services/SubscriptionService";
import { Tier, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import Customer from "../models/Customer";
import { createLocalCharge } from "./charge-service";

export type StripeCard = {
  brand: string;
  last4: string;
};

import {
  GLOBAL_APPLICATION_FEE_DOLLARS,
  GLOBAL_APPLICATION_FEE_PCT,
} from "@/app/config/stripe-fees";
import { getRootUrl } from "@/lib/domain";

export type SubscriptionCadence = "month" | "year" | "quarter" | "once";

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
  StripeAccountDisabled = "err_stripe_account_disabled",
}

const errorMessageMapping: Record<ErrorMessageCode, string> = {
  [ErrorMessageCode.UserNotFound]: "User not found.",
  [ErrorMessageCode.StripeAccountNotConnected]:
    "You need to connect your Stripe account.",
  [ErrorMessageCode.StripeProductIdCreationFailed]:
    "Error creating stripe product id.",
  [ErrorMessageCode.StripeChargeNotEnabled]:
    "Stripe account cannot currently charge customers. Check your Stripe dashboard for more details.",
  [ErrorMessageCode.StripePayoutNotEnabled]:
    "Stripe account cannot currently perform payouts. Check your Stripe dashboard for more details.",
  [ErrorMessageCode.StripeAccountInfoFetchError]:
    "Error fetching stripe account info.",
  [ErrorMessageCode.StripeAccountDisabled]: "Your Stripe account is disabled.",
};

const connStripe = async (stripeAccountId: string) => {
  if (!stripeAccountId) {
    throw new Error("Stripe account not connected");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    stripeAccount: stripeAccountId,
  });
};

const platformStripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

class StripeService {
  stripe: any;
  stripeAccountId: string;

  constructor(accountId: string) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      stripeAccount: accountId,
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
        const account = (await platformStripe.accounts.retrieve(
          user.stripeAccountId,
        )) as any;

        // Extracting only relevant information
        accountInfo = {
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          country: account.country,
          defaultCurrency: account.default_currency,
          requirements: {
            currentlyDue: account.requirements.currently_due,
            disabledReason: account.requirements.disabled_reason,
          },
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
    const reasons = JSON.stringify(
      messageCodes.map((code) => StripeService.getErrorMessage(code)),
    );
    UserService.updateCurrentUser({
      stripeAccountDisabled: !canSell,
      stripeAccountDisabledReason: reasons,
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
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.client_secret !== clientSecret) {
      throw new Error(
        "Payment validation failed: Client secret does not match.",
      );
    } else if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment validation failed: Payment did not succeed.");
    } else {
      StripeService.onPaymentSuccess();
    }
    return true;
  }

  async createPrice(
    stripeProductId: string,
    price: number,
    cadence: SubscriptionCadence = "month",
  ) {
    const attrs: any = {
      unit_amount: price * 100, // Stripe requires the price in cents
      currency: "usd",
      product: stripeProductId,
    };

    if (cadence === "quarter") {
      attrs["recurring"] = {
        interval: "month",
        interval_count: 3,
      };
    } else if (cadence !== "once") {
      attrs["recurring"] = {
        interval: cadence,
      };
    }

    return await this.stripe.prices.create(attrs);
  }

  async destroyPrice(stripePriceId: string) {
    await this.stripe.prices.update(stripePriceId, { active: false });
  }

  static async onPaymentSuccess() {
    // Implement what should happen when payment is successful
    console.log("Payment was successful");
  }

  async createProduct(name: string, description?: string) {
    const product = await this.stripe.products.create({
      name,
      description,
    });

    return product;
  }

  async updateProduct(productId: string, name: string, description?: string) {
    const product = await this.stripe.products.update(productId, {
      name,
      description,
    });

    return product;
  }

  async destroyProduct(stripeProductId: string) {
    const deletedProduct = await this.stripe.products.del(stripeProductId);
  }

  static async userCanSell(user: User) {
    return !!user.stripeAccountId;
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
    paymentMethodId?: string,
  ): Promise<Stripe.Customer> {
    const payload = {
      email: email,
      ...(name ? { name } : {}),
      ...(paymentMethodId
        ? {
            payment_method: paymentMethodId,
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          }
        : {}),
    };

    return await this.stripe.customers.create(payload);
  }

  async attachPaymentMethod(paymentMethodId: string, stripeCustomerId: string) {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    await this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  async getPaymentMethod(
    paymentMethodId: string,
    maintainerId: string,
  ): Promise<StripeCard> {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);

    // Check if the retrieved payment method is of type 'card'
    if (paymentMethod.type !== "card" || !paymentMethod.card) {
      throw new Error(
        "Invalid payment method type or card details not available.",
      );
    }

    const { brand, last4 } = paymentMethod.card;
    return { brand, last4 };
  }

  async detachPaymentMethod(paymentMethodId: string, stripeCustomerId: string) {
    await this.stripe.paymentMethods.detach(paymentMethodId);
    await this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: undefined,
      },
    });
  }

  async destroyCustomer(customerId: string) {
    await this.stripe.customers.del(customerId);
  }

  async createSubscription(
    stripeCustomerId: string,
    stripePriceId: string,
    trialDays: number = 0,
  ) {
    return await this.stripe.subscriptions.create(
      {
        customer: stripeCustomerId,
        items: [{ price: stripePriceId! }],
        payment_behavior: "error_if_incomplete",
        expand: ["latest_invoice.payment_intent"],
        trial_period_days: trialDays,
      },
      {
        idempotencyKey: `${stripeCustomerId}-${stripePriceId}`,
      },
    );
  }

  static async calculateApplicationFee(
    price: number,
    applicationFeePercent: number = 0,
    applicationFeePrice: number = 0,
  ) {
    const totalPercent =
      (applicationFeePercent + (GLOBAL_APPLICATION_FEE_PCT || 0)) / 100;
    const totalFee =
      applicationFeePrice + (GLOBAL_APPLICATION_FEE_DOLLARS || 0);

    return Math.round(price * totalPercent) + totalFee;
  }

  async createCharge(
    stripeCustomerId: string,
    stripePriceId: string,
    price: number,
    stripePaymentMethodId: string,
    applicationFeePercent?: number,
    applicationFeePrice?: number,
  ) {
    const timestampMod10 = (Date.now() % 10000).toString().padStart(4, "0"); // Convert to string and pad with leading zeros if necessary

    const invoice = await this.stripe.invoices.create({
      customer: stripeCustomerId,
      auto_advance: true,
      currency: "usd",
      collection_method: "charge_automatically",
      application_fee_amount: await StripeService.calculateApplicationFee(
        price,
        applicationFeePercent,
        applicationFeePrice,
      ),
    });

    await this.stripe.invoiceItems.create({
      customer: stripeCustomerId,
      invoice: invoice.id,
      price: stripePriceId,
    });

    const finalInvoice = await this.stripe.invoices.finalizeInvoice(invoice.id);

    const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(
      finalInvoice.payment_intent,
      {
        payment_method: stripePaymentMethodId,
      },
      {
        idempotencyKey: `${stripeCustomerId}-${stripePriceId}-${timestampMod10}`,
      },
    );

    return confirmedPaymentIntent;
  }

  async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await this.stripe.subscriptions.update(
      subscriptionId,
      {
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
      },
    );

    return subscription;
  }

  static async cancelSubscription(
    subscriptionId: string,
    stripeAccountId: string,
  ) {
    return await (
      await connStripe(stripeAccountId)
    ).subscriptions.cancel(subscriptionId);
  }

  static async generateStripeCSRF(userId: string) {
    return `${userId}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
  }

  static async getOAuthLink(userId: string) {
    const user = await UserService.findUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const state =
      user.stripeCSRF || (await StripeService.generateStripeCSRF(userId));

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
      status: "active",
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
      code,
    });

    const connectedAccountId = response.stripe_user_id;
    await UserService.updateUser(user.id, {
      stripeAccountId: connectedAccountId,
      stripeCSRF: null,
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

interface StripeCheckoutComponentProps {
  tierId: string;
}

export const onClickSubscribe = async (
  userId: string,
  tierId: string,
  annual: boolean,
) => {
  let subscription = null;

  const tier = await TierService.findTier(tierId);
  if (!tier) {
    throw new Error("Tier not found.");
  }

  if (!userId) {
    throw new Error("Not logged in.");
  }

  const user = await UserService.findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const maintainer = await UserService.findUser(tier.userId);

  if (!maintainer) {
    throw new Error("Maintainer not found.");
  }

  if (!maintainer.stripeAccountId) {
    throw new Error("Maintainer does not have a connected Stripe account.");
  }

  const customer = new Customer(
    user,
    maintainer.id,
    maintainer.stripeAccountId,
  );

  let stripeCustomerId = await customer.getOrCreateStripeCustomerId();
  const stripeService = new StripeService(maintainer.stripeAccountId);

  const stripePriceId = annual ? tier.stripePriceIdAnnual : tier.stripePriceId;

  if (!stripePriceId) {
    throw new Error("Tier does not have a Stripe Price ID.");
  }

  console.log("[purchase]: maintainer, product check");

  if (tier.cadence === "once") {
    const charge = await stripeService.createCharge(
      stripeCustomerId,
      stripePriceId,
      tier.price!,
      await customer.getStripePaymentMethodId(),
      tier.applicationFeePercent || 0,
      tier.applicationFeePrice || 0,
    );

    if (charge.status === "succeeded") {
      await createLocalCharge(userId, tierId, charge.id);
    } else {
      console.log("[purchase]: FAIL charge failed", charge);
      throw new Error("Error creating charge on stripe: " + charge.status);
    }
  } else {
    if (await stripeService.isSubscribedToTier(stripeCustomerId, tier)) {
      console.log("[purchase]: FAIL already subscribed");
      throw new Error(
        "You are already subscribed to this product. If you dont see it in your dashboard, please contact support.",
      );
    } else {
      subscription = await stripeService.createSubscription(
        stripeCustomerId,
        stripePriceId,
        tier.trialDays,
      );
    }

    if (!subscription) {
      console.log("[purchase]: FAIL could not create stripe subscription");
      throw new Error("Error creating subscription on stripe");
    } else {
      console.log("[purchase]: stripe subscription created");
      const invoice = subscription.latest_invoice as Stripe.Invoice;

      if (invoice.status === "paid") {
        await createLocalSubscription(userId, tierId, subscription.id);
        console.log("[purchase]: invoice paid");
      } else if (invoice.payment_intent) {
        throw new Error(
          "Subscription attempt returned a payment intent, which should never happen.",
        );
      } else {
        throw new Error(
          `Unknown error occurred: subscription status was ${subscription.status}`,
        );
      }
    }
  }
};

const getCustomer = async (
  maintainerId: string,
  maintainerStripeAccountId: string,
): Promise<Customer> => {
  const user = await UserService.getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  return new Customer(user, maintainerId, maintainerStripeAccountId);
};

export const attachPaymentMethod = async (
  paymentMethodId: string,
  maintainerUserId: string,
  maintainerStripeAccountId: string,
) => {
  const customer = await getCustomer(
    maintainerUserId,
    maintainerStripeAccountId,
  );
  const stripeCustomerId = await customer.getOrCreateStripeCustomerId();
  await customer.attachPaymentMethod(paymentMethodId);
};

export const detachPaymentMethod = async (
  maintainerUserId: string,
  maintainerStripeAccountId: string,
) => {
  const customer = await getCustomer(
    maintainerUserId,
    maintainerStripeAccountId,
  );
  await customer.detachPaymentMethod();
};

export const getPaymentMethod = async (
  maintainerUserId: string,
  maintainerStripeAccountId: string,
): Promise<StripeCard> => {
  const customer = await getCustomer(
    maintainerUserId,
    maintainerStripeAccountId,
  );
  return await customer.getStripePaymentMethod();
};

export const canBuy = async (
  maintainerUserId: string,
  maintainerStripeAccountId: string,
) => {
  return (
    await getCustomer(maintainerUserId, maintainerStripeAccountId)
  ).canBuy();
};

export const {
  disconnectStripeAccount,
  userHasStripeAccountIdById,
  getAccountInfo,
  calculateApplicationFee,
} = StripeService;

export default StripeService;
